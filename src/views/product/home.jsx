import React, {Component} from 'react';
import {Card, Select, Input, Button, Icon, Table, message, Divider} from 'antd';

import LinkButton from "../../components/link-button";
import {reqProduct, reqSearchProducts, reqUpdateProductStatus} from "../../api";
import {PAGE_SIZE} from "../../utils/Constans";
import memoryUtils from '../../utils/memoryUtils';

const Option = Select.Option;

class ProductHome extends Component {

  state = {
    loading: false,
    products: [], //product list
    total: 0, //total product amount
    searchType: 'productName', //default search product name
    searchName: '',

  };

  //initial table columns
  initColumns = () => {
    this.columns = [
      {
        title: 'name',
        dataIndex: 'name'
      },
      {
        title: 'description',
        dataIndex: 'desc'
      },
      {
        title: 'price',
        width: 100,
        dataIndex: 'price',
        //if display is not dataindex itself, use render
        //if no dataIndex use render: (product) => '$' + product.price
        render: (price) => '$' + price
      },
      {
        title: 'status',
        width: 100,
        // dataIndex: 'status',
        render: ({_id, status}) => {
          let btnText = 'change';
          let text = 'Out of Stock';
          if (status === 2) {
            btnText = 'change';
            text = 'In Stock';
          }
          return (
            <span>
              <button onClick={() => {
                this.updateProductStatus(_id, status)
              }}>{btnText}</button><br/>
              <span>{text}</span>
            </span>
          )
        }
      },
      {
        title: 'Action',
        width: 200,
        render: (product) =>
          <span>
            <LinkButton onClick={() => {
              //pass product to detail page
              //store product in memory
              memoryUtils.product = product;
              this.props.history.push('/product/detail/')
            }
            }>View</LinkButton>
            <Divider type="vertical"/>
            <LinkButton onClick={() =>{
              //pass product to detail page
              //store product in memory
              memoryUtils.product = product;
              this.props.history.push('/product/addupdate/')
            }
            }>Update</LinkButton>
          </span>
      },
    ];
  };

  //send ajax to get product(search)
  getProducts = async (pageNum) => {
    this.pageNum = pageNum; //store current page number
    const {searchName, searchType} = this.state;
    let result;
    if (!searchName) {
      result = await reqProduct(pageNum, PAGE_SIZE)
    } else {
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    }

    if (result.status === 0) {
      const {total, list} = result.data;
      this.setState({products: list, total});
    } else {
      message.error('cannot get products')
    }
  };

  //send ajax to change product status
  updateProductStatus = async (id, status) => {
    //get new status
    status = status === 1 ? 2 : 1;
    //send ajax
    const result = await reqUpdateProductStatus(id, status);
    if (result.status === 0) {
      message.success('update status successfully');
      this.getProducts(this.pageNum);
    } else {
      message.error('cannot update status');
    }

  }

  componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    //get first page
    this.getProducts(1);
  }


  render() {
    const {loading, products, total, searchType, searchName} = this.state;

    const title = (
      <span>
        <Select
          style={{width: 200}}
          value={searchType}
          onChange={(value) => this.setState({searchType: value})}
        >
          <Option value="productName">search by name</Option>
          <Option value="productDesc">search by description</Option>
        </Select>
        <Input
          style={{width: 200, margin: '0 10px'}}
          placeholder="search"
          value={searchName}
          onChange={event => this.setState({searchName: event.target.value})}
        />
        <Button type="primary" onClick={() => {
          this.isSearch = true  // 保存搜索的标记
          this.getProducts(1)
        }}>SEARCH</Button>
      </span>
    );

    const extra = (
      <Button type="primary" onClick={() => {
        //clean product in the memory(from update)
        memoryUtils.product = {};
        this.props.history.push('/product/addupdate')
      }}>
        <Icon type="plus"/>
        Add Product
      </Button>
    );

    return (
      <div className="product">
        <Card title={title} extra={extra}>
          <Table
            bordered={true}
            rowKey="_id"
            loading={loading}
            columns={this.columns}
            dataSource={products}
            pagination={{
              total,  //Total number of data items
              defaultPageSize: PAGE_SIZE, //Default number of data items per page
              showQuickJumper: true,  //Determine whether you can jump to pages directly
              onChange: this.getProducts,  //Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments
              //onChange: (page) => this.this.getProducts(page), this.getProducts: give onChange function this.getProducts():give onChange the result of the function
              current: this.pageNum  //Current page number
            }}
          />
        </Card>
      </div>
    );
  }
}

export default ProductHome;