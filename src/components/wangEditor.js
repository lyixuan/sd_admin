import React, { Component } from 'react';
import E from 'wangeditor';
import { uploadPic } from '../services/api';

/* global UPLOAD_HOST */

const PlaceHolder = '<p style="color:#aaa" class="mypleceholder">请输入...</p>';
class Editor extends Component {
  componentDidMount() {
    const elem = document.getElementById('editorElem');
    const editor = new E(elem);
    editor.customConfig.onchange = html => {
      if (this.props.onChange) {
        this.props.onChange(html);
      }
    };

    if (editor.customConfig) {
      editor.customConfig.menus = [
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'foreColor', // 文字颜色
        'justify', // 对齐方式
        'image', // 插入图片
        'undo', // 撤销
        'redo', // 重复
      ];
      // editor.customConfig.uploadImgShowBase64 = true;
      editor.customConfig.uploadImgServer = uploadPic();
      editor.customConfig.showLinkImg = false;
      editor.customConfig.uploadFileName = 'file';
    }
    editor.customConfig.uploadImgHooks = {
      customInsert(insertImg, result) {
        insertImg(`${UPLOAD_HOST}${result.data.path}`);
      },
    };
    editor.customConfig.onfocus = function() {
      let str = editor.txt.html();
      if (str.indexOf(PlaceHolder) !== -1) {
        str = str.replace(PlaceHolder, '');
        editor.txt.html(str);
      }
    };
    editor.customConfig.onblur = function(html) {
      if (html === '<p><br></p>') {
        editor.txt.html(PlaceHolder);
      }
    };
    editor.create();
    editor.txt.html(PlaceHolder);
  }
  render() {
    return <div id="editorElem" style={{ textAlign: 'left', position: 'relative', zIndex: 1 }} />;
  }
}

export default Editor;
