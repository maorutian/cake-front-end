import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import _ from 'lodash';

export default class UpdateDraftEditor extends Component {

  static propTypes = {
    detail: PropTypes.string
  };

  state = {
    editorState: EditorState.createEmpty(),
  };

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

