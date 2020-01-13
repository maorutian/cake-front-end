import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import navList from '../../config/navConfig'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'
import {reqWeather} from '../../api'
import './index.less';

class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()), //date
    weather: '', // weather
  }


  //get title by pathname
  getTitle = () => {
    let title = '';
    const path = this.props.location.pathname;
    navList.forEach(item => {
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0);
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title
  };

  //logout
  logout = () => {
    Modal.confirm({
      title: 'Are you sure you want to logout?',
      onOk: () => { //use THIS in the function ()=>
        console.log('OK');
        //delete local
        storageUtils.removeUser();
        //delete memory
        memoryUtils.user = {};
        //redirect to another page
        // if in the render():<Redirect to="/home"/> else: import withRouter, this.props.history.replace('/login'
        this.props.history.replace('/login')//this:()=>
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  };

  //get weather
  getWeather = async () => {
    const result = await reqWeather('Toronto');
    //update state
    this.setState({weather: result.weather[0].description})
  }


  componentDidMount() {
    // set time interval
    this.intervalId = setInterval(() => {
      // update currentTime each second
      this.setState({
        currentTime: formateDate(Date.now())
      })
    }, 1000);
    //send ajax for weather
    this.getWeather();
  }


  componentWillUnmount() {
    // clear time interval
    clearInterval(this.intervalId)
  }


  render() {
    const {currentTime, weather} = this.state;
    const title = this.getTitle();
    const user = memoryUtils.user;

    return (
      <div className="header">
        <div>
          <div className="header-top">
            welcome,{user.username}&nbsp;&nbsp;
            <a onClick={this.logout}>Logout</a>
          </div>
          <div className="header-bottom">
            <div className="header-bottom-left">{title}</div>
            <div className="header-bottom-right">
              <span>{currentTime}</span>&nbsp;&nbsp;
              <span>Toronto: {weather}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);