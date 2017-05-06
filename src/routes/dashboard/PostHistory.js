import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Auth from '../../components/Utils/Auth.js';
import {Button, DropdownButton, MenuItem, Modal} from 'react-bootstrap';

class PostsHistory extends React.Component {

  static propTypes = {
    pageId: PropTypes.string,
    pageToken: PropTypes.string
  }.isRequired

  constructor(props) {
    super(props);
    this.state = {
      publishedPosts: [],
      unpublishedPosts: [],
      scheduledPosts: [],
      removeModal: false,
      removeModalRef: "",
    };

    this.fetchPublishedPosts = this.fetchPublishedPosts.bind(this);
    this.fetchUnpublishedPosts = this.fetchUnpublishedPosts.bind(this);
    this.publishPost = this.publishPost.bind(this);
    this.getPostViews = this.getPostViews.bind(this);
    this.returnDateTimeString = this.returnDateTimeString.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeModals = this.closeModals.bind(this);
    this.openModals = this.openModals.bind(this);
    this.removePost = this.removePost.bind(this);
  }

  componentDidMount() {
    this.fetchUnpublishedPosts();
    this.fetchPublishedPosts();
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  }

  removePost(e){
    FB.api(
      `/${this.state.removeModalRef}`,
      'DELETE',
      {
        access_token: `${this.props.pageToken}`,
      },
      (response) => {
        console.log(response);
        if (response.success){
          this.closeModals();
          this.fetchPublishedPosts();
        }
      },
    );
  }

  openModals(action, id, message){

    if (action == 'delete')
      this.setState({
        removeModal : true,
        removeModalRef: id,
      })
  }

  closeModals() {
    this.setState({
      removeModal: false,
      removeModalRef: ""
    })
  }

  //fetch each unpublished posts with particular fields
  fetchUnpublishedPosts() {
    FB.api(
      `/${this.props.pageId}/promotable_posts?fields=scheduled_publish_time,message,created_time`,
      'GET',
      {
        access_token: `${this.props.pageToken}`,
        is_published: false,
      },
      (response) => {
        console.log(response);
        if (response.data){
          response.data.forEach((d, i) => {
            FB.api(
              `/${d.id}/insights/post_impressions_unique`,
              'GET',
              {
                access_token: `${this.props.pageToken}`,
              },
              (res) => {
                console.log(res);
                response.data[i].views = res.data[0].values[0].value;

                this.setState({
                  unpublishedPosts: response.data,
                });
              },
            );
          });

        }
      },
    );
  }

  //For each published posts, get its number of impressions
  fetchPublishedPosts() {
    FB.api(
      `/${this.props.pageId}/posts`,
      'GET',
      {
        access_token: `${this.props.pageToken}`,
      },
      (response) => {
        console.log('Fetched published posts...', response);

        if (response.data){
          response.data.forEach((d, i) => {
            FB.api(
              `/${d.id}/insights/post_impressions_unique`,
              'GET',
              {
                access_token: `${this.props.pageToken}`,
              },
              (res) => {
                console.log(res);
                response.data[i].views = res.data[0].values[0].value;

                this.setState({
                  publishedPosts: response.data,
                });
              },
            );
          });
        }
        this.setState({
          publishedPosts: response.data,
        });
      },
    );
  }

  //Publish unpublished post
  publishPost(id) {
    FB.api(
      `/${id}/`,
      'POST',
      {
        access_token: `${this.props.pageToken}`,
        is_published: true,
      },
      (response) => {
        this.fetchPublishedPosts();
        this.fetchUnpublishedPosts();
      },
    );
  }

  //Get unique post impressions
  getPostViews(id) {
    FB.api(
      `/${id}/insights/post_impressions_unique`,
      'GET',
      {
        access_token: `${this.props.pageToken}`,
      },
      (response) => {
        console.log(response);
      },
    );
  }

  //Return formatted date/time
  returnDateTimeString(time){
    let d = new Date(time);
    let hours = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
    let minutes = "0" + d.getMinutes();
    let seconds = "0" + d.getSeconds();

    let formattedTime = d.toDateString() + " "
                        + hours + ":"
                        + minutes.substr(-2) + ":"
                        + seconds.substr(-2)

    return formattedTime;
  }
  render() {

    return (
      <div>
        <h4>Published: </h4>
        {
          this.state.publishedPosts.map(pp => (

            <section className="panel panel-info">
              <header className="panel-heading">
                <h5 className="panel-title">{ this.returnDateTimeString(pp.created_time) }</h5>
              </header>
              <div className="panel-body">
                <p>{pp.message}</p>
                <div><b>Views:</b> {pp.views}</div>
              </div>
              <div className="panel-footer">
                <div>
                  <button className="btn btn-danger btn-sm" onClick={this.openModals.bind(this, 'delete', pp.id)}>Delete Post</button>
                </div>
              </div>
            </section>
          ))
        }
        <h4>Promotable/ Non-Published: </h4>
        {
          this.state.unpublishedPosts.map(pp => (
            <section className="panel panel-warning">
              <header className="panel-heading">
                <h5 className="panel-title">{ this.returnDateTimeString(pp.created_time) }</h5>
              </header>
              <div className="panel-body">
                <p>{pp.message}</p>
                <div><b>Views:</b> {pp.views}</div>
                {pp.scheduled_publish_time ? <div><b>Scheduled:</b> { this.returnDateTimeString(pp.scheduled_publish_time*1000) }</div> : null}
              </div>
              <div className="panel-footer">
                <button className="btn btn-warning btn-sm" onClick={this.publishPost.bind(this, pp.id)}>Publish Post</button>
              </div>
            </section>
          ))
        }

        <Modal show={this.state.removeModal} onHide={this.closeModals}>
          <Modal.Header closeButton>
            <Modal.Title>Remove Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <b>Please confirm. This action cannot be undone.</b>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.removePost}>Delete</Button>
            <Button onClick={this.closeModals}>Close</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }

}

export default (PostsHistory);
