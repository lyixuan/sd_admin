import React, { Component } from 'react';
import E from 'wangeditor';
import { uploadPic } from '../services/api';

/* global UPLOAD_HOST */

const PlaceHolder = '<p style="color:#aaa" class="mypleceholder">请输入...</p>';
class Editor extends Component {
  componentDidMount() {
    const title = document.getElementById('editorTitle');
    const content = document.getElementById('editorContent');
    const editor = new E(title, content);
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
    return (
      <div style={{ border: '1px solid #eee', marginRight: '10px' }}>
        <div
          id="editorTitle"
          style={{
            textAlign: 'left',
            position: 'relative',
            backgroundColor: '#fbfbfb',
            height: '40px',
            lineHeight: '34px',
          }}
        />
        <div id="editorContent" style={{ height: '600px ' }} />
      </div>
    );
  }
}

export default Editor;
