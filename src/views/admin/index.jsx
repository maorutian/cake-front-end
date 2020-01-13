import React, {Component} from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils';
import Nav from '../../components/nav';
import Header from '../../components/header';
import Home from '../home';
import Category from '../category';
import Product from '../product';
import Role from '../role';
import User from '../user';
import Bar from '../statistic/bar';
import Line from '../statistic/line';
import Pie from '../statistic/pie';

const { Footer, Sider, Content } = Layout;

class Admin extends Component {
  render() {
    // get user, if no user redirect to login
    //const user = storageUtils.getUser();
    const user = memoryUtils.user;
    if (!user._id) {
      return <Redirect to="/login"/>
    }

    return (
        <Layout style={{height:'100%'}}>
          <Sider>
            <Nav />
          </Sider>
          <Layout>
            <Header/>
            <Content style={{background:'white', margin:'20px'}}>
              <Switch>
                <Route path="/home" component={Home}/>
                <Route path='/category' component={Category} />
                <Route path='/product' component={Product} />
                <Route path='/role' component={Role} />
                <Route path='/user' component={User} />
                <Route path='/statistic/bar' component={Bar} />
                <Route path='/statistic/line' component={Line} />
                <Route path='/statistic/pie' component={Pie} />
                <Redirect to="/home"/>
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.5)'}}>
              Footer
            </Footer>
          </Layout>
        </Layout>
    );
  }
}

export default Admin;