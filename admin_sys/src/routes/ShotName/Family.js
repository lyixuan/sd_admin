import React, { Component } from 'react';
import { Table, Input, message } from 'antd';
import { connect } from 'dva';
// import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';

@connect(({ shortName, loading }) => ({
  shortName,
  loading: loading.models.shortName,
}))
class Family extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      collegeName: '学院名字',
      familyName: '家族名字',
      id: 0,
      name: '',
    };
  }
  componentDidMount() {
    this.getFamilyData({ size: 30, number: 0 });
  }
  // 编辑
  onEdit = record => {
    this.setState({
      collegeName: record.collegeName,
      familyName: record.familyName,
      id: record.id,
      visible: true,
      name: '',
    });
  };

  // 获取家族列表数据
  getFamilyData = params => {
    this.props.dispatch({
      type: 'shortName/familyList',
      payload: { paramsObj: params },
    });
  };

  // 模态框回显
  clickModalOK = (id, familyShortName) => {
    if (!familyShortName) {
      message.error('家族简称不可为空');
      this.showModal(true);
    } else {
      const paramsObj = {
        id,
        familyShortName,
      };
      this.props.dispatch({
        type: 'shortName/editFamily',
        payload: { paramsObj },
      });
      this.showModal(false);
    }
  };
  // input双向绑定
  handelChange(e) {
    this.setState({
      name: e.target.value,
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
        title: '学院名称',
        dataIndex: 'collegeName',
      },
      {
        title: '家族id',
        dataIndex: 'familyId',
      },
      {
        title: '家族名称',
        dataIndex: 'familyName',
      },
      {
        title: '家族简称',
        dataIndex: 'objShortName',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/account/editAccount">
                <span style={{ color: '#52C9C2' ,cursor: 'pointer'}} onClick={() => this.onEdit(record)}>
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
    const { familyList } = shortName;
    const dataSource = !familyList ? [] : familyList.data;
    const columns = !this.columnsData() ? [] : this.columnsData();
    const { visible, collegeName, familyName, id, name } = this.state;
    const modalTitle = `${collegeName} / ${familyName}`;
    const modalContent = (
      <div>
        <p style={{ textAlign: 'center', marginBottom: '10px' }}>{modalTitle}</p>
        <Input
          maxLength={20}
          style={{ width: '300px', margin: '0 100px' }}
          onChange={e => {
            this.handelChange(e);
          }}
          value={name}
        />
      </div>
    );
    return (
      <div>
        <ContentLayout
          pageHeraderUnvisible="unvisible"
          title="家族"
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
          title="编辑家族短名称"
          visible={visible}
          modalContent={modalContent}
          showModal={bol => this.showModal(bol)}
          clickOK={() => this.clickModalOK(id, name)}
        />
      </div>
    );
  }
}

export default Family;
