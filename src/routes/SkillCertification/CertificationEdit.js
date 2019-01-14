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
  collegeFlag: loading.effects['certification/findAllOrg'],
  itemDetal: loading.effects['certification/getItemById'],
  subItemFlag: loading.effects['certification/saveOrModifySubItem'],
}))
class CertificationEdit extends Component {
  constructor(props) {
    super(props);
    const { id = null} = this.props.getUrlParams();
    this.state = {
      id,
    };
  }
  componentDidMount() {
    const {id=null}=this.state
    const params={id}
    const nullParams={}
    this.props.dispatch({
      type: 'certification/getItemById',
      payload: { params },
    });
    this.props.dispatch({
      type: 'certification/findAllOrg',
      payload: { nullParams },
    });

  }

  // 点击确定按钮请求接口
  handleSubmit = values => {
    const {id=1}=this.state;
    const saveOrModifyItemParams = {
        id:Number(id),
        orderNum:Number(values.orderNum),
        name:values.name,
        assessCyc: Number(values.assessCyc),
        assessStyle:values.assessStyle,
        assessStandard:values.assessStandard,
        code:values.code,
        obtainedIcon:'/staticFile/aicon.png',
        originalIcon:'/staticFile/aicon.png',
        isDisable:values.isDisable,
        enabledSubDefine:values.enabledSubDefine,

    };
    this.props.dispatch({
      type: 'certification/saveOrModifyItem',
      payload: { saveOrModifyItemParams },
    });
  };

  // 删除子项目
  subItemDelete=val=>{
    console.log(val);
  }

  // table点击确定按钮请求接口
  tableSubmit = values => {
    const {id=1}=this.state;
    const params={id}
    const saveOrModifySubItemParams = {
      certificationItemId:Number(id),
      orgType:'college',
      name:values.name,
      collegeId:Number(values.collegeId),
    };
    this.props.dispatch({
      type: 'certification/saveOrModifySubItem',
      payload: { saveOrModifySubItemParams,params },
    });
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
          dataSource={this.props}
          tableSubmit={values => {
            this.tableSubmit(values);
          }}
        />
      </>
    );
  }
}

export default CertificationEdit;
