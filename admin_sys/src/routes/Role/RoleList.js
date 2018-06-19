import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class RoleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };
  componentDidMount(){
    // this.props.setUrlParams()
  }
  onClick=()=>{
    this.props.setCurrentUrlParams({s:5})
  }
  render() {
   console.log(this)
    return (
      <PageHeaderLayout>
        <div onClick={this.onClick}>
          角色列表
        </div>
       </PageHeaderLayout>
    );
  }
}

export default RoleList;
