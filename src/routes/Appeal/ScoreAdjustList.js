/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Popconfirm, Popover } from 'antd';
import moment from 'moment/moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import AuditListForm from './component/ScoreAdjustList_Form';
import common from '../Common/common.css';
import style from './score.css';

const SearchForm = Form.create()(AuditListForm);
const contentDel = (
  <div style={{ marginBottom: '-22px' }}>
    <p style={{ marginBottom: '7px' }}>是否确认删除该条数据？</p>
    <p>记得联系产研一组产品经理刷新缓存后生效哦</p>
  </div>
);

@connect(({ scoreAdjust, loading }) => ({
  scoreAdjust,
  loading: loading.effects['scoreAdjust/getList'],
}))
class ScoreAdjustList extends Component {
  constructor(props) {
    super(props);
    this.pageNum = 0;
    this.pageSize = 30;
    const storageData = JSON.parse(sessionStorage.getItem('tempFrom'));
    console.log(storageData);
    if (storageData) {
      this.pageNum = storageData.pageNum;
      this.pageSize = storageData.pageSize;
    }
    this.params = {};
    this.oriSearchParams = {};
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    // 获取搜索下拉
    const params = {};
    this.props.dispatch({
      type: 'scoreAdjust/findAllCollege',
      payload: { params },
    });
  }

  // 添加调整
  onCreate = () => {
    this.props.setRouteUrlParams('/appeal/scoreAdjustCreate', {});
    sessionStorage.setItem('tempFrom', JSON.stringify(this.oriSearchParams));
  };

  // 编辑调整
  onEdit = val => {
    this.props.setRouteUrlParams('/appeal/scoreAdjustEdit', {
      id: val.id,
    });
    sessionStorage.setItem('tempFrom', JSON.stringify(this.oriSearchParams));
  };

  // 删除
  onDel = val => {
    this.props.dispatch({
      type: 'scoreAdjust/delById',
      payload: {
        id: val.id,
        action: () => {
          this.search();
        },
      },
    });
  };

  // 表单搜索函数
  search = (params, values, pg) => {
    const obj = params ? { ...params } : this.params;
    this.pageNum = pg === 1 ? 0 : this.pageNum;
    obj.pageNum = this.pageNum;
    obj.pageSize = this.pageSize;
    this.params = { ...obj };
    this.props.dispatch({
      type: 'scoreAdjust/getList',
      payload: { obj },
    });
    if (values) {
      this.oriSearchParams = values;
    }
    this.oriSearchParams.pageSize = this.pageSize;
    this.oriSearchParams.pageNum = this.pageNum;
  };

  // 表单重置
  reset = (params, val) => {
    this.pageNum = 0;
    this.search(params, val);
  };

  // 点击某一页函数
  changePage = current => {
    this.pageNum = current - 1;
    this.search();
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '学分日期',
        dataIndex: 'adjustDate2',
      },
      {
        title: '调整类型',
        dataIndex: 'type2',
      },
      {
        title: '均分',
        dataIndex: 'creditScore2',
        className: 'column-creditScore2',
      },
      {
        title: '调整级别',
        dataIndex: 'groupType2',
      },
      {
        title: '调整组织',
        dataIndex: 'orgName2',
      },
      {
        title: '组织类型',
        dataIndex: 'familyType2',
      },
      {
        title: '操作人',
        dataIndex: 'operateName',
      },
      {
        title: '更新时间',
        dataIndex: 'modifyTime2',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div className="scoreAdjust">
              <Popover content={<div className={style.bline}>{record.reason}</div>} trigger="click">
                <span style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}>
                  查看备注
                </span>
              </Popover>
              <AuthorizedButton authority="/appeal/scoreAdjustEdit">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/appeal/scoreAdjustDel">
                <Popconfirm
                  placement="topRight"
                  title={contentDel}
                  onConfirm={() => this.onDel(record)}
                >
                  <span style={{ color: '#52C9C2', cursor: 'pointer' }}>删除</span>
                </Popconfirm>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns || [];
  };

  render() {
    const { loading } = this.props;
    const { content, totalElements } = this.props.scoreAdjust.list;

    if (content) {
      content.forEach((v, i) => {
        content[i].modifyTime2 = moment(v.modifyTime).format('YYYY-MM-DD HH:mm:ss');
        content[i].adjustDate2 = moment(v.adjustDate).format('YYYY-MM-DD');
        content[i].type2 = v.type === 1 ? '调增学分' : '调减学分';
        content[i].groupType2 = BI_Filter(`USER_LEVEL|id:${v.groupType}`).name;
        content[i].familyType2 = v.familyType === 0 ? '自考' : '壁垒';
        content[i].creditScore2 = parseFloat(content[i].creditScore).toFixed(2);
        if (v.type === 2) {
          content[i].creditScore2 = `-${content[i].creditScore2}`;
        }
        content[i].orgName2 =
          v.collegeName && v.familyName && v.groupName
            ? `${v.collegeName} | ${v.familyName} | ${v.groupName}`
            : v.collegeName && v.familyName
              ? `${v.collegeName} | ${v.familyName}`
              : v.collegeName ? v.collegeName : '';
        content[i].index = i + 1;
      });
    }
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <SearchForm
            propData={this.props.scoreAdjust}
            handleSearch={(params, values, rs) => {
              this.search(params, values, rs);
            }}
            reset={(params, val) => {
              this.reset(params, val);
            }}
          />
        }
        contentButton={
          <div style={{ marginTop: 15 }}>
            <AuthorizedButton authority="/appeal/scoreAdjustCreate">
              <Button
                onClick={() => this.onCreate()}
                type="primary"
                className={common.createButton}
              >
                添加调整
              </Button>
            </AuthorizedButton>
          </div>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalElements}条</p>
            <Table
              rowKey={record => record.id}
              bordered
              loading={loading}
              dataSource={content}
              columns={this.columnsData()}
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
            defaultCurrent={this.pageNum + 1}
            total={totalElements}
          />
        }
      />
    );
  }
}

export default ScoreAdjustList;
