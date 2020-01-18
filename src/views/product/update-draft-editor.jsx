/*
1.去github找库:https://github.com/jpuri/react-draft-wysiwyg
2.去官网找demo: https://jpuri.github.io/react-draft-wysiwyg/#/demo
3.发现样式不对, 引入css import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
4.样式还是不对,因为之前规定了formLayout
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 8}
 改一下
<Item label="Product Detail" wrapperCol={{span:20}}>
 <UpdateDraftEditor/>
 </Item>
 5.样式没边框,读文档,发现 editorStyle: style object applied around the editor
 删掉wrapperClassName,editorClassName,自己写style editorStyle={{height: 200, border: '1px solid black', paddingLeft: 10 }}
 5.隐藏生成的标签
 6.ref得到需要的放到数据库的值 getDetail = ()
 7.onEditorStateChange 状态改变处理,每输入一个字母就改变状态,太频繁了,搞个函数防抖
引入import _ from 'lodash'
包装 onEditorStateChange = _.debounce((editorState) 每2s改变状态
结果有问题:状态是变得不频繁了,但输入的第一下会变得很慢  改为 0.5s (试试节流?)
8.把已有交给他显示
父组件 detail={product.detail}
子组件
static propTypes = {
    detail: PropTypes.string
  }
显示:

找文档
const html = '<p>Hey this <strong>editor</strong> rocks </p>';
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
写到componentWillMount () {} 里
9.上传图片功能不全,这个方法我就不写了
 */











import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import _ from 'lodash'

export default class UpdateDraftEditor extends Component {

  static propTypes = {
    detail: PropTypes.string
  }

  state = {
    editorState: EditorState.createEmpty(),
  }

  componentWillMount () {
    const detail = this.props.detail
    if (detail) {
      // 根据detail生成一个editorState
      const contentBlock = htmlToDraft(detail)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      // 更新状态
      this.setState({editorState})
    }
  }

  //pass to parent compont
  getDetail = () => draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))

  onEditorStateChange = _.debounce((editorState) => {
    this.setState({
      editorState,
    })
  },100);

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{height: 200, border: '1px solid black', paddingLeft: 10 }}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}

