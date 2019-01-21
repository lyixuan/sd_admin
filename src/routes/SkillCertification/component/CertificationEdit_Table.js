/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Table, Form, Button, Row, Col, Select, Input } from 'antd';
import common from '../../Common/common.css';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import ModalDialog from '../../../selfComponent/Modal/Modal';
import styles from '../certification.css';
import deleteTost from '../../../assets/deleteTost.svg';

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
      collegeId: null, // 学院初始值
      id: null, // 当编辑的时候，传入id子项目的值
      deleteId: null,
      deleteVisible: false, // 控制子项目删除弹窗的显隐
    };
  }

  // 编辑
  onEdit = key => {
    this.setState({
      visible: true,
      clickFlag: 2,
      name: key.name,
      collegeId: key.collegeId,
      id: key.id,
    });
  };
  // 创建
  onCreate = () => {
    this.setState({ visible: true, clickFlag: 1 });
  };

  // 删除
  onDelete = val => {
    this.setState({ deleteVisible: true, deleteId: val.id });
  };

  setDialogSHow(type, bol) {
    if (type === 1) {
      this.setState({ visible: bol });
    } else {
      this.setState({ deleteVisible: bol });
    }
  }

  getData = values => {
    const { clickFlag = 1, id = 1 } = this.state;
    this.props.tableSubmit(values, clickFlag, id);
    this.setDialogSHow(1, false);
  };

  stringToBoolean = str => {
    switch (str) {
      case 'true':
        return true;
      case 'false':
      case null:
        return false;
      default:
        return Boolean(str);
    }
  };

  // 删除模态框回显
  deleteModel = val => {
    this.props.subItemDelete(val);
    this.setDialogSHow(2, false);
  };

  // 初始化tabale 列数据
  fillDataSource = (val, list) => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        id: item.id,
        type: item.type,
        name: item.name,
        college: list.find(subItem => subItem.collegeId === item.collegeId)
          ? list.find(subItem => subItem.collegeId === item.collegeId).collegeName
          : null,
        collegeId: item.collegeId,
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
    const {
      visible = false,
      clickFlag = 1,
      name = null,
      collegeId = 1,
      deleteVisible,
      deleteId,
    } = this.state;
    const { collegeFlag, itemDetal, subItemFlag, certification } = this.props.dataSource;
    const { getItemById = {} } = certification;
    const { collegeList = [] } = certification.findAllOrgList;
    const { certificationSubItemList = [] } = getItemById;
    const disabled = true;
    const formLayout = 'inline';
    const dataSource = this.fillDataSource(certificationSubItemList, collegeList);
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <Row>
              <Col
                span={20}
                offset={1}
                style={{ padding: '3px', marginBottom: '8px', textAlign: 'left' }}
              >
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
              <Col
                span={20}
                offset={1}
                style={{ padding: '3px', marginBottom: '8px', textAlign: 'left' }}
              >
                <FormItem label="*子项名称:">
                  {getFieldDecorator('name', {
                    initialValue: clickFlag === 1 ? null : name,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          const reg = !value ? '' : value.replace(/\s*/g, '');
                          if (!reg) {
                            callback({ message: '子项名称为必填项，请填写!' });
                          } else if (reg.length > 15) {
                            callback({ message: '子项名称限制在15个字符之内，请修改!' });
                          } else {
                            callback();
                          }
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
                    initialValue: clickFlag === 1 ? null : collegeId,
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
                      {collegeList.map(item => (
                        <Option value={Number(item.collegeId)} key={item.collegeId}>
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

    const modalContent = <WrappedAdvancedSearchForm />;

    const modalContentDelete = (
      <>
        <img src={deleteTost} alt="delete" className={styles.imgStyle} />
        <br />
        <span className={styles.deletWord}>确定删除此子项吗？</span>
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
          loading={itemDetal || collegeFlag}
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
            this.setDialogSHow(1, bol);
          }}
        />
        <ModalDialog
          style={{ width: '520px' }}
          title="删除确认"
          visible={this.stringToBoolean(deleteVisible)}
          modalContent={modalContentDelete}
          clickOK={() => this.deleteModel(deleteId)}
          footButton={['取消', '提交']}
          showModal={bol => {
            this.setDialogSHow(2, bol);
          }}
        />
      </div>
    );
  }
}

export default CertificationEdit_Table;
