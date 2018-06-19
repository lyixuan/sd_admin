import React from 'react'
import {checkoutAuthRoute} from '../utils/checkoutUserAuthInfo'

function checkoutAuthoried(authority) {
  if (!authority) {
    return true;
  }
  if (typeof authority === 'string') {
    if (checkoutAuthRoute(authority)) {
      return true;
    }
    return false;
  }
  if (Array.isArray(authority)) {
    return authority.find((item) => {
      if (checkoutAuthRoute(item)) {
        return item
      }
    }) ? true : false
  }
  if(typeof authority === 'function'){
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
    super(props)
    this.state = {
      isShowElement: false,
      authority: this.props.authority || null,
    }
  }

  componentDidMount() {
    const authority = this.state.authority;
    let isShowElement = checkoutAuthoried(authority);
    this.setState({isShowElement});
  }

  render() {
    return (
      !this.state.isShowElement ? null : {...this.props.children}
    )
  }
}

export default AuthorizedButton
