import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Row, Col, message } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import ModalDialog from '../../selfComponent/Modal/Modal';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

@connect(({ complaintDoubles, loading }) => ({
  complaintDoubles,
  loading: loading.models.complaintDoubles,
}))
class ComplaintDoublesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      collegeName: '',
      multiplePoints: 0,
      id: 0,
      effectiveDate: '',
      collegeId: 0,
      // flag:true,
    };
  }

  componentDidMount() {
    const complaintDoublesListParams = { size: 30, number: 0 };
    this.props.dispatch({
      type: 'complaintDoubles/complaintDoublesList',
      payload: { complaintDoublesListParams },
    });
  }

  // 编辑账号函数
  onEdit = key => {
    this.setState({
      collegeName: key.collegeName,
      multiplePoints: key.multiplePoints,
      id: key.id,
      effectiveDate: key.effectiveDate,
      collegeId: key.collegeId,
    });
    this.setDialogSHow(true);
  };

  setDialogSHow(bol) {
    this.setState({
      visible: bol,
    });
  }

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        id: item.id,
        collegeName: item.collegeName,
        multiplePoints: item.multiplePoints,
        collegeId: item.collegeId,
        effectiveDate: item.effectiveDate,
      })
    );
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '学院id',
        dataIndex: 'collegeId',
      },
      {
        title: '学院名称',
        dataIndex: 'collegeName',
      },
      {
        title: '生效月份',
        dataIndex: 'effectiveDate',
      },
      {
        title: '投诉扣分倍数',
        dataIndex: 'multiplePoints',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/complaintDoubles/editecomplaintDoubles">
                <span style={{ color: '#52C9C2' }} onClick={() => this.onEdit(record)}>
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

  // input双向绑定
  handelChange(e) {
    const points = e.target.value;
    this.setState({
      multiplePoints: points,
    });
  }
  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        collegeName: item.collegeName,
        multiplePoints: item.multiplePoints,
        id: item.id,
        effectiveDate: item.effectiveDate,
        collegeId: item.collegeId,
      })
    );
    return data;
  };

  // 模态框回显
  editName = () => {
    if (!this.state.multiplePoints) {
      message.error('投诉扣分倍数不可为空');
      this.setDialogSHow(true);
    } else if (!/(^[1-9]\d*$)/.test(this.state.multiplePoints)) {
      message.error('投诉扣分倍数需要为正整数');
      this.setDialogSHow(true);
    } else {
      const upateComplaintDoublesParams = {
        collegeName: this.state.collegeName,
        multiplePoints: Number(this.state.multiplePoints),
        id: this.state.id,
        effectiveDate: this.state.effectiveDate,
        collegeId: this.state.collegeId,
      };
      this.props.dispatch({
        type: 'complaintDoubles/upateComplaintDoubles',
        payload: { upateComplaintDoublesParams },
      });
      this.setDialogSHow(false);
    }
  };

  render() {
    const { loading } = this.props;
    const data = !this.props.complaintDoubles.complaintDoublesList.response
      ? []
      : !this.props.complaintDoubles.complaintDoublesList.response.data
        ? []
        : this.props.complaintDoubles.complaintDoublesList.response.data;
    const totalNum = !data ? 0 : data.length;
    const dataSource = !data ? [] : this.fillDataSource(data);
    const columns = this.columnsData();
    const { visible, collegeName, multiplePoints, collegeId, effectiveDate } = this.state;
    const modalContent = (
      <div>
        <Row>
          <Col span={3} offset={9}>
            学院id:
          </Col>
          <Col style={{ textAlign: 'left' }} offset={0}>
            {collegeId}
          </Col>
        </Row>
        <Row>
          <Col span={4} offset={8}>
            学院名称:
          </Col>
          <Col offset={1} style={{ textAlign: 'left' }}>
            {collegeName}
          </Col>
        </Row>
        <Row>
          <Col span={4} offset={8}>
            生效月份:
          </Col>
          <Col style={{ textAlign: 'left' }} offset={1}>
            {effectiveDate}
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={6}>
            *投诉扣分倍数:
          </Col>
          <Col span={4} offset={0}>
            <Input
              onChange={e => {
                this.handelChange(e);
              }}
              value={multiplePoints}
              defaultValue={1}
            />
          </Col>
        </Row>
      </div>
    );
    return (
      <div>
        <ContentLayout
          pageHeraderUnvisible="unvisible"
          title="投诉翻倍"
          contentTable={
            <div>
              <p className={common.totalNum}>总数：{totalNum}条</p>
              <Table
                bordered
                loading={loading}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                className={common.tableContentStyle}
              />
            </div>
          }
        />

        <ModalDialog
          title="编辑投诉翻倍"
          visible={visible}
          modalContent={modalContent}
          clickOK={() => this.editName()}
          footButton={['取消', '提交']}
          showModal={bol => {
            this.setDialogSHow(bol);
          }}
        />
      </div>
    );
  }
}
export default ComplaintDoublesList;
