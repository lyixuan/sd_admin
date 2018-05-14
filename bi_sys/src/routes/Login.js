import React, { Component }  from 'react';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import { Button } from 'antd-mobile';
import {setItem} from "../utils/localStorage"

class Login extends Component{
  constructor(props){
    super(props)
    this.state={}
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.login.userInfo!==null) {
      setItem(nextProps.login.userInfo);
      this.props.dispatch(
        routerRedux.push({
          pathname: '/home',
          state: {},
        })
      );
    }
  }

  onLogin(){         //请求微信授权
    this.props.dispatch({
      type:'login/fetch',
      payload:''
    })
  }
  render(){
    return(
      <div onClick={()=>{this.onLogin()}}>
        <Button>登录</Button>
      </div>
    )
  }
}
export default connect((login)=>(login))(Login);
