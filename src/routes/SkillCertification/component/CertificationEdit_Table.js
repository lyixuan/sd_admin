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
    };
  }

  // 编辑
  onEdit = key => {
    console.log(key);
    this.setState({ visible: true, clickFlag: 2 });
  };
  // 创建
  onCreate = () => {
    this.setState({ visible: true, clickFlag: 1 });
  };

  // 删除
  onDelete = val => {
    console.log(val);
  };

  setDialogSHow(bol) {
    this.setState({ visible: bol });
  }

  getData = (values, arrValue) => {
    console.log(values, arrValue);
  };

  // 初始化tabale 列数据
  fillDataSource = () => {
    const data = [
      {
        key: 1,
        id: 1,
        childType: '负责专业项目',
        college: '自变量学院',
        childName: '法律（专+本）',
      },
      {
        key: 2,
        id: 1,
        childType: '负责专业项目',
        college: '自变量学院',
        childName: '全国工商企业管理（专+本）',
      },
    ];
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
        dataIndex: 'childType',
      },
      {
        title: '学院',
        dataIndex: 'college',
      },
      {
        title: '子项名称',
        dataIndex: 'childName',
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
    console.log(e);
  };

  handleSearch = (e, arrValue) => {
    e.preventDefault();
    propsVal.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.getData(values, arrValue);
      }
    });
  };

  render() {
    const columns = this.columnsData();

    const { visible } = this.state;
    const formLayout = 'inline';

    const dataSource = this.fillDataSource();
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
                    initialValue: null,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (!value) {
                            callback({ message: '请选择子项分类！' });
                          }
                          callback();
                        },
                      },
                    ],
                  })(
                    <Select style={{ width: 280 }}>
                      <Option value={1}>月度</Option>
                      <Option value={2}>季度</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*子项名称:">
                  {getFieldDecorator('userType', {
                    initialValue: null,
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
                  {getFieldDecorator('userType', {
                    initialValue: null,
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
                      <Option value={1}>胡萝学院</Option>
                      <Option value={2}>自变量学院</Option>
                      <Option value={3}>拍学院</Option>
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
        >
          添加子项
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
