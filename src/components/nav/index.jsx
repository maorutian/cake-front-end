import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Menu, Icon} from 'antd';

import './index.less';
import logo from '../../assets/images/logo.png';
import navList from '../../config/navConfig';

const {SubMenu} = Menu;

class Nav extends Component {
  //get navList and return <Menu.Item> or <SubMenu>
  getNavItems = (navList) => {
    const openItem = this.props.location.pathname;

    return navList.reduce((pre, item) => {
      if (!item.children) { //<Menu.Item>
        pre.push(
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>)
      } else {
        pre.push(//<SubMenu>
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getNavItems(item.children)}
          </SubMenu>)

        //use path to check open nav
        //if path = item.children.key set openkey = item.key
        //const childrenItem = item.children.find(childrenItem => childrenItem.key === openItem); fix bug child page using begins(indexof)
        const childrenItem = item.children.find(childrenItem => openItem.indexOf(childrenItem) === 0);
        if (childrenItem) {
          this.openKey = item.key//save open key to this
        }


      }
      return pre;
    }, [])
  };

  constructor(props) {
    super(props);
    this.navItems = this.getNavItems(navList)
  }


  render() {

    //nav item selected state
    let selectedKey = this.props.location.pathname; //product/xxx
    //fix bug nav item is colored in product child page
    //if the path begins at /product, change selectedKey to product instead of pathname
    if (selectedKey.indexOf('/product') === 0) {
      selectedKey = '/product';
    }

    return (
      <div className="nav">
        <Link className="nav-link" to="/home">
          <img src={logo} alt="logo"/>
          <h1>Admin</h1>
        </Link>

        <Menu
          selectedKeys={[selectedKey]}
          defaultOpenKeys={[this.openKey]}
          mode="inline"
          theme="dark"
        >
          {this.navItems}
        </Menu>

      </div>
    );
  }
}

//withRouter: pass updated match, location, and history props
export default withRouter(Nav);