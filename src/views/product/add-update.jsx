import React, {Component} from 'react';
import {Card, Icon, Form, Input, Select, Button, message} from 'antd';

import LinkButton from "../../components/link-button";
import {reqCategory, reqAddUpdateProduct} from "../../api";
import memoryUtils from '../../utils/memoryUtils';
import UpdatePicture from'./update-picture'
import UpdateDraftEditor from "./update-draft-editor";
import PicturesWall from './p';

const Item = Form.Item;

class ProductAddUpdate extends Component {

  state = {
    categories: [],
  };

  constructor(props) {
    super(props);
    //reference update-pictures component
    this.picturesRef = React.createRef();
    //reference update-draft-editor component
    this.editorRef = React.createRef()
  }


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

  //submit
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {name, desc, price, categoryId} = values;
        console.log('send request', name, desc, price, categoryId);
        const imgs = this.picturesRef.current.getImgs();
        console.log(imgs);
        const detail = this.editorRef.current.getDetail();
        console.log(detail);
        const product = {name,desc,price,categoryId,imgs,detail}
        //add or update
        /*怎么知道添加或修改,根据id
         */
        if(this.isUpdate){product._id=this.product._id}
        //send request
        const result = await reqAddUpdateProduct(product);
        if (result.status===0) {
          message.success(`${this.isUpdate ? 'update' : 'add'} product successfully`);
          this.props.history.replace('/product');
        } else {
          message.error(result.msg);
        }

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
            <UpdatePicture ref={this.picturesRef} imgs={product.imgs}/>
          </Item>
          <Item label="Product Detail" wrapperCol={{span:20}}>
            <UpdateDraftEditor ref={this.editorRef} detail={product.detail} />
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