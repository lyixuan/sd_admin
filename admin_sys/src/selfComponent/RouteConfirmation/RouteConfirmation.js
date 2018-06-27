import React from 'react';
import { Prompt } from 'dva/router';

class RouteConfirmation extends React.Component {
  getPropsMessage = () => {
    return this.props.message;
  };

  render() {
    return <Prompt when={this.props.isShowPrompt} message={this.getPropsMessage} />;
  }
}

export default RouteConfirmation;
