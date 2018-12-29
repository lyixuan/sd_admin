import React from 'react';
import { checkPathname } from '../common/isCheckAuth';

function checkoutAuthoried(authority) {
  if (!authority) {
    return true;
  }
  if (typeof authority === 'string') {
    if (checkPathname(authority)) {
      return true;
    }
    return false;
  }
  if (typeof authority === 'function') {
    try {
      const bool = authority();
      if (bool) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}

class AuthorizedButton extends React.Component {
  constructor(props) {
    super(props);
    const { authority } = this.props;
    this.state = {
      isShowElement: checkoutAuthoried(authority),
    };
  }

  render() {
    return !this.state.isShowElement ? null : { ...this.props.children };
  }
}

export default AuthorizedButton;
