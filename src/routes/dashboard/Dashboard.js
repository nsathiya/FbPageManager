import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Dashboard.css';
import Auth from '../../components/Utils/Auth.js'

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
            {
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
            }
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Dashboard);
