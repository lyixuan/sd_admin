import React, { Component } from 'react';
import { Table, Form, Button, Popconfirm, Row, Col, Select, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import EditUserForm from '../../selfComponent/UserForm/EditUserForm.js';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import {userTypeData, userTypeDataReset } from '../../utils/dataDictionary';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
let flag1 = 'class';
let flag2 = 'class';
let flag = 'class';
let responseComList = [];
let responseComListBackup = [];
let propsVal = '';
let userTypeFlag =  'class';

const WrappedRegistrationForm = Form.create()(EditUserForm);

@connect(({ user, loading }) => ({
  user,
  submit: loading.effects['user/updateUserbasicInfo'],
  wechatList: loading.effects['user/wechatList'],
  listOrg: loading.effects['user/listOrg'],
  userList: loading.effects['user/getUserlist'],
  addPosi: loading.effects['user/addPosition'],
}))
class EditUser extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.getUrlParams();
    const userVal = this.props.user;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    this.state = {
      mail: !arrValue.mail ? null : arrValue.mail,
      listOrgLiost: listOrgValues || [],
      visible: false,
      clickFlag:1,
      userType:null,
      shownameid:null,
      privilege:null,
      positionId:null,
    };
  }

  componentDidMount() {
    const wechatListParams = {};
    this.props.dispatch({
      type: 'user/wechatList',
      payload: { wechatListParams },
    });
    const listOrgParams = {};
    this.props.dispatch({
      type: 'user/listOrg',
      payload: { listOrgParams },
    });
    const getUserlistParams = { mail: this.state.mail };
    this.props.dispatch({
      type: 'user/getUserlist',
      payload: { getUserlistParams },
    });
    responseComListBackup = !this.state.listOrgLiost
      ? []
      : this.fullListFun(this.state.listOrgLiost);
  }

  // 编辑岗位函数
  onEdit = (key) => {
    const aa= key.userType
    const bb= key.shownameid
    const strs = !bb ? [] : bb.split(',');
    responseComList = this.responseComListFun(aa);
    const arr = !strs
      ? []
      : strs.map(el => {
        return Number(el);
      });
    userTypeFlag = userTypeDataReset[aa]
    this.setState({
      clickFlag:2,
      userType:userTypeDataReset[aa],
      shownameid:arr,
      visible: true,
      privilege:key.privilege==="无"?1:0,
      positionId:key.id,
    });
  };
  // 创建岗位函数
  onCreate = () => {
    this.setState({
      clickFlag:1,
      visible: true,
    });
  };

  // 删除用户
  onDelete = val => {
    const deletePositionParams = {
      id:!val.id?undefined:val.id,
    };
    const getUserlistParams={ mail: this.state.mail };
    this.props.dispatch({
      type: 'user/deletePosition',
      payload: { deletePositionParams, getUserlistParams },
    });
  };

  setDialogSHow(bol) {
    flag1='class';
    flag2='class';
    this.setState({
      visible: bol,
    });
  }

  getData = (values,arrValue)=>{
    const rUserType = values.userType;
    const len = !values.responseCom?null:values.responseCom.length;
    let typeId = !len?undefined:values.responseCom[len - 1];
    if (typeof typeId === 'string' || rUserType === 'admin' || rUserType === 'boss'|| rUserType === 'others') {
      typeId = undefined;
    }
    const getUserlistParams={mail:this.state.mail}
    if (this.state.clickFlag===1) {
      const addPositionParams = {
        name: !arrValue.name ? undefined : arrValue.name,
        mail: !arrValue.mail ? undefined : arrValue.mail,
        mobile: !arrValue.mobile ? undefined : arrValue.mobile,
        joinDate:!arrValue.joindate ? undefined : arrValue.joindate,
        idCard:!arrValue.idcard ? undefined : arrValue.idcard,
        sex:!arrValue.sex ? undefined : arrValue.sex,
        positionList:{
          privilege:rUserType==='admin'?1:values.privilege,
          userType: rUserType,
          userTypeId: typeId,
          wechatDepartmentId: Number(arrValue.wechatdepartmentid),
          wechatDepartmentName: !arrValue.wechatdepartmentname ? undefined : arrValue.wechatdepartmentname,
        },
      }
      this.props.dispatch({
        type: 'user/addPosition',
        payload: { addPositionParams,getUserlistParams  },
      });
    } else {
      const updateUserPositionInfoParams = {
        id:!this.state.positionId?undefined:this.state.positionId,
        privilege:rUserType==='admin'?1:values.privilege,
        userType: rUserType,
        userTypeId: typeId,
        wechatDepartmentId: Number(arrValue.wechatdepartmentid),
        wechatDepartmentName: !arrValue.wechatdepartmentname ? undefined : arrValue.wechatdepartmentname,
      }
      this.props.dispatch({
        type: 'user/updateUserPositionInfo',
        payload: { updateUserPositionInfoParams,getUserlistParams },
      });
    }
    this.setDialogSHow(false);
  }

  responseComListFun = (aa) => {
    const responseValue = [];
    const userVal = this.props.user;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    const newResponseComList = listOrgValues;
    const levelValue = !aa ? 'class' : userTypeDataReset[aa];
    const userType = levelValue;
    if (userType === 'family') {
      newResponseComList.map(item => {
        const firstChldren = [];
        const chldren1 = item.sub;
        chldren1.map(value => {
          firstChldren.push({
            value: value.id,
            label: value.name,
            level: value.level,
          });
          return 0;
        });
        responseValue.push({
          value: item.id,
          label: item.name,
          level: item.level,
          children: firstChldren,
        });
        return 0;
      });
    }
    if (userType === 'college') {
      newResponseComList.map(item => {
        responseValue.push({
          value: item.id,
          label: item.name,
          level: item.level,
        });
        return 0;
      });
    }
    return responseValue.length === 0 ? responseComListBackup : responseValue;
  };

  fullListFun = val => {
    const value = [];
    val.map(item => {
      const firstChldren = [];
      const chldren1 = item.sub;
      chldren1.map(obj => {
        const chldren2 = obj.sub;
        const secondChldren = [];
        chldren2.map(list => {
          secondChldren.push({
            value: list.id,
            label: list.name,
            level: list.level,
          });
          return 0;
        });
        firstChldren.push({
          value: obj.id,
          label: obj.name,
          level: obj.level,
          children: secondChldren,
        });
        return 0;
      });
      value.push({
        value: item.id,
        label: item.name,
        level: item.level,
        children: firstChldren,
      });
      return 0;
    });
    return value;
  };

  handleSelectChange = value => {
    const aa = value;
    if(this.state.clickFlag===1){
      flag1=aa;
    }else{
      flag2=aa;
      userTypeFlag=aa;
    }
    flag = aa;
    const responseValue = [];
    const userVal = this.props.user;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    const newResponseComList = listOrgValues;
    propsVal.form.setFieldsValue({
      privilege: 1,
      responseCom:[],
    });
    if(flag === 'admin'||flag === 'others'||flag === 'boss'){
      propsVal.form.setFieldsValue({
        responseCom:[],
      });}
    if (flag === 'family') {
      newResponseComList.map(item => {
        const firstChldren = [];
        const chldren1 = item.sub;
        chldren1.map(val => {
          firstChldren.push({
            value: val.id,
            label: val.name,
            level: val.level,
          });
          return 0;
        });
        responseValue.push({
          value: item.id,
          label: item.name,
          level: item.level,
          children: firstChldren,
        });
        return 0;
      });
    } else if (flag === 'college') {
      newResponseComList.map(item => {
        responseValue.push({
          value: item.id,
          label: item.name,
          level: item.level,
        });
        return 0;
      });
    }
    responseComList = responseValue.length === 0 ? responseComListBackup : responseValue;
  };

  handleSubmit = (values,data) => {
    const rname = values.wechatDepartmentName;
    let newRoleId = 0;
    const roleList = this.props.user.wechatList.response.data.department;
    roleList.map(item => {
      if (item.name === rname) {newRoleId = item.id}
      return 0;
    });
    const updateUserInfoParams = {
      name: values.name.replace(/\s*/g, ''),
      mail: values.mail,
      mobile: values.phone,
      sex: Number(values.sex),
      idCard:values.idCard,
      joinDate:data,
      positionList:{
        wechatDepartmentId: Number(newRoleId),
        wechatDepartmentName: !rname ? undefined : rname,
      },
    };
    this.props.dispatch({
      type: 'user/updateUserbasicInfo',
      payload: { updateUserInfoParams },
    });
  };

  resetContent = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        privilege: item.privilege === 0 ? '有' : '无',
        userType: userTypeData[item.usertype],
        showName: !item.showname ? null : item.showname.replace(/,/g, ' | '),
        shownameid:!item.shownameid?null:item.shownameid,
        id: item.positionid,
      }));
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '级别',
        dataIndex: 'userType',
      },
      {
        title: '负责单位',
        dataIndex: 'showName',
      },
      {
        title: '绩效权限',
        dataIndex: 'privilege',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (record.privilege === '有' ? null :(
            <div>
              <AuthorizedButton authority="/user/editUser">
                <span style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }} onClick={() => this.onEdit(record)}>编辑</span>
              </AuthorizedButton>
              <AuthorizedButton authority="/user/deleteUser">
                <Popconfirm title="是否确认删除该用户?" onConfirm={() => this.onDelete(record)}>
                  <span style={{ color: '#52C9C2', cursor: 'pointer' }}>删除</span>
                </Popconfirm>
              </AuthorizedButton>
            </div>));}},
    ];
    return columns || [];
  };
  // 模态框回显
  editName = (e) => {
    const userVal = this.props.user;
    const aaa = !userVal.getUserlistData?null:userVal.getUserlistData;
    const arrValue = !aaa
      ? null
      : !aaa.data ? null : !aaa.data.generalAttribute
        ? null : aaa.data.generalAttribute;
    this.handleSearch(e,arrValue)
  };

  handleSearch = (e,arrValue) => {
    e.preventDefault();
    propsVal.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.getData(values, arrValue)
      }
    });
  };

  render() {
    const columns = this.columnsData();
    const {addPosi} =this.props
    const userVal = this.props.user;
    const disabled = true;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    responseComListBackup = !listOrgValues ? [] : this.fullListFun(listOrgValues);
    responseComList =
      !responseComList || responseComList.length === 0
        ? responseComListBackup
        : responseComList;
    const { visible } = this.state;
    const formLayout = 'inline';
    const aaa = !userVal.getUserlistData?null:userVal.getUserlistData;
    const arrValue = !aaa
      ? null
      : !aaa.data ? null : !aaa.data.generalAttribute
        ? null : aaa.data.generalAttribute;
    const tableList = !aaa
      ? null
      : !aaa.data ? null : !aaa.data.postionAttribute
        ? null : aaa.data.postionAttribute;
    const dataSource = !tableList ? [] : this.fillDataSource(tableList);
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      console.log(this.state.userType,userTypeFlag)
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*级&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:">
                  {getFieldDecorator('userType', {
                    initialValue: this.state.clickFlag===1?null:this.state.userType,
                    rules: [
                      { validator(rule, value, callback) {
                          if (!value) {callback({ message: '请选择级别！' })}
                          callback();
                        }},
                    ],
                  })(
                    <Select style={{ width: 280 }} onChange={this.handleSelectChange}>
                      <Option value="college">院长或副院长</Option>
                      <Option value="family">家族长</Option>
                      <Option value="group">运营长</Option>
                      <Option value="class">班主任</Option>
                      <Option value="admin">管理员</Option>
                      <Option value="boss">管理层</Option>
                      <Option value="others">无绩效岗位</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*负责单位">
                  {getFieldDecorator('responseCom', {
                    initialValue: this.state.clickFlag===1?[]:this.state.shownameid,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (typeof value[0] === 'string' || !value[0]) {
                            if(flag === 'admin' || flag === 'boss' || flag === 'others'){
                              callback();
                            }else{
                              callback({ message: '请选择负责单位！' });
                            }
                          }
                          callback();
                        },
                      },
                    ],
                  })(<Cascader
                    options={responseComList}
                    style={{ width: 280 }}
                    disabled={this.state.clickFlag===1?(flag1 === 'admin' || flag1 === 'boss' || flag1 === 'others' ? disabled : false):
                      (userTypeFlag==='admin'||userTypeFlag==='boss'||userTypeFlag==='others'||flag2 === 'admin' || flag2 === 'boss' || flag2 === 'others' ? disabled : false)}
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*绩效权限">
                  {getFieldDecorator('privilege', {
                    initialValue: this.state.clickFlag===1?1:this.state.privilege,
                    rules: [],
                  })(
                    <RadioGroup
                      style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}
                    >
                      <Radio name="privilege" value={0} disabled={this.state.clickFlag===1?(flag1 === 'admin'? disabled : false):(userTypeFlag==='admin'||flag2 === 'admin'? disabled : false)} >
                        是
                      </Radio>
                      <Radio name="privilege" value={1}>
                        否
                      </Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      );
    });

    const modalContent = (
      <div>
        <Row style={{ marginBottom: '14px' }}>
          <Col span={4} offset={1}>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</Col>
          <Col style={{ textAlign: 'left', fontSize: '14px' }} offset={0}>{!arrValue ? '' : !arrValue.name ? '' : arrValue.name}</Col>
        </Row>
        <Row style={{ marginBottom: '14px' }}>
          <Col span={4} offset={1}>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</Col>
          <Col offset={1} style={{ textAlign: 'left', fontSize: '14px' }}>{!arrValue ? '' : !arrValue.sex ? '' : arrValue.sex === 1 ? '男' : '女'}</Col>
        </Row>
        <Row style={{ marginBottom: '14px' }}>
          <Col span={4} offset={1}>手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机:</Col>
          <Col style={{ textAlign: 'left', fontSize: '14px' }} offset={1}>{!arrValue ? '' : !arrValue.mobile ? '' : arrValue.mobile}</Col>
        </Row>
        <Row>
          <Col span={4} offset={1} style={{ padding: '3px' }}>邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱:</Col>
          <Col style={{ textAlign: 'left', fontSize: '14px' }} offset={1}>{!this.state.mail ? '' : this.state.mail}</Col>
        </Row>
        <WrappedAdvancedSearchForm />
      </div>
    );

    return (
      <div>
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={
            <WrappedRegistrationForm
              jumpFunction={this.props || {}}
              resetContent={() => {
                this.resetContent();
              }}
              handleSubmit={(values,data) => {
                this.handleSubmit(values,data);
              }}
            />
          }
          contentButton={
            <Button
              style={{ marginTop: '36px', width:'110px'}}
              type="primary"
              className={common.submitButton}
              onClick={() => this.onCreate()}
              loading={addPosi}
            >
              添加岗位
            </Button>
          }
          contentTable={
            <Table
              style={{ marginTop: '24px' }}
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              className={common.tableContentStyle}
            />
          }
        />
        <ModalDialog
          style={{width:'620px'}}
          title={this.state.clickFlag===1?"添加岗位":'编辑岗位'}
          visible={visible}
          modalContent={modalContent}
          clickOK={(e) => this.editName(e)}
          footButton={['取消', '提交']}
          showModal={bol => {
            this.setDialogSHow(bol);
          }}
        />
      </div>
    );}
}

export default EditUser;
