import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import CertificationCreate_Form from './component/CertificationCreate_Form.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(CertificationCreate_Form);
@connect(({ certification, loading }) => ({
  certification,
  submit: loading.effects['certification/saveOrModifyItem'],
}))
class CertificationCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  saveFileList = (fileList,type) => {
    this.props.dispatch({
      type: 'certification/saveFileList',
      payload: { fileList,type },
    });
  };

  // 点击确定按钮请求接口
  handleSubmit = (values,fileList1=[],fileList2=[]) => {
    const {response}=fileList1[0]?fileList1[0]:'';
    const obtainedIcon=response.data?response.data:'';

    const file2=fileList2[0]?fileList2[0].response:'';
    const originalIcon=file2?file2.data:'';

    const saveOrModifyItemParams = {
        orderNum:Number(values.orderNum),
        name:values.name,
        assessCyc: Number(values.assessCyc),
        assessStyle:values.assessStyle,
        assessStandard:values.assessStandard,
        obtainedIcon,
        originalIcon,
    };
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
            handleSubmit={(values, fileList1,fileList2) => {
              this.handleSubmit(values,  fileList1,fileList2);
            }}
            saveFileList={(file)=>{this.saveFileList(file)}
            }
          />
        }
      />
    );
  }
}

export default CertificationCreate;
