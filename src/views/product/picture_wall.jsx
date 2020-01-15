import React, {Component} from 'react';
import {Upload, Icon, Modal} from 'antd';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PictureWall extends Component {
  state = {
    previewVisible: false, //标识是否显示大图预览
    previewImage: '', //大图的url或者base64
    fileList: [ // 文件信息对象 file
      {
        uid: '-1', // 唯一标识
        name: 'image.png', // 文件名
        status: 'done', // 状态有：uploading done error removed
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片的url
      },
      {
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-3',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-4',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-5',
        name: 'image.png',
        status: 'error',
      },
    ],
  };

  /*
进行大图预览的回调函数
file: 当前选择的图片对应的file
*/
  handleCancel = () => this.setState({previewVisible: false});

  //判断file里有没有url和base64(之前存过),如果没有,搞一个base64编码
  handlePreview = async file => {
    if (!file.url && !file.preview) {//如果file没有url,只进行一次base64处理
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview, //如果大图有url,用url显示,如果没有,用base64
      previewVisible: true,
    });
  };

  /*
在file的状态发生改变的监听回调
file: 当前操作(上传/删除)的file
*/
  handleChange = ({fileList}) => this.setState({fileList});

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
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76" //图片上传的地址
          name="image" // 图片文件对应参数名
          listType="picture-card"  // 显示风格
          fileList={fileList}  // 已上传的所有图片文件信息对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        {/*图片详情对话框 Modal*/}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    );
  }
}

