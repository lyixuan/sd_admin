import React, { Component } from 'react';
import { Pagination } from 'antd';
import common from '../../routes/Common/common.css';

class SelfPagination extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state = {
      defaultCurrent:this.props.defaultCurrent || 1,
      defaultPageSize:this.props.defaultPageSize || 50,
      pageSizeOptions:this.props.pageSizeOptions || [],
      total:this.props.total||0,
    };
    console.log(this.state)
  }
  render() {

    return(
      <Pagination
        showSizeChanger
        className={common.paginationStyle}
        onChange={this.props.onChange}
        onShowSizeChange={this.props.onShowSizeChange}
        defaultCurrent={this.state.defaultCurrent}
        total={this.state.total}
        defaultPageSize={this.state.defaultPageSize}
        pageSizeOptions={this.state.pageSizeOptions}
      />);
  }
}

export default SelfPagination;


