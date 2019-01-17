import React, { Component } from 'react';
import ScoreAdjust from './component/ScoreAdjust_CE';
import ContentLayout from '../../layouts/ContentLayout';

class ScoreAdjustCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ContentLayout routerData={this.props.routerData}>
        <ScoreAdjust type="edit" modelType={1} />
      </ContentLayout>
    );
  }
}

export default ScoreAdjustCreate;
