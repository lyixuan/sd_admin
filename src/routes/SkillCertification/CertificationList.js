import React, { Component } from 'react';
import { connect } from 'dva';
import { assignUrlParams } from 'utils/utils';
import { Table, Button} from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
//
// const FormItem = Form.Item;
// const { Option } = Select;
// let propsVal = '';

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
        type: 1,
        timeArea: 1,
        isUpdate: 0,
        pageNum: 0, // 翻页---当前页码
        pageSize: 30, // 每页显示数据
      },
    };
    this.state = assignUrlParams(initParams, params);

  }

  // 页面render之前需要请求的接口
  componentDidMount() {
    this.getData();
  }

  // 删除用户
  onDelete = val => {
    console.log(val)
  };

  // 编辑用户
  onEdit = val => {
    console.log(val)
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, size) => {
    this.changePage(current, size);
  };

  getData = params => {
    const stateParams = this.state.params;
    const userListParams = { ...stateParams, ...params };
    // this.props.dispatch({
    //   type: 'user/userList',
    //   payload: { userListParams },
    // });
    this.saveParams(userListParams);
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


  // 初始化tabale 列数据
  fillDataSource = () => {
    const data = [
      {key:1,id:1,code:'RZ0001',name:'IM认证',timeArea:'月度',type:1,changeTime:'2018-11-28 09:32:32'},
      {key:2,id:2,code:'RZ0001',name:'专业知识认证',timeArea:'季度',type:1,changeTime:'2018-11-28 09:32:32'},
      {key:3,id:3,code:'RZ0001',name:'专业知识认证',timeArea:'季度',type:2,changeTime:'2018-11-28 09:32:32'},
      {key:4,id:4,code:'RZ0001',name:'学习规划认证',timeArea:'月度',type:2,changeTime:'2018-11-28 09:32:32'},
      {key:5,id:5,code:'RZ0001',name:'学习规划认证',timeArea:'月度',type:2,changeTime:'2018-11-28 09:32:32'},
      {key:6,id:6,code:'RZ0001',name:'报考指导认证',timeArea:'季度',type:3,changeTime:'2018-11-28 09:32:32'},
      {key:7,id:7,code:'RZ0001',name:'报考指导认证',timeArea:'季度',type:3,changeTime:'2018-11-28 09:32:32'},
      {key:8,id:8,code:'RZ0001',name:'好学生推荐认证',timeArea:'月度',type:4,changeTime:'2018-11-28 09:32:32'},
    ];
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
        dataIndex: 'timeArea',
      },
      {
        title: '报名通道状态',
        dataIndex: 'type',
      },
      {
        title: '报名变更时间',
        dataIndex: 'changeTime',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              {record.type !== 1 ? null : (
                <AuthorizedButton authority="/skillCertification/certificationEdit">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  >
                    关闭报名
                  </span>
                </AuthorizedButton>
              )}
              {record.type !== 2 ? null : (
                <AuthorizedButton authority="/skillCertification/certificationEdit">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  >
                    开放报名
                  </span>
                </AuthorizedButton>
              )}
              {record.type === 1 || record.type === 4  ? null : (
                <AuthorizedButton authority="/skillCertification/certificationEdit">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.onEdit(record)}
                  >
                    编辑
                  </span>
                </AuthorizedButton>
              )}
              {record.type === 1 || record.type === 4  ? null : (
                <AuthorizedButton authority="/skillCertification/certificationEdit">
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

  render() {
    const { loading } = this.props;
    const { pageNum } = this.state.params;
    const { userListData = {} } = {};
    const { totalElements = 0, content = [] } = userListData;
    const dataSource = this.fillDataSource(content);
    const columns = this.columnsData();

    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <div>
            <AuthorizedButton authority="/user/createUser">
              <Button onClick={this.handleAdd} type="primary" className={common.longWidthButton} >
                批量开发报名
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/user/createUser">
              <Button onClick={this.handleAdd} type="primary" className={common.deleteQualityButton} style={{width:'140px',margin:'0 10px'}}>
                批量关闭报名
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/user/createUser">
              <Button onClick={this.handleAdd} type="primary" className={common.createButton} style={{width:'140px',margin:'0 10px'}}>
                创建认证项目
              </Button>
            </AuthorizedButton>
          </div>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalElements}条</p>
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
    );
  }
}


export default CertificationList;
