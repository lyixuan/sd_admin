import React, { PureComponent } from 'react';
import { Button } from 'antd';

export default class ButtonBox extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Button type="primary" onClick={this.props.onSubmit}>
          查询
        </Button>
        <Button type="primary" onClick={this.props.onReset}>
          重置
        </Button>
      </React.Fragment>
    );
  }
}
