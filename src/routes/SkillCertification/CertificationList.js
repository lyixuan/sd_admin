import React, { Component } from 'react';
import { connect } from 'dva';
import moment from "moment/moment";
import { assignUrlParams } from 'utils/utils';
import { Table, Button, Form, Row, Col, Select, message } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
import styles from './certification.css';
import deleteTost from '../../assets/deleteTost.svg';
import circle from '../../assets/circle.svg';


const FormItem = Form.Item;
const { Option } = Select;
let propsVal = '';
const dateFormat = 'YYYY-MM-DD h:mm:ss  ';

@connect(({ certification, loading }) => ({
  certification,
  loading: loading.effects['certification/certificationList'],
}))
class CertificationList extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    const initParams = {
      params: {
        status: undefined, // 报名通道状态
        assessCyc: undefined, // 考核周期
        pageNum: 0, // 翻页---当前页码
        pageSize: 30, // 每页显示数据
      },
      selectedRows: [], // 选中的行
      clickFlag: 1, // 1批量开发，2批量关闭
      visible: false, // 控制批量弹框显隐
      deleteVisible: false, // 控制删除弹框显隐
      deleteRow: {}, // 初始化删除内容
    };
    this.state = assignUrlParams(initParams, params);
  }

  // 页面render之前需要请求的接口
  componentDidMount() {
    this.getData();
  }

  // 删除
  onDelete = (val = {}) => {
    this.setState({ deleteVisible: true, deleteRow: val });
  };

  // 编辑
  onEdit = val => {
    this.props.setRouteUrlParams('/skillCertification/certificationEdit', {
      assessCyc: val.assessCyc,
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

  setDialogSHow(type, bol) {
    if (type === 1) {
      this.setState({ visible: bol });
    } else {
      this.setState({ deleteVisible: bol });
    }
  }

  getData = params => {
    const stateParams = this.state.params;
    const certificationListParams = { ...stateParams, ...params };
    this.props.dispatch({
      type: 'certification/certificationList',
      payload: { certificationListParams },
    });
    this.saveParams(certificationListParams);
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
  selfApply = (modelType = 1, dataList = {}) => {
    const {id=null}=dataList
    const certificationModifyParams = { ids: [{ id}] ,type:modelType};
    const certificationListParams = this.state.params;
    this.props.dispatch({
      type: 'certification/certificationModify',
      payload: { certificationModifyParams, certificationListParams },
    });
  };
  // 批量开放/关闭报名   1是批量开放，2是批量关闭
  allApply = (modelType = 1) => {
    const { selectedRows = [] } = this.state;
    if (selectedRows.length > 0) {
      this.setState({ clickFlag: modelType, visible: true });
    } else {
      message.error('未选中任何一项');
    }
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
    const params = {
      status: undefined,
      assessCyc: undefined,
      pageNum: 0,
      pageSize: 30,
    };
    this.getData(params);
  };

  // 批量模态框回显
  allModel = (val,modelType=1) => {
    const data = [];
    val.map(item => data.push({ id: Number(item.id)}));
    const certificationModifyParams = { ids: data ,type:modelType};
    const certificationListParams = this.state.params;
    this.props.dispatch({
      type: 'certification/certificationModify',
      payload: { certificationModifyParams, certificationListParams },
    });
    this.setDialogSHow(1, false);

  };
  // 删除模态框回显
  deleteModel = (val) => {
    const certificationDeleteParams = { id: val.id };
    const certificationListParams = this.state.params;
    this.props.dispatch({
      type: 'certification/certificationDelete',
      payload: { certificationDeleteParams, certificationListParams },
    });
    this.setDialogSHow(2,false);
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        const {assessCyc=null,status=null} = values
        const certificationListParams = {
          assessCyc:assessCyc?Number(assessCyc):undefined,
          status:status?Number(status):undefined,
          pageSize: 30,
          pageNum: 0,
        };
        this.getData(certificationListParams);
      }
    });
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map(item =>
      data.push({
        key: item.id,
        id: item.id,
        code: item.code,
        name: item.name,
        assessCyc: window.BI_Filter(`Certification_TIMEAREA|id:${item.assessCyc}`).name,
        status: window.BI_Filter(`Certification_TYPE|id:${item.status}`).name,
        modifyTime: moment.unix(item.modifyTime / 1000).format(dateFormat),
      })
    );
    return data;
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
        dataIndex: 'assessCyc',
      },
      {
        title: '报名通道状态',
        dataIndex: 'status',
        render: (text, record) => {
          return (
            <span className={record.status !== '已开放' ? common.openType : null}>
              {record.status}
            </span>
          );
        },
      },
      {
        title: '报名变更时间',
        dataIndex: 'modifyTime',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const operationType = Number(
            window.BI_Filter(`Certification_TYPE|name:${record.status}`).id
          );
          return (
            <div>
              {operationType !== 1 ? null : (
                <AuthorizedButton authority="/skillCertification/certificationClose">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.selfApply(2, record)}
                  >
                    关闭报名
                  </span>
                </AuthorizedButton>
              )}
              {operationType !== 2 ? null : (
                <AuthorizedButton authority="/skillCertification/certificationOpen">
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
                <AuthorizedButton authority="/skillCertification/certificationDelete">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.onDelete(record)}
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
    const {
      selectedRows = [],
      visible = false,
      deleteVisible = false,
      clickFlag = 1,
      deleteRow = {},
    } = this.state;
    const { pageNum = 0, assessCyc = 0, status = 0 } = this.state.params;
    const { certificationListData = {} } = this.props.certification.certificationList;
    const { totalElements = 0, content = [] } = certificationListData;
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
                  {getFieldDecorator('status', {
                    initialValue: window.BI_Filter(`Certification_TYPE|id:${status}`).name,
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
                  {getFieldDecorator('assessCyc', {
                    initialValue: window.BI_Filter(`Certification_TIMEAREA|id:${assessCyc}`).name,
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
      onChange: (selectedRowKeys, rowList) => {
        this.onSelectChange(selectedRowKeys, rowList);
      },
      getCheckboxProps: record => ({
        disabled: record.status === '已停用' || record.status === '已删除',
      }),
    };

    const modalContent = (
      <>
        <span className={styles.allWordTost}>
          {clickFlag === 1 ? '开放' : '关闭'}如下报名通道吗？
        </span>
        <ul className={styles.m_ulStyle}>
          {selectedRows.map(item => {
            return (
              <li className={styles.u_liStyle} key={item.id}>
                <img src={circle} className={styles.u_circleImg} alt="圆点" />
                {item.name}
              </li>
            );
          })}
        </ul>
      </>
    );

    const modalContentDelete = (
      <>
        <img src={deleteTost} alt="delete" className={styles.imgStyle} />
        <br />
        <span className={styles.deletWord}>一经删除历史数据将全部清空！确定要删除吗？</span>
      </>
    );
    return (
      <>
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={<WrappedAdvancedSearchForm />}
          contentButton={
            <>
              <AuthorizedButton authority="/skillCertification/certificationOpen">
                <Button
                  onClick={() => this.allApply(1)}
                  type="primary"
                  className={common.addQualityButton}
                  style={{ width: '140px' }}
                >
                  批量开放报名
                </Button>
              </AuthorizedButton>
              <AuthorizedButton authority="/skillCertification/certificationClose">
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
          title={clickFlag === 1 ? '批量开放通道' : '批量关闭通道'}
          visible={this.stringToBoolean(visible)}
          modalContent={modalContent}
          clickOK={() => this.allModel(selectedRows,clickFlag)}
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
          clickOK={() => this.deleteModel(deleteRow)}
          footButton={['取消', '提交']}
          showModal={bol => {
            this.setDialogSHow(2, bol);
          }}
        />
      </>
    );
  }
}

export default CertificationList;
