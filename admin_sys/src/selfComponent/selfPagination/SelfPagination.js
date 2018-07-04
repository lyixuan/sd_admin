import React, { Component } from 'react';
import { Pagination } from 'antd';
import common from '../../routes/Common/common.css';

class SelfPagination extends Component {
  render() {
    const {
      defaultCurrent,
      defaultPageSize,
      pageSizeOptions,
      total,
      onChange,
      onShowSizeChange,
    } = this.props;
    return (
      <Pagination
        showSizeChanger
        className={common.paginationStyle}
        onChange={onChange}
        onShowSizeChange={onShowSizeChange}
        defaultCurrent={defaultCurrent || 1}
        total={total || 0}
        defaultPageSize={defaultPageSize || 30}
        pageSizeOptions={pageSizeOptions || ['30']}
      />
    );
  }
}

export default SelfPagination;
