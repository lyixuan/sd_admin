import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import CertificationCreate_Form from './component/CertificationCreate_Form.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(CertificationCreate_Form);
@connect(({ certification, loading }) => ({
  certification,
  submit: loading.effects['certification/saveOrModifyItem'],
  // listOrg: loading.effects['certification/listOrg'],
  // roleOrg: loading.effects['certification/getUserRoleList'],
}))
class CertificationCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }

  // 点击确定按钮请求接口
  handleSubmit = (values) => {
    const assessStyleRest = values.assessStyle || "";
    const assessStandardRest = values.assessStandard ||"";
    const assessStyle = assessStyleRest.replace(/↵/g,'\r\n');
    const assessStandard=assessStandardRest.replace(/↵/g,'\r\n');
    const saveOrModifyItemParams = {
      certificationItemForm:{
        orderNum:Number(values.orderNum),
        name:values.name,
        assessCyc: Number(values.assessCyc),
        assessStyle,
        assessStandard,
        obtainedIcon:'/staticFile/aicon.png',
        originalIcon:'/staticFile/aicon.png',
      },
    };
    // console.log(assessStandardRest,'-----',assessStandard,assessStyleRest,'-----',assessStyle,'=====',saveOrModifyItemParams,"\r\n")
    this.props.dispatch({
      type: 'certification/saveOrModifyItem',
      payload: { saveOrModifyItemParams },
    });
  };
  // 点击取消按钮跳转到list页面
  resetContent = () => {
    window.history.go(-1);
  };

  render() {
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <WrappedRegistrationForm
            jumpFunction={this.props}
            resetContent={() => {
              this.resetContent();
            }}
            handleSubmit={(values, dataString) => {
              this.handleSubmit(values, dataString);
            }}
          />
        }
      />
    );
  }
}

export default CertificationCreate;
