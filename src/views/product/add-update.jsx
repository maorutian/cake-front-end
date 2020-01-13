import React, {Component} from 'react';
import {Card, Icon, Form, Input, Select, Button} from 'antd';

import LinkButton from "../../components/link-button";
import {reqCategory} from "../../api";
import memoryUtils from '../../utils/memoryUtils';

const Item = Form.Item;

class ProductAddUpdate extends Component {

  state = {
    categories: [],
  };

  //get all categories
  getCategory = async () => {
    const result = await reqCategory();
    if (result.status === 0) {
      const categories = result.data;
      this.setState({categories})
    }
  };

  //validate price
  validatePrice = (rule, value, callback) => {
    // if (value==='') {
    //   callback()
    // } else
    if (value * 1 <= 0) { //cast: string to number
      callback('Price can not less than 0')
    } else {
      callback()
    }
  }

  handleSubmit = (event) => {

    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {name, desc, price, categoryId} = values;
        console.log('send request', name, desc, price, categoryId);
      }
    });

  }


  componentWillMount () {
    this.product = memoryUtils.product;
    //console.log(this.product);
    //add or update
    this.isUpdate = !!this.product._id;
  }

  componentDidMount() {
    this.getCategory();
  }


  render() {
    const {categories} = this.state;
    const {getFieldDecorator} = this.props.form;
    //add or update
    const {product, isUpdate} = this;


    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left"/>
        </LinkButton>
        <span>{isUpdate ? 'Update Product':'Add Product'}</span>
      </span>
    );

    //Form layout
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 8}
    }


    return (
      <Card title={title}>
        <Form {...formLayout} onSubmit={this.handleSubmit}>
          <Item label="Product Name">
            {getFieldDecorator('name', {
              initialValue: product.name,
              rules: [
                {
                  required: true,
                  message: 'Please input product name',
                },
              ],
            })(<Input placeholder="Please input product name"/>)}
          </Item>
          <Item label="Product Description">
            {getFieldDecorator('desc', {
              initialValue: product.desc,
              rules: [
                {
                  required: true,
                  message: 'Please input product description',
                },
              ],
            })(<Input placeholder="Please input product description"/>)}
          </Item>
          <Item label="Product Price">
            {getFieldDecorator('price', {
              initialValue: product.price,
              rules: [
                {
                  required: true,
                  message: 'Please input product price',
                },
                {validator: this.validatePrice}
              ],
            })(<Input type="number" addonBefore="$" placeholder="Please input product price"/>)}
          </Item>
          <Item label="Category">
            {getFieldDecorator('categoryId', {
              initialValue: product.categoryId || '',
              rules: [
                {
                  required: true,
                  message: 'Please select category',
                },
              ],
            })(
              <Select>
                <Select.Option value=''>plese select category</Select.Option>
                {
                  categories.map(c => <Select.Option value={c._id} key={c._id}>{c.name}</Select.Option>)
                }
              </Select>)}
          </Item>
          <Item label="Product Picture">
            <div>picture</div>
          </Item>
          <Item label="Product Detail">
            <div>detail</div>
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">submit</Button>
          </Item>

        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate);