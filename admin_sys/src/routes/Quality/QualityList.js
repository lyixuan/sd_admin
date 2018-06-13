import React, {Component} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

class QualityList extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  };

  render() {
    return (
      <PageHeaderLayout>
        <div>
          质检列表
        </div>
      </PageHeaderLayout>

    );
  }
}

export default QualityList;
