import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Upload, Icon, Modal, message} from 'antd';
import {BASE_IMG} from '../../utils/Constans';

import {reqDeleteImg} from "../../api";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class UpdatePicture extends Component {

  //get imgs from parent component
  static propTypes = {
    imgs: PropTypes.array
  };

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [
      // {
      //   uid: '-1', //unique identifier, negative is recommend, to prevent
      //   name: 'image.png', //file name
      //   status: 'done', //options：uploading, done, error, removed
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // }
    ],
  };


  componentWillMount() {
    // get imgs from parent component
    const imgs = this.props.imgs;
    //dispaly previous imgs (update)
    if (imgs && imgs.length > 0) {
      const fileList = imgs.map((img, index) => ({
          uid: -index, //unique identifier
          name: img, //file name
          status: 'done',//options：uploading, done, error, removed
          url: BASE_IMG + img
        })
      );
      this.setState({fileList})
    }
  }

  //get the names array of images(api), pass it to parent comment
  getImgs = () => this.state.fileList.map(file => file.name);

  //close preview picture Modal
  handleCancel = () => this.setState({previewVisible: false});

  //set previewImage and open picture Modal
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  //when status is changed (update or delete)
  handleChange = async ({file, fileList}) => {
    // update (status: uploading to done)
    if (file.status === 'done') {
      file = fileList[fileList.length - 1];
      // get response data: file.response.data, including name and url
      const {name, url} = file.response.data;
      // add url attribute to file and change the previous file name to the name we stored in server
      file.name = name;
      file.url = url;
    }
    //delete (status: done to removed)
    else if (file.status === 'removed') {
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success('delete image succeed')
      } else {
        message.error('delete image failed')
      }
    }
    //update fileList
    this.setState({fileList})
  };


  render() {
    const {previewVisible, previewImage, fileList} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          name="image" //The name of uploading file Default:'file'
          listType="picture-card"  //Built-in stylesheets, support for three types: text, picture or picture-card
          fileList={fileList}  //List of files that have been uploaded (controlled)
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {/*fileList.length: the amount of pictures display button or not */}
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    );
  }
}

