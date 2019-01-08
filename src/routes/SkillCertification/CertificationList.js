import React, { Component } from 'react';
import { connect } from 'dva';
import { assignUrlParams } from 'utils/utils';
import { Table, Button, Form, Row, Col, Select } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
import styles from './certification.css';
import deleteTost from '../../assets/deleteTost.svg';

const FormItem = Form.Item;
const { Option } = Select;
let propsVal = '';

@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/userList'],
}))
class CertificationList extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    const initParams = {
      params: {
        type: 0, // 报名通道状态
        examinationCycle: 0, // 考核周期
        pageNum: 0, // 翻页---当前页码
        pageSize: 30, // 每页显示数据
      },
      selectedRows: [], // 选中的行
      clickFlag: 1, // 1批量开发，2批量关闭，3删除
      visible: false, // 控制弹框显隐
    };
    this.state = assignUrlParams(initParams, params);
  }

  // 页面render之前需要请求的接口
  componentDidMount() {
    this.getData();
  }

  // 删除
  onDelete = (modelType = 3, val = {}) => {
    console.log(val);
    this.setState({ clickFlag: modelType, visible: true });
  };

  // 编辑
  onEdit = val => {
    console.log(val.timeArea);
    this.props.setRouteUrlParams('/skillCertification/certificationEdit', {
      timeArea: val.timeArea,
      id: val.id,
      code: val.code,
      name: val.name,
    });
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, size) => {
    this.changePage(current, size);
  };

  onSelectChange = (key, arrayList) => {
    this.setState({ selectedRows: arrayList });
  };

  setDialogSHow(bol) {
    this.setState({ visible: bol });
  }

  getData = params => {
    const stateParams = this.state.params;
    const listParams = { ...stateParams, ...params };
    // this.props.dispatch({
    //   type: 'user/userList',
    //   payload: { userListParams },
    // });
    this.saveParams(listParams);
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

  // 单条数据开放/关闭报名   1是开放报名，2是关闭报名
  selfApply = (modelType = 1, dataList = []) => {
    if (modelType === 1) {
      console.log('开放报名', dataList);
    } else {
      console.log('关闭报名', dataList);
    }
  };
  // 批量开放/关闭报名   1是批量开放，2是批量关闭
  allApply = (modelType = 1) => {
    const { selectedRows = [] } = this.state;
    if (modelType === 1) {
      console.log('批量开放报名', selectedRows.length > 0 ? selectedRows : '未选中任何一项');
    } else {
      console.log('批量关闭报名', selectedRows.length > 0 ? selectedRows : '未选中任何一项');
    }
    this.setState({ clickFlag: modelType, visible: true });
  };

  saveParams = params => {
    this.setState({ params });
    this.props.setCurrentUrlParams(params);
  };

  // 点击某一页函数
  changePage = (current, size) => {
    const params = {
      pageNum: current > 1 ? current - 1 : 0,
      pageSize: size,
    };
    this.getData(params);
  };

  // 表单重置
  handleReset = () => {
    propsVal.form.resetFields();
  };

  // 模态框回显
  editName = e => {
    this.setDialogSHow(false);
    console.log(e);
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        console.log(1111, values);
      }
    });
  };

  // 初始化tabale 列数据
  fillDataSource = () => {
    const timeArea1 = window.BI_Filter(`Certification_TIMEAREA|id:${1}`).name;
    const timeArea2 = window.BI_Filter(`Certification_TIMEAREA|id:${2}`).name;
    const data = [
      {
        key: 1,
        id: 1,
        code: 'RZ0001',
        name: 'IM认证',
        timeArea: timeArea1,
        type: window.BI_Filter(`Certification_TYPE|id:${1}`).name,
        changeTime: '2018-11-28 09:32:32',
      },
      {
        key: 2,
        id: 2,
        code: 'RZ0001',
        name: '专业知识认证',
        timeArea: timeArea2,
        type: window.BI_Filter(`Certification_TYPE|id:${1}`).name,
        changeTime: '2018-11-28 09:32:32',
      },
      {
        key: 3,
        id: 3,
        code: 'RZ0001',
        name: '专业知识认证',
        timeArea: timeArea1,
        type: window.BI_Filter(`Certification_TYPE|id:${2}`).name,
        changeTime: '2018-11-28 09:32:32',
      },
      {
        key: 4,
        id: 4,
        code: 'RZ0001',
        name: '学习规划认证',
        timeArea: timeArea2,
        type: window.BI_Filter(`Certification_TYPE|id:${2}`).name,
        changeTime: '2018-11-28 09:32:32',
      },
      {
        key: 5,
        id: 5,
        code: 'RZ0001',
        name: '学习规划认证',
        timeArea: timeArea1,
        type: window.BI_Filter(`Certification_TYPE|id:${3}`).name,
        changeTime: '2018-11-28 09:32:32',
      },
      {
        key: 6,
        id: 6,
        code: 'RZ0001',
        name: '报考指导认证',
        timeArea: timeArea2,
        type: window.BI_Filter(`Certification_TYPE|id:${3}`).name,
        changeTime: '2018-11-28 09:32:32',
      },
      {
        key: 7,
        id: 7,
        code: 'RZ0001',
        name: '报考指导认证',
        timeArea: timeArea1,
        type: window.BI_Filter(`Certification_TYPE|id:${3}`).name,
        changeTime: '2018-11-28 09:32:32',
      },
      {
        key: 8,
        id: 8,
        code: 'RZ0001',
        name: '好学生推荐认证',
        timeArea: timeArea2,
        type: window.BI_Filter(`Certification_TYPE|id:${4}`).name,
        changeTime: '2018-11-28 09:32:32',
      },
    ];
    return data;
  };

  // 获取table列表头
  headerColu = () => {
    const columns = [
      {
        title: '名称1',
        dataIndex: 'name1',
      },
      {
        title: '名称2',
        dataIndex: 'name2',
      },
      {
        title: '名称3',
        dataIndex: 'name3',
      },
    ];
    return columns || [];
  };
  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '认证编码',
        dataIndex: 'code',
      },
      {
        title: '认证项目',
        dataIndex: 'name',
      },
      {
        title: '考核周期',
        dataIndex: 'timeArea',
      },
      {
        title: '报名通道状态',
        dataIndex: 'type',
        render: (text, record) => {
          return (
            <span className={record.type !== '已开放' ? common.openType : null}>{record.type}</span>
          );
        },
      },
      {
        title: '报名变更时间',
        dataIndex: 'changeTime',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const operationType = Number(
            window.BI_Filter(`Certification_TYPE|name:${record.type}`).id
          );
          return (
            <div>
              {operationType !== 1 ? null : (
                <AuthorizedButton authority="/skillCertification/certificationEdit">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.selfApply(2, record)}
                  >
                    关闭报名
                  </span>
                </AuthorizedButton>
              )}
              {operationType !== 2 ? null : (
                <AuthorizedButton authority="/skillCertification/certificationEdit">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.selfApply(1, record)}
                  >
                    开放报名
                  </span>
                </AuthorizedButton>
              )}
              {operationType === 1 || operationType === 4 ? null : (
                <AuthorizedButton authority="/skillCertification/certificationEdit">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.onEdit(record)}
                  >
                    编辑
                  </span>
                </AuthorizedButton>
              )}
              {operationType === 1 || operationType === 4 ? null : (
                <AuthorizedButton authority="/skillCertification/certificationEdit">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.onDelete(3, record)}
                  >
                    删除
                  </span>
                </AuthorizedButton>
              )}
            </div>
          );
        },
      },
    ];
    return columns || [];
  };

  // 创建认证项目
  handleAdd = () => {
    this.props.setRouteUrlParams('/skillCertification/certificationCreate');
  };

  render() {
    const { loading } = this.props;
    const { selectedRows = [], visible = false, clickFlag = 1 } = this.state;
    const { pageNum = 0, examinationCycle = 0, type = 0 } = this.state.params;
    const { userListData = {} } = {};
    const { totalElements = 0, content = [] } = userListData;
    const dataSource = this.fillDataSource(content);
    const columns = this.columnsData();
    const formLayout = 'inline';
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <div style={{ marginBottom: '10px' }}>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="报名通道状态">
                  {getFieldDecorator('type', {
                    initialValue: window.BI_Filter(`Certification_TYPE|id:${type}`).name,
                  })(
                    <Select placeholder="全部" style={{ width: 230, height: 32 }}>
                      {window.BI_Filter(`Certification_TYPE`).map(item => (
                        <Option value={Number(item.id)} key={Number(item.id)}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <FormItem label="考核周期">
                  {getFieldDecorator('timeArea', {
                    initialValue: window.BI_Filter(`Certification_TIMEAREA|id:${examinationCycle}`)
                      .name,
                  })(
                    <Select placeholder="全部" style={{ width: 230, height: 32 }}>
                      {window.BI_Filter(`Certification_TIMEAREA`).map(item => (
                        <Option value={Number(item.id)} key={Number(item.id)}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <FormItem>
                  <div>
                    <Button htmlType="submit" type="primary" className={common.searchButton}>
                      搜 索
                    </Button>
                    <Button
                      onClick={this.handleReset}
                      type="primary"
                      className={common.resetButton}
                    >
                      重 置
                    </Button>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      );
    });
    const rowSelection = {
      selectedRows,
      onChange: this.onSelectChange,
    };

    const headerColu = this.headerColu();
    const columnData = [
      {
        key: 1,
        name1: 'IM认证',
        name2: '好学生推荐认证',
        name3: '学习规划认证',
      },
      {
        key: 2,
        name1: '报考指导',
      },
    ];
    const modalContent = (
      <>
        {clickFlag === 3 ? (
          <>
            <img src={deleteTost} alt='delete' className={styles.imgStyle} />
            <br />
            <span className={styles.deletWord}>一经删除历史数据将全部清空！确定要删除吗？</span>
          </>
        ) : (
          <>
            <span>{clickFlag === 1 ? '开放' : '关闭'}如下报名通道吗？</span>
            <Table
              columns={headerColu}
              showHeader={false}
              pagination={false}
              dataSource={columnData}
              bordered
            />
          </>
        )}
      </>
    );
    return (
      <>
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={<WrappedAdvancedSearchForm />}
          contentButton={
            <>
              <AuthorizedButton authority="/skillCertification/certificationEdit">
                <Button
                  onClick={() => this.allApply(1)}
                  type="primary"
                  className={common.addQualityButton}
                  style={{ width: '140px' }}
                >
                  批量开放报名
                </Button>
              </AuthorizedButton>
              <AuthorizedButton authority="/skillCertification/certificationEdit">
                <Button
                  onClick={() => this.allApply(2)}
                  type="primary"
                  className={common.deleteQualityButton}
                  style={{ width: '140px' }}
                >
                  批量关闭报名
                </Button>
              </AuthorizedButton>
              <AuthorizedButton authority="/skillCertification/certificationCreate">
                <Button
                  onClick={this.handleAdd}
                  type="primary"
                  className={common.createButton}
                  style={{ width: '140px', margin: '0 10px' }}
                >
                  创建认证项目
                </Button>
              </AuthorizedButton>
            </>
          }
          contentTable={
            <>
              <p className={common.totalNum}>
                <span className={common.totalNumLeft}>已开放:{totalElements}</span>
                <span className={common.totalNumRight}>已关闭:{totalElements}</span>
              </p>
              <Table
                bordered
                loading={loading}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                className={common.tableContentStyle}
                rowSelection={rowSelection}
              />
            </>
          }
          contentPagination={
            <SelfPagination
              onChange={(current, pageSize) => {
                this.changePage(current, pageSize);
              }}
              onShowSizeChange={(current, pageSize) => {
                this.onShowSizeChange(current, pageSize);
              }}
              defaultCurrent={pageNum + 1}
              total={totalElements}
              defaultPageSize={30}
            />
          }
        />

        <ModalDialog
          style={{ width: '520px' }}
          title={clickFlag === 1 ? '批量开放通道' : clickFlag === 2 ? '批量关闭通道' : '删除确认'}
          visible={this.stringToBoolean(visible)}
          modalContent={modalContent}
          clickOK={e => this.editName(e)}
          footButton={['取消', '提交']}
          showModal={bol => {
            this.setDialogSHow(bol);
          }}
        />
      </>
    );
  }
}

export default CertificationList;
