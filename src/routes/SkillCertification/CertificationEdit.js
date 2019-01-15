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
  handleSubmit = (values,fileList1=[],fileList2=[]) => {
    const {response}=fileList1[0]?fileList1[0]:'';
    const obtainedIcon=response.data?response.data:'';
    const file2=fileList2[0]?fileList2[0].response:'';
    const originalIcon=file2?file2.data:'';
    const {id=1}=this.state;
    const saveOrModifyItemParams = {
        id:Number(id),
        orderNum:Number(values.orderNum),
        name:values.name,
        assessCyc: Number(values.assessCyc),
        assessStyle:values.assessStyle,
        assessStandard:values.assessStandard,
        code:values.code,
        obtainedIcon,
        originalIcon,
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
    // console.log(val);
    const {id=1}=this.state;
    const params={id:val.id} // 子项目删除
    const param = {id}; // 传入认证项目id为了删除后重新渲染list
    this.props.dispatch({
      type: 'certification/delSubItemById',
      payload: { params,param },
    });
  }

  // table点击确定按钮请求接口
  tableSubmit = (values,clickFlag,subId) => {
    const {id=1}=this.state;
    const params={id}
    const temParam ={
      certificationItemId:Number(id),
      orgType:'college',
      name:values.name,
      collegeId:Number(values.collegeId),
    };
    const saveOrModifySubItemParams=clickFlag===1?temParam:{...temParam,id:subId}
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
              handleSubmit={(values, fileList1,fileList2) => {
                this.handleSubmit(values,  fileList1,fileList2);
              }}
            />
          }
        />
        <Table
          dataSource={this.props}
          tableSubmit={(values,clickFlag,id) => {
            this.tableSubmit(values,clickFlag,id);
          }}
          subItemDelete={(val)=>{
            this.subItemDelete(val);
          }}
        />
      </>
    );
  }
}

export default CertificationEdit;
