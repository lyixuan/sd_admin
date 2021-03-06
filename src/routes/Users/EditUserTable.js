/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Table, Form, Button, Row, Col, Select, Cascader, Radio, Checkbox } from 'antd';
import { connect } from 'dva';

import common from '../Common/common.css';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
let flag1 = 'class'; // 创建时候的前端角色标示
let flag2 = 'class'; // 编辑时候的前端角色标示
let flag = 'class'; // 为了方便组织的层级循环使用，不同的flag组织的层级是不一样的
let responseComList = []; // 不同flag的层级结构
let responseComListBackup = []; // 所有的层级结构
let propsVal = '';

@connect(({ user, loading }) => ({
  user,
  addPosi: loading.effects['user/addPosition'],
}))
class EditUserTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: this.props.mail || '',
      visible: false,
      clickFlag: 1, // 1为创建进入，2为编辑进入
      userType: 'class',
      shownameid: null,
      privilege: null,
      positionId: null,
      currentstate: null,
      roleId: null,
      plainOptions: BI_Filter('VISIT_RIGHT_LIST|id->value,name->label'),
      defaultCheckedList: [],
    };
  }

  // 编辑岗位函数
  onEdit = key => {
    const userTypeVal = key.userType;
    const shownameidVal = key.shownameid;
    const strs = !shownameidVal ? [] : shownameidVal.split(',');
    responseComList = this.responseComListFun(userTypeVal);
    const arr = strs.map(el => {
      return Number(el) || [];
    });
    flag2 = window.BI_Filter(`FRONT_ROLE_TYPE_LIST|name:${userTypeVal}`).id;
    flag = flag2;
    const defaultCheckedList = [];
    if (key.scoreView === '有') {
      defaultCheckedList.push('scoreView');
    }
    if (key.privilegeView === '有') {
      defaultCheckedList.push('privilegeView');
    }
    if (key.endView === '有') {
      defaultCheckedList.push('endView');
    }
    if (key.incomeKpiView === '有') {
      defaultCheckedList.push('incomeKpiView');
    }
    this.setState({
      clickFlag: 2,
      userType: flag2,
      shownameid: arr,
      visible: true,
      privilege: key.privilege === '无' ? 0 : 1,
      positionId: key.id,
      currentstate: key.currentstate,
      roleId: key.roleId,
      defaultCheckedList,
    });
  };
  // 创建岗位函数
  onCreate = () => {
    this.setState({
      clickFlag: 1,
      visible: true,
    });
  };

  // 删除用户
  onDelete = val => {
    const deletePositionParams = { id: !val.id ? undefined : val.id };
    const getUserlistParams = { mail: this.state.mail };
    this.props.dispatch({
      type: 'user/deletePosition',
      payload: { deletePositionParams, getUserlistParams },
    });
  };

  setDialogSHow(bol) {
    flag1 = 'class';
    flag2 = 'class';
    this.setState({ visible: bol });
  }

  getData = (values, arrValue) => {
    const rUserType = values.userType;
    const len = !values.responseCom ? null : values.responseCom.length;
    let typeId = !len ? undefined : values.responseCom[len - 1];
    if (
      typeof typeId === 'string' ||
      rUserType === 'admin' ||
      rUserType === 'boss' ||
      rUserType === 'others'
    ) {
      typeId = undefined;
    }

    const { view = [] } = values;
    const bol = true;
    let scoreView = false;
    let privilegeView = false;
    let endView = false;
    let incomeKpiView = false;
    view.map(item => {
      if (item === 'scoreView') {
        scoreView = bol;
      } else if (item === 'privilegeView') {
        privilegeView = bol;
      } else if (item === 'endView') {
        endView = bol;
      } else if (item === 'incomeKpiView') {
        incomeKpiView = bol;
      }
      return 0;
    });
    const getUserlistParams = { mail: this.state.mail };
    if (this.state.clickFlag === 1) {
      const addPositionParams = {
        name: !arrValue.name ? undefined : arrValue.name,
        mail: !arrValue.mail ? undefined : arrValue.mail,
        mobile: !arrValue.mobile ? undefined : arrValue.mobile,
        joinDate: !arrValue.joindate ? undefined : arrValue.joindate,
        idCard: !arrValue.idcard ? undefined : arrValue.idcard,
        sex: !arrValue.sex ? undefined : arrValue.sex,
        roleId: Number(values.roleId),
        scoreView,
        privilegeView,
        endView,
        incomeKpiView,
        positionList: {
          privilege: rUserType === 'admin' ? false : values.privilege === 1,
          userType: rUserType,
          userTypeId: typeId,
          wechatDepartmentId: Number(arrValue.wechatdepartmentid),
          wechatDepartmentName: !arrValue.wechatdepartmentname
            ? undefined
            : arrValue.wechatdepartmentname,
        },
      };
      this.props.dispatch({
        type: 'user/addPosition',
        payload: { addPositionParams, getUserlistParams },
      });
    } else {
      const updateUserPositionInfoParams = {
        id: !this.state.positionId ? undefined : this.state.positionId,
        privilege: rUserType === 'admin' ? false : values.privilege === 1,
        roleId: Number(values.roleId),
        scoreView,
        privilegeView,
        endView,
        incomeKpiView,
        userType: rUserType,
        userTypeId: typeId,
        wechatDepartmentId: Number(arrValue.wechatdepartmentid),
        wechatDepartmentName: !arrValue.wechatdepartmentname
          ? undefined
          : arrValue.wechatdepartmentname,
      };
      this.props.dispatch({
        type: 'user/updateUserPositionInfo',
        payload: { updateUserPositionInfoParams, getUserlistParams },
      });
    }
    this.setDialogSHow(false);
  };

  responseComListFun = val => {
    const responseValue = [];
    const userVal = this.props.user;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    const newResponseComList = listOrgValues;
    const userType = !val ? 'class' : window.BI_Filter(`FRONT_ROLE_TYPE_LIST|name:${val}`).id;
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
    const roleType = value;
    if (this.state.clickFlag === 1) {
      flag1 = roleType;
    } else {
      flag2 = roleType;
    }
    flag = roleType;
    const responseValue = [];
    const userVal = this.props.user;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    const newResponseComList = listOrgValues;
    propsVal.form.setFieldsValue({
      privilege: 0,
      responseCom: [],
    });
    if (window.BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${flag}`).level === '0') {
      propsVal.form.setFieldsValue({
        responseCom: [],
      });
    }
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
    } else if (window.BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${flag}`).level === '1') {
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

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        privilege: item.privilege ? '有' : '无',
        scoreView: item.scoreView ? '有' : '无',
        privilegeView: item.privilegeView ? '有' : '无',
        endView: item.endView ? '有' : '无',
        incomeKpiView: item.incomeKpiView ? '有' : '无',
        userType: window.BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${item.usertype}`).name,
        showName: !item.showname
          ? item.usertype === 'others' ? '无绩效岗位' : null
          : item.showname.replace(/,/g, ' | '),
        shownameid: !item.shownameid ? null : item.shownameid,
        id: item.positionid,
        currentstate: item.currentstate,
        roleName: item.roleName,
        roleId: item.roleId,
      })
    );
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
        title: '前端角色',
        dataIndex: 'userType',
      },
      {
        title: '组织',
        dataIndex: 'showName',
      },
      {
        title: '后端角色',
        dataIndex: 'roleName',
      },
      {
        title: '学分访问',
        dataIndex: 'scoreView',
      },
      {
        title: '学分绩效访问',
        dataIndex: 'privilegeView',
      },
      {
        title: '后台访问',
        dataIndex: 'endView',
      },
      {
        title: '创收绩效访问',
        dataIndex: 'incomeKpiView',
      },
      {
        title: '绩效权限',
        dataIndex: 'privilege',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/user/editUser">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑
                </span>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns || [];
  };
  // 模态框回显
  editName = e => {
    const userVal = this.props.user;
    const aaa = !userVal.getUserlistData ? null : userVal.getUserlistData;
    const arrValue = !aaa
      ? null
      : !aaa.data ? null : !aaa.data.generalAttribute ? null : aaa.data.generalAttribute;
    this.handleSearch(e, arrValue);
  };

  handleSearch = (e, arrValue) => {
    e.preventDefault();
    propsVal.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.getData(values, arrValue);
      }
    });
  };
  roleNameList = (val = []) => {
    const list = !val ? [] : val;
    return (
      <Select style={{ width: 280 }}>
        {list.map(item => (
          <Option value={item.id} key={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    );
  };

  render() {
    const columns = this.columnsData();
    const userVal = this.props.user;
    const { addPosi, roleOrg } = this.props;
    const disabled = true;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;

    const { dateArea = [] } = userVal.getUserRoleList;
    const roleNameList = this.roleNameList(dateArea);

    responseComListBackup = !listOrgValues ? [] : this.fullListFun(listOrgValues);
    responseComList =
      !responseComList || responseComList.length === 0 ? responseComListBackup : responseComList;
    const { visible, currentstate } = this.state;
    const formLayout = 'inline';
    const aaa = !userVal.getUserlistData ? null : userVal.getUserlistData;
    const arrValue = !aaa
      ? null
      : !aaa.data ? null : !aaa.data.generalAttribute ? null : aaa.data.generalAttribute;
    const tableList = !aaa
      ? null
      : !aaa.data ? null : !aaa.data.postionAttribute ? null : aaa.data.postionAttribute;
    const dataSource = !tableList ? [] : this.fillDataSource(tableList);
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      const roleType = window.BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${this.state.userType}`)
        .isPerformance;
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*前端角色:">
                  {getFieldDecorator('userType', {
                    initialValue: this.state.clickFlag === 1 ? null : this.state.userType,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (!value) {
                            callback({ message: '请选择前端角色！' });
                          }
                          callback();
                        },
                      },
                    ],
                  })(
                    <Select
                      style={{ width: 280 }}
                      onChange={this.handleSelectChange}
                      disabled={
                        this.state.clickFlag === 1
                          ? false
                          : this.state.privilege === 1 ? disabled : false
                      }
                    >
                      {BI_Filter('FRONT_ROLE_TYPE_LIST').map(v => (
                        <Option value={v.id} key={v.id}>
                          {v.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*组&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;织">
                  {getFieldDecorator('responseCom', {
                    initialValue: this.state.clickFlag === 1 ? [] : this.state.shownameid,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (typeof value[0] === 'string' || !value[0]) {
                            if (
                              window.BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${flag}`).level === '0' ||
                              currentstate === 2
                            ) {
                              callback();
                            } else {
                              callback({ message: '请选择组织！' });
                            }
                          } else {
                            callback();
                          }
                        },
                      },
                    ],
                  })(
                    <Cascader
                      options={responseComList}
                      style={{ width: 280 }}
                      disabled={
                        this.state.clickFlag === 1
                          ? window.BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${flag1}`).level === '0'
                            ? disabled
                            : false
                          : window.BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${flag2}`).level === '0' ||
                            this.state.privilege === 1
                            ? disabled
                            : false
                      }
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*绩效权限">
                  {getFieldDecorator('privilege', {
                    initialValue: this.state.clickFlag === 1 ? 0 : this.state.privilege,
                    rules: [],
                  })(
                    <RadioGroup
                      style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}
                    >
                      <Radio
                        name="privilege"
                        value={1}
                        disabled={
                          this.state.clickFlag === 1
                            ? flag1 === 'admin' ? disabled : false
                            : flag2 === 'admin'
                              ? disabled
                              : this.state.privilege === 1
                                ? roleType === 0 || this.state.currentstate === 2 ? false : disabled
                                : false
                        }
                      >
                        是
                      </Radio>
                      <Radio
                        name="privilege"
                        value={0}
                        disabled={
                          this.state.clickFlag === 1
                            ? false
                            : this.state.privilege === 1
                              ? roleType === 0 || this.state.currentstate === 2 ? false : disabled
                              : false
                        }
                      >
                        否
                      </Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*后端角色">
                  {getFieldDecorator('roleId', {
                    initialValue: this.state.clickFlag === 1 ? null : this.state.roleId,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (!value) {
                            callback({ message: '请选择后端角色！' });
                          }
                          callback();
                        },
                      },
                    ],
                  })(roleNameList)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="&nbsp;&nbsp;访问权限">
                  {getFieldDecorator('view', {
                    initialValue: this.state.clickFlag === 1 ? [] : this.state.defaultCheckedList,
                    rules: [],
                  })(
                    <CheckboxGroup
                      style={{ color: 'rgba(0, 0, 0, 0.85)', width: '320px', textAlign: 'left' }}
                      options={this.state.plainOptions}
                      className={common.checkboxGroup}
                    />
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
          <Col span={4} offset={1}>
            姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:
          </Col>
          <Col style={{ textAlign: 'left', fontSize: '14px' }} offset={0}>
            {!arrValue ? '' : !arrValue.name ? '' : arrValue.name}
          </Col>
        </Row>
        <Row style={{ marginBottom: '14px' }}>
          <Col span={4} offset={1}>
            性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:
          </Col>
          <Col offset={1} style={{ textAlign: 'left', fontSize: '14px' }}>
            {!arrValue ? '' : !arrValue.sex ? '' : arrValue.sex === 1 ? '男' : '女'}
          </Col>
        </Row>
        <Row style={{ marginBottom: '14px' }}>
          <Col span={4} offset={1}>
            手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机:
          </Col>
          <Col style={{ textAlign: 'left', fontSize: '14px' }} offset={1}>
            {!arrValue ? '' : !arrValue.mobile ? '' : arrValue.mobile}
          </Col>
        </Row>
        <Row>
          <Col span={4} offset={1} style={{ padding: '3px' }}>
            邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱:
          </Col>
          <Col style={{ textAlign: 'left', fontSize: '14px' }} offset={1}>
            {!this.state.mail ? '' : this.state.mail}@sunland.com
          </Col>
        </Row>
        <WrappedAdvancedSearchForm />
      </div>
    );

    return (
      <div
        className={common.wrapContent}
        style={{ background: '#fff', marginLeft: 10, padding: 10 }}
      >
        <Button
          style={{ marginTop: '36px', width: '110px' }}
          type="primary"
          className={common.submitButton}
          onClick={() => this.onCreate()}
          loading={addPosi || roleOrg}
        >
          添加岗位
        </Button>
        <Table
          style={{ marginTop: '24px' }}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          className={common.tableContentStyle}
        />
        <ModalDialog
          style={{ width: '620px' }}
          title={this.state.clickFlag === 1 ? '添加岗位' : '编辑岗位'}
          visible={visible}
          modalContent={modalContent}
          clickOK={e => this.editName(e)}
          footButton={['取消', '提交']}
          showModal={bol => {
            this.setDialogSHow(bol);
          }}
        />
      </div>
    );
  }
}

export default EditUserTable;
