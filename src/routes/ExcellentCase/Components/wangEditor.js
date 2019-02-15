import React, { Component } from 'react';
import E from 'wangeditor';

class App extends Component {
  componentDidMount() {
    const elem = document.getElementById('editorElem');
    const editor = new E(elem);
    editor.customConfig.onchange = html => {
      if (this.props.onChange) {
        this.props.onChange(html);
      }
    };
    editor.create();
  }
  render() {
    return <div id="editorElem" style={{ textAlign: 'left' }} />;
  }
}

export default App;
