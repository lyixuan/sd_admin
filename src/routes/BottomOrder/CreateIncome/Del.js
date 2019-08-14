import React, { Component } from 'react';
import { connect } from 'dva';
import Batch from '../../../components/batch';

@connect(({ batch, loading }) => ({
  batch,
  loading,
}))
class RefundAdd extends Component {
  render() {
    return (
      <div>
        <Batch
          routerData={this.props.routerData}
          batch={this.props.batch}
          loading={this.props.loading}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default RefundAdd;
