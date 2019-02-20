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
    this.state = {};
  }

  componentWillUnmount() {
    // 点击添加的时候清除文件
    this.saveFileList([], 3); // 1代表已获得图标，2是未获得，3是全部图标
  }

  // 点击确定按钮请求接口
  handleSubmit = (values, fileList1 = [], fileList2 = []) => {
    const { response } = fileList1[0] ? fileList1[0] : '';
    const obtainedIcon = response.data ? response.data : '';
    const file2 = fileList2[0] ? fileList2[0].response : '';
    const originalIcon = file2 ? file2.data : '';
    const { userTypeFormList, fitUser, applyType, allowUpdateAttachment } = values;
    const uerTypeLen = fitUser === 100 ? userTypeFormList.length : 0;
    const turnObj =
      uerTypeLen === 2
        ? [{ userType: 'class' }, { userType: 'group' }]
        : userTypeFormList[0] === 'class' ? [{ userType: 'class' }] : [{ userType: 'group' }];
    const jsonList = fitUser === 100 ? turnObj : [];
    const saveOrModifyItemParams = {
      orderNum: Number(values.orderNum),
      name: values.name,
      assessCyc: Number(values.assessCyc),
      assessStyle: values.assessStyle,
      assessStandard: values.assessStandard,
      obtainedIcon,
      originalIcon,
      userTypeFormList: jsonList,
      fitUser,
      applyType,
      allowUpdateAttachment,
    };
    // console.log(userTypeFormList,jsonList,saveOrModifyItemParams)
    this.props.dispatch({
      type: 'certification/saveOrModifyItem',
      payload: { saveOrModifyItemParams },
    });
  };
  // 点击取消按钮跳转到list页面
  resetContent = () => {
    window.history.go(-1);
  };

  saveFileList = (fileList, type = 1) => {
    this.props.dispatch({
      type: 'certification/saveFileList',
      payload: { fileList, type },
    });
  };

  render() {
    const { fileList1, fileList2 } = this.props.certification;
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <WrappedRegistrationForm
            jumpFunction={this.props}
            fileList1={fileList1}
            fileList2={fileList2}
            resetContent={() => {
              this.resetContent();
            }}
            handleSubmit={(values, file1, file2) => {
              this.handleSubmit(values, file1, file2);
            }}
            saveFileList={(param, type) => {
              this.saveFileList(param, type);
            }}
          />
        }
      />
    );
  }
}

export default CertificationCreate;
