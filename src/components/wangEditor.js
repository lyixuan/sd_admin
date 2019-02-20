/** 参数 path：string，图片上传的服务器 */
import React, { Component } from 'react';
import E from 'wangeditor';
import { checkoutToken } from '../utils/Authorized';

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
        'list', // 列表
        'justify', // 对齐方式
        'image', // 插入图片
        'undo', // 撤销
        'redo', // 重复
      ];
      // 自定义配置颜色（字体颜色、背景色）
      editor.customConfig.colors = [
        '#000000',
        '#999999',
        '#1c487f',
        '#4d80bf',
        '#c24f4a',
        '#8baa4a',
        '#7b5ba1',
        '#46acc8',
        '#f9963b',
        '#ffffff',
      ];
      // editor.customConfig.uploadImgShowBase64 = true;
      const { path } = this.props;
      if (path) {
        editor.customConfig.uploadImgServer = path;
      } else {
        console.error('父组件需要传参：path');
      }
      editor.customConfig.uploadImgHeaders = {
        authorization: checkoutToken(),
      };
      editor.customConfig.showLinkImg = false;
      editor.customConfig.uploadFileName = 'file';
      editor.customConfig.zIndex = 1;
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
