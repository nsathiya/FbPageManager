import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Dashboard.css';
import Auth from '../../components/Utils/Auth.js';
import {Button, DropdownButton, MenuItem, Modal} from 'react-bootstrap';
import PostsHistory from './PostHistory.js';
import PostToPage from './PostToPage.js';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pages: [],
      currentPageId: "",
      currentPageToken: "",
      currentPageName: "Choose Page",
      currentAction: "MakePost"
    };
    this.changePage = this.changePage.bind(this);
    this.changeActionPage = this.changeActionPage.bind(this);
  }

  componentDidMount() {

    const userAccessToken = Auth.getCookieInfo('userAccessToken');

    FB.api('/me/accounts', {
      access_token: userAccessToken,
    }, (response) => {
      var pages = response.data.map((d)=>{
          return {
            'cAccessToken': d.access_token,
            'cId': d.id,
            'cName': d.name
          }
      });

      this.setState({
        pages: pages
      })
    });

  }

  changePage(e){
    this.setState({
      currentPageId:    e[0],
      currentPageToken: e[1],
      currentPageName:  e[2]
    });
  }

  changeActionPage(e){
    this.setState({
      currentAction: e
    });
  }

  renderActionPage(){

    const action = this.state.currentAction;
    if (action == "MakePost")
      return (<PostToPage pageId={this.state.currentPageId} pageToken={this.state.currentPageToken}/>);
    else if (action == "PostHistory")
      return (<PostsHistory pageId={this.state.currentPageId} pageToken={this.state.currentPageToken}/>);

  }

  render() {
    const data = this.state.data;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className="row">
            <div className={s.dashboard}>

            <div className="row">
              <div className="col-xs-8 col-xs-offset-2">
                <div className="dropdown">
                  <DropdownButton title={this.state.currentPageName} onSelect={this.changePage.bind(this)}>
                  {this.state.pages.map((page) => (
                    <MenuItem eventKey={[page.cId, page.cAccessToken, page.cName]}>{page.cName}</MenuItem>
                    ))
                  }
                  </DropdownButton>
                </div>
              </div>
            </div>
              <div className="row">
                <div className="col-xs-6 col-xs-offset-3" style={{'text-align':'center'}}>
                  <ul className="pagination">
                    <li><a href="#" onClick={this.changeActionPage.bind(this, 'MakePost')}>Make New Post</a></li>
                    <li><a href="#" onClick={this.changeActionPage.bind(this, 'PostHistory')}>Posts History</a></li>
                  </ul>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-8 col-xs-offset-2">
                  {this.renderActionPage()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Dashboard);
