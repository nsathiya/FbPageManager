import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Auth from '../../components/Utils/Auth.js';
import {Button, DropdownButton, MenuItem, Modal} from 'react-bootstrap';

class PostToPage extends React.Component {

  static propTypes = {
    pageId: PropTypes.string,
    pageToken: PropTypes.string
  }.isRequired

  constructor(props) {
    super(props);

    this.state = {
      message: '',
      postType: '1',
      minutesDelayed: 0,
      scheduleModal: false,
      confirmModal: false,
      targetModal: false,
    };

    this.postToPage = this.postToPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeModals = this.closeModals.bind(this);
    this.openModals = this.openModals.bind(this);
  }

  componentDidMount() {

  }

  closeModals(e) {
    this.setState({
      scheduleModal: false,
      confirmModal: false,
      targetModal: false
    })
  }

  openModals(e, type) {
    if (e.preventDefault)
      e.preventDefault();

      console.log(type);

    if (type == 'confirm')
      this.setState({
        confirmModal: true
      })
    if (type == 'schedule')
      this.setState({
        scheduleModal: true
      })
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });

    if (name == 'postType' && value == 2)
      this.setState({
        scheduleModal: true
      })
  }

  postToPage(e) {
    e.preventDefault();
    let postReq = {};
    postReq.published = false;
    postReq.message = `${this.state.message}`;
    postReq.access_token = `${this.props.pageToken}`;
    if (this.state.postType == '2') { postReq.scheduled_publish_time = Math.round(new Date().getTime() / 1000) + (this.state.minutesDelayed * 60)}
    if (this.state.postType == '3') { postReq.published = true; }

    console.log(postReq);

    FB.api(
      `/${this.props.pageId}/feed/`,
      'POST',
      postReq,
      (response) => {
        console.log(response.id);
        if (response.id) {
          this.setState({
            message: '',
          });
          this.closeModals();
        }
      },
    );
  }

  render() {
    let postType = "";
    if (this.state.postType == '1')
      postType = 'unpublished';
    if (this.state.postType == '2')
      postType = 'scheduled';
    if (this.state.postType == '3')
      postType = 'published';


    return (
      <form onSubmit={e => this.openModals(e, 'confirm')} className="facebook-share-box">

        <div>

          <div className="share">
            <div className="arrow" />
            <div className="panel panel-default">
              <div className="panel-heading"><i className="fa fa-file" /> Update Status</div>
              <div className="panel-body">
                <div className="">
                  <textarea name="message" value={this.state.message} cols="40" rows="10" id="status_message" className="form-control message" style={{ height: '62px', overflow: 'hidden' }} placeholder="What's on your mind ?" onChange={this.handleChange} />
                </div>
              </div>
              <div className="panel-footer">

                <div className="row">
                  <div className="col-md-7">
                    <div className="form-group">
                    </div>
                  </div>
                  <div className="col-md-3 pull-right">
                    <div className="form-group">
                      <select name="postType" className="form-control privacy-dropdown pull-left input-sm" onChange={this.handleChange}>
                        <option value="1" selected="selected">Unpublished</option>
                        <option value="2">Scheduled</option>
                        <option value="3">Published</option>
                      </select>
                      <input type="submit" name="submit" value="Post" className="btn btn-primary pull-right" />
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>

          <div>
            <Modal show={this.state.scheduleModal} onHide={this.closeModals}>
              <Modal.Header closeButton>
                <Modal.Title>Schedule Post</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h4>Choose number of mins publishing of page should be delayed by</h4>
                <form>
                  <select name="minutesDelayed" className="form-control privacy-dropdown pull-left input-sm" onChange={this.handleChange}>
                    <option value="10" selected="selected">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                  </select>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeModals}>Submit</Button>
                <Button onClick={this.closeModals}>Close</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={this.state.confirmModal} onHide={this.closeModals}>
              <Modal.Header closeButton>
                <Modal.Title>Schedule Post</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h4>Please confirm to create {postType} post</h4>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.postToPage.bind(this)}>Submit</Button>
                <Button onClick={this.closeModals}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>

      </form>
    );
  }

}

export default PostToPage;
