import React, {Component} from 'react';
import {Card, Icon, List} from 'antd';

import LinkButton from "../../components/link-button";
import memoryUtils from '../../utils/memoryUtils';
import {reqCategoryById} from "../../api";

const Item = List.Item;

export default class ProductDetail extends Component {

  state = {
    categoryName: '',
    product: memoryUtils.product //get product from memory
  };

  getCategory = async (categoryId) => {
    const result = await reqCategoryById(categoryId);
    if (result.status===0) {
      const categoryName = result.data.name;
      this.setState({ categoryName })
    }
  };

  componentDidMount(){
    const product = memoryUtils.product;
    if(product._id){this.getCategory(product.categoryId)}


  }

  // async componentDidMount () {
  //   let product = this.state.product
  //   if (product._id) { // 如果商品有数据, 获取对应的分类
  //     this.getCategory(product.categoryId)
  //   } else { // 如果当前product状态没有数据, 根据id参数中请求获取商品并更新
  //     const id = this.props.match.params.id
  //     const result = await reqProduct(id)
  //     if (result.status === 0) {
  //       product = result.data
  //       this.setState({
  //         product
  //       })
  //       this.getCategory(product.categoryId) // 获取对应的分类
  //     }
  //   }
  // }

  render() {
    const {product, categoryName} = this.state;

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left"/>
        </LinkButton>
        <span>Product Detail</span>
      </span>
    );

    return (
      <Card title={title} className="detail">
        <List>
          <Item>
            <span className="detail-left">Product Name:</span>
            <span>{product.name}</span>
          </Item>
          <Item>
            <span className="detail-left">Product Description:</span>
            <span>{product.desc}</span>
          </Item>
          <Item>
            <span className="detail-left">Product Price:</span>
            <span>{product.price}</span>
          </Item>
          <Item>
            <span className="detail-left">Product Category:</span>
            <span>{categoryName}</span>
          </Item>
          <Item>
            <span className="detail-left">Product Picture:</span>
            <span>

              {/*{*/}
              {/*  product.imgs && product.imgs.map(img => <img className="detail-img" key={img} src={BASE_IMG + img}*/}
              {/*                                               alt="img"/>)*/}
              {/*}*/}

            </span>
          </Item>
          <Item>
            <span className="detail-left">Prodoct Description:</span>
            <div dangerouslySetInnerHTML={{__html: product.detail}}></div> {/*parse to html like innerhtml*/}
          </Item>
        </List>
      </Card>
    )
  }
}