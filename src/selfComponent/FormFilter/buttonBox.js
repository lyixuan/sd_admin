import React, { PureComponent } from 'react';
import { Button } from 'antd';
import common from '../../routes/Common/common.css';

export default class ButtonBox extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Button type="primary" className={common.searchButton} onClick={this.props.onSubmit}>
          查询
        </Button>
        <Button type="primary" className={common.resetButton} onClick={this.props.onReset}>
          重置
        </Button>
      </React.Fragment>
    );
  }
}
