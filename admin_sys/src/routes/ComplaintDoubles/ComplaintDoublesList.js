import React, { Component } from 'react';
import { connect } from 'dva';
import { Table,Input,Row,Col} from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import ModalDialog from '../../selfComponent/Modal/Modal';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';
import styles from '../../selfComponent/Modal/Modal.css';

@connect(({ complaintDoubles, loading }) => ({
  complaintDoubles,
  loading,
}))
class ComplaintDoublesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      collegeName: '',
      multiplePoints: 0,
      id: 0,
      effectiveDate: '',
      collegeId:0,
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
    console.log(key);
    this.setState({
      collegeName: key.collegeName,
      multiplePoints: key.multiplePoints,
      id: key.id,
      effectiveDate: key.effectiveDate,
      collegeId:key.collegeId,
    });
    this.setDialogSHow(true);
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    console.log(pageSize, current);
  };

  setDialogSHow(bol){
    this.setState({
      visible:bol,
    })
  }

  // 点击某一页函数
  changePage = (current, pageSize) => {
    console.log(pageSize, current);
  };

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
      })
    );
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '学院id',
        dataIndex: 'id',
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
              <AuthorizedButton authority="/account/editAccount">
                <span style={{ color: '#52C9C2' }} onClick={() => this.onEdit(record)}>
                  编辑
                </span>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  // input双向绑定
  handelChange(e) {
    console.log(e.target.value)
    this.setState({
      multiplePoints: e.target.value,
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
        collegeId:item.collegeId,
      })
    );
    return data;
  };

  // 模态框回显
  editName = () => {
    console.log(this.state)
    const upateComplaintDoublesParams = {
      collegeName: this.state.collegeName,
      multiplePoints: Number(this.state.multiplePoints),
      id: this.state.id,
      effectiveDate: this.state.effectiveDate,
      collegeId:this.state.collegeId,

    };
    this.props.dispatch({
      type: 'complaintDoubles/upateComplaintDoubles',
      payload: { upateComplaintDoublesParams },
    });
  };

  render() {
    const data = !this.props.complaintDoubles.complaintDoublesList.response
      ? []
      : !this.props.complaintDoubles.complaintDoublesList.response.data
        ? []
        : this.props.complaintDoubles.complaintDoublesList.response.data;
    const totalNum = !data ? 0 : data.length;
    const dataSource = !data ? [] : this.fillDataSource(data);
    const columns = !this.columnsData() ? [] : this.columnsData();

    const { visible,collegeName,multiplePoints,id,effectiveDate,collegeId} = this.state;
    console.log(collegeId)
    const modalContent = (
      <div>
        <Row>
          <Col span={5} offset={6}>学院id:</Col>
          <Col span={2} offset={0}>{id}</Col>
        </Row>
        <Row>
          <Col span={4} offset={6}>学院名称:</Col>
          <Col span={4} offset={1}>{collegeName}</Col>
        </Row>
        <Row>
          <Col span={4} offset={6}>生效月份:</Col>
          <Col span={4} offset={1}>{effectiveDate}</Col>
        </Row>
        <Row>
          <Col span={6} offset={4}>*投诉扣分倍数:</Col>
          <Col span={6} offset={1}>
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
    return(
      <div>
        <ContentLayout
          pageHeraderUnvisible="unvisible"
          title="投诉翻倍"
          contentTable={
            <div>
              <p className={common.totalNum}>总数：{totalNum}条</p>
              <Table
                bordered
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
          showModal={(bol)=>{this.setDialogSHow(bol)}}
        />
      </div>
        )
  }
}
export default ComplaintDoublesList;
