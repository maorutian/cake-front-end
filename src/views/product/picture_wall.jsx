import React, {Component} from 'react';
import {Upload, Icon, Modal, message} from 'antd';
import reqDeleteImg from 'api';
import {BASE_IMG} from 'c';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
/*
点上传:
上传图片的请求是由框架自己写的,我只需要自己在render里指定这个请求的url,即action="/manage/img/upload"就可以了
上传图片是一个post请求,参数名是img(服务器指定的),即把render里的name:img,值是图片本身,body type用的是form-data,即带文件的表单
当你点了upload,会触发handleChange(本质上是file.status改变就会触发),此时传入的参数为file(当前操作的图片),filelist(所有图片)
框架就给你发了一个post请求叫upload了
此时,file文件的status--file.status为upload,但迅速会变为done或者error
变为done就是上传成功了,服务器已经有图片了,会返回响应数据file.response.data(包括name,url),此时要做
1.此时的file还没有url属性,需要我们把url加到file里,以便显示
2.此时file的name为本来默认的name,我们需要将其改为服务器里那张图片的name,然后更新状态
注意,这里有个bug


点删除:
点删除后,file.status自动改为removed,触发handleChange,把file.name传入我们的api
发post请求,得到result,判断是否成功

点眼睛:
当你点了眼睛(view),会触发handlePreview, 你点的哪张图的眼睛,他就会把哪张图作为file对象传给handlePreview,handlePreview会干两件事:
1.previewVisible: true. previewVisible的默认值为false,它在render的modal里用到了,即打开一个窗口去预览大图,正常是false,
但点了眼睛变为true,即大图预览.打开大图预览后,右上角有个x,绑定的handleCancel,previewVisible: false,即关闭大图
2:previewImage: file.url || file.preview,
先判断file里没有有url, 再判断file里有没有preview, 如果都没有就把preview设置成图片的base64的编码的值
判断file里有没有preview就是为了防止图片被多次base64
再把previewImage(state里默认为空)设置为 file.url 或者 file.preview,
大多数情况都是url,因为我们的服务端返回了url的

点提交:
点提交后,我把这个product的信息交给了服务端,此信息中包含一个array,array里有所提交的图片的存在服务端里的名字,[图片名1,图片名2,图片名3]
这个array怎么得到呢?我们定义一个方法getImgs()去map fileList从而得到
但是怎么把这个array传给父组件呢?所有其实是父组件调用子组件的getImgs()方法得到这个array
父组件怎么得到子组件呢? 用标签<PictureWall> 以下的代码是在父组件中哟
1. 加上constructor(props) {
    super(props);
    // 创建picturesRef容器, 并保存到上传图片此组件的组件对象
    this.picturesRef = React.createRef();
  }

2.将容器(picturesRef)交给标签对象UpdatePicture,在解析是就会自动将标签对象UpdatePicture放到容器picturesRef里
此时,存的属性名current,属性值UpdatePicture
 <UpdatePicture ref={this.picturesRef}/>

3.得到UpdatePicture,在submit的方法里加上
const imgs = this.pwRef.current
得到array就是调用UpdatePicture里的getImgs()即
const imgs = this.pwRef.current.getImgs();
*/

/*
如何判断是添加新产品图片/还是修改图片? 判断有没有图片被传过来
如何判断?
1.在父组件加上 <PicturesWall ref={this.pwRef} imgs={product.imgs}/> 把imgs(修改,就有个array;添加,就undefined)传给子组件
2.子组件判断
static propTypes = {
    imgs: PropTypes.array
  }u
如果有imgs,fileList就要显示imgs;如果没有,fileList就为空
componentWillMount () {//也可以写在constrctor
    // 根据传入的imgs生成fileList并更新
    const imgs = this.props.imgs
    if (imgs && imgs.length>0) {
      const fileList = imgs.map((img, index) => ({
        uid: -index, // 唯一标识
        name: img, // 文件名
        status: 'done', // 状态有：uploading done error removed
        url: BASE_IMG + img
      }))
      this.setState({ fileList })
    }
  }


 */
export default class PictureWall extends Component {
  state = {
    previewVisible: false, // 标识是否显示大图预览
    previewImage: '', // 大图的url或者base64值
    fileList: [
      /* { // 文件信息对象 file
        uid: '-1', // 唯一标识
        name: 'xxx.png', // 文件名
        status: 'done', // 状态有：uploading done error removed
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片的url
      }, */
    ],
  }

  componentWillMount () {
    // 根据传入的imgs生成fileList并更新
    const imgs = this.props.imgs
    if (imgs && imgs.length>0) {
      const fileList = imgs.map((img, index) => ({
        uid: -index, // 唯一标识
        name: img, // 文件名
        status: 'done', // 状态有：uploading done error removed
        url: BASE_IMG + img
      }))
      this.setState({ fileList })
    }
  }
  /*
  获取所有已上传图片文件名的数组
  */
  getImgs = () => this.state.fileList.map(file => file.name)

  handleCancel = () => this.setState({previewVisible: false});
  /*
 进行大图预览的回调函数
 file: 当前选择的图片对应的file
 */
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
如果上传成功 stauts为done
响应数据在file.response.data,包括name,url
*/
  //handleChange = ({fileList}) => this.setState({fileList});
  handleChange = async ({ file, fileList }) => { //file为当前操作的file
    // file与fileList中最后一个file代表同个图片的不同对象,,
    //第一个file是我们操作的file,它指向了一个对象a
    //fileList[fileList.length - 1]是数组最后一个file,它指向了一个对象b,对象b和a此时的数据完全相同
    //file.name = name,file.url = url把对象a的数据改了,但此时对象b的数据没改,fileList里还是b,所有有问题
    //需要将file = fileList[fileList.length - 1],让file重新指向对象b,再来改
    console.log('handleChange()', file.status, file === fileList[fileList.length - 1])
    // 如果上传成功
    if (file.status === 'done') {
      // 将数组最后一个file保存到file变量
      file = fileList[fileList.length - 1]
      // 取出响应数据中的图片文件名和url
      const {name, url} = file.response.data
      // 保存到上传的file对象
      file.name = name
      file.url = url
    } else if (file.status === 'removed') { // 删除
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
      // 更新状态,更新界面
      this.setState({ fileList })
    }
  }

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
          onPreview={this.handlePreview} //预览大图,即点眼睛
          onChange={this.handleChange} //file状态改变 上传,删除图片
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

