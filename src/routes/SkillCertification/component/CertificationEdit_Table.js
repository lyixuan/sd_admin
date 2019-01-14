/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Table, Form, Button, Row, Col, Select, Input } from 'antd';
import common from '../../Common/common.css';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import ModalDialog from '../../../selfComponent/Modal/Modal';

const FormItem = Form.Item;
const { Option } = Select;
let propsVal = '';

class CertificationEdit_Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 弹窗显隐
      clickFlag: 1, // 1为创建进入，2为编辑进入
      name: null, // 子项名称初始值
      college: null, // 学院初始值
      collegeList:[], // 学院下拉选初始值
    };
  }

  // 编辑
  onEdit = key => {
    console.log(key);
    this.setState({ visible: true, clickFlag: 2, name: key.name, college: key.collegeId });
  };
  // 创建
  onCreate = () => {
    const { certification} = this.props.dataSource;
    const { collegeList = []}  = certification.findAllOrgList;
    this.setState({ visible: true, clickFlag: 1,collegeList });
  };

  // 删除
  onDelete = val => {
    this.props.subItemDelete(val);
  };

  setDialogSHow(bol) {
    this.setState({ visible: bol });
  }

  getData = values => {
    this.props.tableSubmit(values);
    this.setDialogSHow(false);
  };

  // 初始化tabale 列数据
  fillDataSource = (val) => {
    const data = [];
    const { certification} = this.props.dataSource;
    const { collegeList = []}  = certification.findAllOrgList;
    val.map((item,index) =>
      data.push({
        key: index,
        id:item.id,
        type: item.type,
        name: item.name,
        college: collegeList.find(subItem => subItem.collegeId === item.collegeId)?collegeList.find(subItem => subItem.collegeId === item.collegeId).collegeName:null,
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
        title: '子项分类',
        dataIndex: 'type',
      },
      {
        title: '学院',
        dataIndex: 'college',
      },
      {
        title: '子项名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onDelete(record)}
                >
                  删除
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
    this.handleSearch(e);
  };

  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.getData(values);
      }
    });
  };


  render() {
    const columns = this.columnsData();
    const { visible = false, clickFlag = 1, name = null, college = 1,collegeList=[] } = this.state;
    const {  collegeFlag,itemDetal,subItemFlag,certification} = this.props.dataSource;
    const { getItemByIdData = {} } = certification.getItemById;
    const {certificationSubItemList =[]} = getItemByIdData
    const disabled = true;
    const formLayout = 'inline';
    const dataSource = this.fillDataSource(certificationSubItemList);
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*子项分类:">
                  {getFieldDecorator('childType', {
                    initialValue: 1,
                  })(
                    <Select style={{ width: 280, height: 32 }} disabled={disabled}>
                      <Option value={1}>负责专业项目</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*子项名称:">
                  {getFieldDecorator('name', {
                    initialValue: clickFlag === 1 ? null : name,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (!value) {
                            callback({ message: '子项名称为必填项，请填写！' });
                          }
                          callback();
                        },
                      },
                    ],
                  })(<Input style={{ width: 280 }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院:">
                  {getFieldDecorator('collegeId', {
                    initialValue: clickFlag === 1 ? null : college,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (!value) {
                            callback({ message: '请选择学院！' });
                          }
                          callback();
                        },
                      },
                    ],
                  })(
                    <Select style={{ width: 280 }}>
                      {collegeList.map((item) => (
                        <Option value={Number(item.collegeId)} key={Number(item.cpId)} >
                          {item.collegeName}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      );
    });

    const modalContent = (
      <>
        <WrappedAdvancedSearchForm />
      </>
    );

    return (
      <div className={common.wrapContent}>
        <Button
          style={{ marginTop: '10px', width: '110px' }}
          type="primary"
          className={common.submitButton}
          onClick={() => this.onCreate()}
          loading={subItemFlag}
        >
          添加子项
        </Button>
        <Table
          style={{ marginTop: '24px' }}
          bordered
          loading={itemDetal||collegeFlag}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          className={common.tableContentStyle}
        />
        <ModalDialog
          style={{ width: '620px' }}
          title={this.state.clickFlag === 1 ? '添加子项' : '编辑子项'}
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

export default CertificationEdit_Table;
