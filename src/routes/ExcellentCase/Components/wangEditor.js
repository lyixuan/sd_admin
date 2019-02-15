import React, { Component } from 'react';
import E from 'wangeditor';

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
      editor.customConfig.uploadImgShowBase64 = true;
      // editor.customConfig.uploadImgServer ='/server';
      editor.customConfig.showLinkImg = false;
    }
    editor.create();
    editor.txt.html('<p>请输入...</p>');
  }
  render() {
    return <div id="editorElem" style={{ textAlign: 'left' }} />;
  }
}

export default Editor;
