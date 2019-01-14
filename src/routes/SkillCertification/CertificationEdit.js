import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import CertificationEdit_Form from './component/CertificationEdit_Form.js';
import Table from './component/CertificationEdit_Table.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(CertificationEdit_Form);
@connect(({ certification, loading }) => ({
  certification,
  submit: loading.effects['certification/saveOrModifyItem'],
}))
class CertificationEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  // 点击确定按钮请求接口
  handleSubmit = values => {
    const assessStyleRest = values.assessStyle || "";
    const assessStandardRest = values.assessStandard ||"";
    const assessStyle = assessStyleRest.replace(/↵/g,'\r\n');
    const assessStandard=assessStandardRest.replace(/↵/g,'\r\n');
    const saveOrModifyItemParams = {
        orderNum:Number(values.orderNum),
        name:values.name,
        assessCyc: Number(values.assessCyc),
        assessStyle,
        assessStandard,
        obtainedIcon:'/staticFile/aicon.png',
        originalIcon:'/staticFile/aicon.png',
    };
    console.log(values,saveOrModifyItemParams)
    this.props.dispatch({
      type: 'certification/saveOrModifyItem',
      payload: { saveOrModifyItemParams },
    });
  };

  // table点击确定按钮请求接口
  tableSubmit = values => {
    console.log(values);
  };
  // 点击取消按钮跳转到list页面
  resetContent = () => {
    window.history.go(-1);
  };

  render() {
    return (
      <>
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={
            <WrappedRegistrationForm
              jumpFunction={this.props}
              resetContent={() => {
                this.resetContent();
              }}
              handleSubmit={values => {
                this.handleSubmit(values);
              }}
            />
          }
        />
        <Table
          dataSource={1}
          tableSubmit={values => {
            this.tableSubmit(values);
          }}
        />
      </>
    );
  }
}

export default CertificationEdit;
