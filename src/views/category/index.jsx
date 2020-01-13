import React, {Component} from 'react';
import {Card, Button, Icon, Table, Divider, message, Modal} from 'antd';

import LinkButton from '../../components/link-button'
import AddUpdateForm from './add-update-form';
import {reqCategory, reqAddCategory, reqUpdateCategory} from '../../api';


class Category extends Component {

  state = {
    categories: [], // category array
    loading: false, // loading before get data
    showStatus: 0, // Modal status 0: hide, 1: add category, 2: update category
  };

  //initialize table columns
  initColumns = () => {
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name', // table column name
        key: 'name',
      },
      {
        title: 'Action',
        key: 'action',
        width: 500,
        render: (category) =>
          <span>
            <LinkButton onClick={()=> {
              this.category = category; //store category in this, when we update we can get it
              this.setState({showStatus:2})}
            }>Update</LinkButton>
            <Divider type="vertical"/>
            <LinkButton>View</LinkButton>
          </span>
      },
    ];
  };

  //send ajax to get categories
  getCategories = async () => {
    //display loading
    this.setState({loading: true});
    //send ajax
    const result = await reqCategory();
    // hide loading
    this.setState({loading: false});
    if (result.status === 0) { // success
      const categories = result.data;
      // renew state of categories
      this.setState({
        categories
      })
    } else {
      message.error('cannot get categories')
    }
  };

  //Category Modal click ok
  handleOk = () => {
    //validation
    this.form.validateFields(async (err, values) => {
      if (!err) {

        // success
        //get categoryName
        const {categoryName} = values;
        //get state add or update
        const {showStatus} = this.state;
        let result;
        if (showStatus === 1) { // add
          // send add ajax
          result = await reqAddCategory(categoryName)
        } else { // update
          const categoryId = this.category._id;
          //send update ajax
          result = await reqUpdateCategory({categoryId, categoryName})
        }

        this.form.resetFields(); // Reset the specified fields' value(to initialValue) and status.

        //hide category Modal
        this.setState({showStatus: 0})

        const action = showStatus === 1 ? 'add' : 'update'

        //result 0 or 1
        if (result.status === 0) { //success
          // update category list
          this.getCategories();
          message.success(action + 'successful')
        } else {//fail
          message.error(action + 'failed')
        }
      }
    });
  };

  //Category Modal click cancel
  handleCancel = () => {
    this.form.resetFields(); // Reset the specified fields' value(to initialValue) and status.
    this.setState({
      showStatus: 0
    })
  };

  componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getCategories();
  }

  render() {
    //get state data
    const {categories, loading, showStatus} = this.state;

    //get category name, before click updated there is no category,so set it to {}
    const category = this.category || {}

    //table
    const title = 'first category';
    const extra = ( //onClick={this.setState({showStatus:1})} call the function immediately
      //callback onClick={() => {this.setState({showStatus:1})}}
      <Button type='primary' onClick={() => {
        this.category={}; //fix bug - click update then click add (clean category in this)
        this.setState({showStatus: 1})
      }}>
        <Icon type='plus'/>Add
      </Button>
    );


    return (
      <div className="category">
        <div>
          <Card title={title} extra={extra}>
            <Table
              bordered={true}
              rowKey="_id"
              loading={loading}
              dataSource={categories}
              columns={this.columns}
              pagination={{defaultPageSize: 6, showQuickJumper: true}}
            />
            <Modal
              title={showStatus === 1 ? "ADD CATEGORY" : "UPDATE CATEGORY"}
              visible={showStatus !== 0}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              {/*get form object from AddUpdateForm setForm function and store it in this */}
              <AddUpdateForm setForm={form => this.form = form} categoryName={category.name}/>
            </Modal>
          </Card>

        </div>
      </div>
    );
  }
}

export default Category;