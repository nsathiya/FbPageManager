import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Dashboard.css';
import Auth from '../../components/Utils/Auth.js'
//import PostPage from '../PostPage.js';

class PostsHistory extends React.Component{
  constructor(props){
    super(props);
    this.state = { 
      publishedPosts : [],
      unpublishedPosts : [],
      scheduledPosts : []
    }
    
    this.fetchPublishedPosts = this.fetchPublishedPosts.bind(this);
    this.fetchUnpublishedPosts = this.fetchUnpublishedPosts.bind(this);
    this.publishPost = this.publishPost.bind(this);
    this.getPostViews = this.getPostViews.bind(this);
     
  }

  componentDidMount(){
  
  }

  fetchUnpublishedPosts(){

    const userAccessToken = Auth.getCookieInfo("userAccessToken");

    console.log('fetching unpublishedPosts');

    if (FB){
      FB.api('/me/accounts', {
        "access_token": userAccessToken
      }, function(response) {
      
      
        var pageAccessToken = response.data[0].access_token;
        
        console.log('accounts');
        FB.api(
          '/1858035424460206/promotable_posts',
          'GET',
          {
            "access_token": pageAccessToken,
            "is_published": false,
          },
          function(response) {
            console.log(response)
              this.setState({
                unpublishedPosts: response.data
              })

          }.bind(this)
        );
      }.bind(this));

    }

  }

  fetchPublishedPosts(){



    const userAccessToken = Auth.getCookieInfo("userAccessToken");

    console.log('fetching publishedPosts');

    if (FB){
      FB.api('/me/accounts', {
        "access_token": userAccessToken
      }, function(response) {
      
      
        var pageAccessToken = response.data[0].access_token;

        FB.api(
          '/1858035424460206/posts/',
          'GET',
          {
            "access_token": pageAccessToken,
          },
          function(response) {
            console.log(response)

            response.data.forEach((d, i) => {

              FB.api(
                '/' + d.id + '/insights/post_impressions_unique',
                'GET',
                {
                  "access_token": pageAccessToken,
                },
                function(res) {
                  console.log(res)
                  console.log(i);
                    response.data[i].views = res.data[0].values[0].value

                    this.setState({
                      publishedPosts: response.data
                    })
                }.bind(this)
              );

            })

            console.log('responsesWithViews', responseWithViews);
            this.setState({
              publishedPosts: response.data
            })
            
          }.bind(this)
        );
      }.bind(this));

    }
    

  }

  publishPost(id){

    console.log('id', id);

    const userAccessToken = Auth.getCookieInfo("userAccessToken");

    if (FB){
      FB.api('/me/accounts', {
        "access_token": userAccessToken
      }, function(response) {
      
      
        var pageAccessToken = response.data[0].access_token;

        FB.api(
          '/' + id + '/',
          'POST',
          {
            "access_token": pageAccessToken,
            "is_published": true
          },
          function(response) {
            console.log(response)
              this.fetchPublishedPosts();
              this.fetchUnpublishedPosts();
          }.bind(this)
        );
      }.bind(this));

    }

  }

  getPostViews(id){

    console.log('id', id);

    const userAccessToken = Auth.getCookieInfo("userAccessToken");

    if (FB){
      FB.api('/me/accounts', {
        "access_token": userAccessToken
      }, function(response) {
      
      
        var pageAccessToken = response.data[0].access_token;

        FB.api(
          '/' + id + '/insights/post_engaged_fan',//impressions_unique',
          'GET',
          {
            "access_token": pageAccessToken,
          },
          function(response) {
            console.log(response)
              //this.fetchPublishedPosts();
              //this.fetchUnpublishedPosts();
          }.bind(this)
        );
      }.bind(this));

    }

  }

  render(){

    

    return(

      <div>
        <h2>Published: </h2>
        {
          this.state.publishedPosts.map((pp) => (
            
            <section className="panel panel-info">
              <header className="panel-heading">
                <h5 className="panel-title">{(new Date(pp.created_time)).toDateString()}</h5>
              </header>
              <div className="panel-body">
                <p>{pp.message}</p>
                <div>{pp.views}</div>
              </div>
              <div className="panel-footer">
                <button onClick={this.getPostViews.bind(this, pp.id)}>Get Views</button>
              </div>
            </section>
          ))
        }
        <h2>Unpublished: </h2>
        {
          this.state.unpublishedPosts.map((pp) => (
            <section className="panel panel-warning">
              <header className="panel-heading">
                <h5 className="panel-title">{(new Date(pp.created_time)).toDateString()}</h5>
              </header>
              <div className="panel-body">
                <p>{pp.message}</p>
              </div>
              <div className="panel-footer">
                <button onClick={this.publishPost.bind(this, pp.id)}>Publish Post</button>
              </div>
            </section>
          ))
        }
        <button onClick={this.fetchPublishedPosts}>Published Posts</button>
        <button onClick={this.fetchUnpublishedPosts}>Unpublished Posts</button>
      </div>
      )
  }

}

class PostToPage extends React.Component{

  constructor(props){
    super(props)

    this.state = {
      message: "",
      postType: "1"
    }

    this.postToPage = this.postToPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    

  }
  
  handleChange(e) {
    
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    })

  }

  postToPage(e){
    
    e.preventDefault();

    const userAccessToken = Auth.getCookieInfo("userAccessToken");


    FB.api('/me/accounts', {
      "access_token": userAccessToken
    }, function(response) {
    
    
      var pageAccessToken = response.data[0].access_token;
      var published = false;
      if (this.state.postType == "2")
        published = true;

      console.log(published);

      FB.api(
        '/1858035424460206/feed/',
        'POST',
        {
          "message":this.state.message,
          "access_token": pageAccessToken,
          "published": published
        },
        function(response) {
          console.log(response)

          if (response.id)
            this.setState({
              message: ""
            })
        }.bind(this)
      );
    }.bind(this));

  }

  render(){

    

    return(
              <form onSubmit={this.postToPage} method="post" role="form" className="facebook-share-box">
              
              <div>
                
                <div className="share">
                  <div className="arrow"></div>
                  <div className="panel panel-default">
                    <div className="panel-heading"><i className="fa fa-file"></i> Update Status</div>
                      <div className="panel-body">
                        <div className="">
                          <textarea name="message" value={this.state.message} cols="40" rows="10" id="status_message" className="form-control message" style={{height: '62px', overflow: 'hidden'}} placeholder="What's on your mind ?" onChange={this.handleChange}/>
                        </div>
                      </div>
                      <div className="panel-footer">
                        
                          <div className="row">
                            <div className="col-md-7">
                              <div className="form-group">
                                <div className="btn-group">
                                  <button type="button" className="btn btn-default"><i className="icon icon-map-marker"></i> Location</button>
                                  <button type="button" className="btn btn-default"><i className="icon icon-picture"></i> Photo</button>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-5">
                              <div className="form-group">
                                <select name="postType" className="form-control privacy-dropdown pull-left input-sm" onChange={this.handleChange}>
                                  <option value="1" selected="selected">Unpublished</option>
                                  <option value="2">Published</option>
                                  <option value="3">Scheduled</option>
                                </select>                                    
                                <input type="submit" name="submit" value="Post" className="btn btn-primary"/>                               
                              </div>
                            </div>
                          </div>
                        
                      </div>
                    </div>
                </div>
                
              </div>
              
              </form>
    )

  }

}

//export default withStyles(s)(PostToPage);

class Dashboard extends React.Component {
  // static propTypes = {
  //   data: PropTypes.arrayOf(PropTypes.shape({
  //     email: PropTypes.string.isRequired,
  //     firstName: PropTypes.string.isRequired,
  //     lastName: PropTypes.string.isRequired
  //   })).isRequired,
  // };

  constructor(props){
    super(props)
    this.state = {
      data : []
    }
    this.getUserData = this.getUserData.bind(this);
  }

  componentDidMount() {

    this.getUserData();
  }

  async getUserData() {
    const token = Auth.getToken();
    
    fetch('/allUsers', 
      {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        }
      })
      .then((res) => {
        console.log('res', res)
        if (!res.ok)
          throw new Error(res.status);
        return res.json()
      })
      .then((data) => {
        console.log('data', data)
        this.setState({
          data: data.data
        })
      })
      .catch((err) => {
        console.log('err', err)
        if (err == 401)
          console.log('Unauthorized')
      })

  }

  render() {
    const data = this.state.data

    return (
      <div className={s.root}>
        <div className={s.container}>
        <div className="row">
          <div className={s.dashboard}>

          <div className="row">
            <div className="col-xs-6 col-xs-offset-3">
              <ul className="pagination">
                <li><a href="#">Make New Post</a></li>
                <li><a href="#">Posts History</a></li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-8 col-xs-offset-2">
              <PostToPage />
              <PostsHistory/>
            </div>
          </div>
            {/*
              data.map((contact) => (
                <div className="col-xs-4" key={contact._id}>
                  <div className="card">
                    <div className="row">
                      <div className="col-xs-10">
                        <img className="card-img-top" src={`https://api.adorable.io/avatars/100/${contact.email}.png`} alt="Card image cap"/>
                        <div className="card-block">
                          <h4 className="card-title">{contact.firstName} {contact.lastName}</h4>
                        </div>
                      </div>
                    </div>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">{contact.email}</li>
                    </ul>
                    <div className="card-block col-xs-12">
                      <div className="col-xs-6">
                        <a href="#" className="card-link">Learn More</a>
                      </div>
                      <div className="col-xs-6">
                        <a href="#" className="card-link">Schedule Call</a>
                      </div>
                    </div>
                  
                  </div>
                </div>
              ))
            */}
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Dashboard);
