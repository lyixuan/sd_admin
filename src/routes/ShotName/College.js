import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, message } from 'antd';
// import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';

@connect(({ shortName, loading }) => ({
  shortName,
  loading: loading.models.shortName,
}))
class College extends Component {
  constructor(props) {
    super(props);
    const { visible } = props.shortName;
    this.state = {
      visible,
      collegeName: '',
      id: 0,
      name: '',
      sort: '',
      objId: '',
      objName: '',
      objType: '',
    };
  }
  componentDidMount() {
    this.getCollegeData({ size: 30, number: 0 });
  }

  // 编辑
  onEdit = record => {
    this.setState({
      collegeName: record.collegeName,
      id: record.shortId,
      objId: record.collegeId,
      objName: record.collegeName,
      objType: 'college',
      visible: true,
      name: record.objShortName,
      sort: record.sort,
    });
  };

  getCollegeData = params => {
    this.props.dispatch({
      type: 'shortName/collegeList',
      payload: { paramsObj: params },
    });
  };

  // 模态框回显
  clickModalOK = (id, collegeShortName, sort, objId, objName, objType) => {
    this.showModal(true);
    if (!collegeShortName) {
      message.error('学院简称不可为空');
      return;
    }
    if (!sort) {
      message.error('拼音名称不可为空');
      // this.showModal(true);
      return;
    }
    const { collegeName = null } = this.state;

    const paramsObj = {
      id,
      collegeShortName,
      sort,
      objId,
      objName,
      objType,
      orgName: collegeName,
    };
    this.props
      .dispatch({
        type: 'shortName/editCollege',
        payload: { paramsObj },
      })
      .then(res => {
        if (res.code === 2000) {
          this.showModal(false);
        }
      });
  };
  // input双向绑定
  handelChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  handelSortChange(e) {
    this.setState({
      sort: e.target.value,
    });
  }
  // 模态框显隐回调
  showModal = bol => {
    this.setState({
      visible: bol,
    });
  };
  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '学院id',
        dataIndex: 'collegeId',
      },
      {
        title: '学院名称',
        dataIndex: 'collegeName',
      },
      {
        title: '学院简称',
        dataIndex: 'objShortName',
      },
      {
        title: '拼音名称',
        dataIndex: 'sort',
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/college/editeCollegeShortName">
                <span
                  style={{ color: '#52C9C2', cursor: 'pointer' }}
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
    return columns;
  };

  render() {
    const { loading, shortName } = this.props;
    const { collegeList } = shortName;
    const dataSource = !collegeList ? [] : collegeList.data;
    const columns = !this.columnsData() ? [] : this.columnsData();
    const { visible, collegeName, id, name, objId, objName, objType, sort } = this.state;
    const modalContent = (
      <div>
        <p style={{ textAlign: 'center', marginBottom: '10px' }}> {collegeName} </p>
        <div
          style={{
            width: '100%',
            height: '32px',
            lineHeight: ' 32px',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              width: '100px',
              float: 'left',
            }}
          >
            学院简称：
          </span>
          <Input
            maxLength={30}
            style={{ width: '300px', float: 'left' }}
            onChange={e => {
              this.handelChange(e);
            }}
            value={name}
          />
        </div>
        <div
          style={{
            width: '100%',
            height: '32px',
            lineHeight: ' 32px',
          }}
        >
          <span
            style={{
              width: '100px',
              float: 'left',
            }}
          >
            拼音名称：
          </span>
          <Input
            maxLength={30}
            style={{ width: '300px', float: 'left' }}
            onChange={e => {
              this.handelSortChange(e);
            }}
            value={sort}
          />
        </div>
      </div>
    );
    return (
      <div>
        <ContentLayout
          routerData={this.props.routerData}
          contentTable={
            <div>
              <p className={common.totalNum}>总数：{dataSource.length} 条</p>
              <Table
                loading={loading}
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                className={common.tableContentStyle}
              />
            </div>
          }
          // contentPagination={
          //   <SelfPagination
          //     onChange={(current, pageSize) => {
          //       this.changePage(current, pageSize);
          //     }}
          //     total={dataSource.length}
          //   />
          // }
        />
        <ModalDialog
          title="编辑学院短名称"
          visible={visible}
          modalContent={modalContent}
          showModal={bol => this.showModal(bol)}
          clickOK={() => this.clickModalOK(id, name, sort, objId, objName, objType)}
        />
      </div>
    );
  }
}

export default College;
