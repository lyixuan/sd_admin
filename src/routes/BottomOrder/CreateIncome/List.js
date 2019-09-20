/* eslint-disable radix,prefer-destructuring */
import React, { Component } from 'react';
import { Input, Select, DatePicker, TreeSelect } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
// import ContentLayoutNew from '../../../layouts/ContentLayoutNew';
import ContentLayout from '../../../layouts/ContentLayout';
import FormFilter from '../../../selfComponent/FormFilter';
// import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import BatchProcess from './component/BatchProcessing';
// import common from '../../Common/common.css';
import styles from './style.less';
import { deepCopy } from '../../../utils/utils';
import EditModal from './component/EditModal';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { RangePicker } = DatePicker;

// 获取table列表头
const tablecolumns = [
  {
    title: '报名时间',
    dataIndex: 'registrationDate',
    width: 120,
    fixed: 'left',
    render: text => {
      return (
        <>
          {text === null ? (
            <span className={styles.unFind}>未获取到</span>
          ) : (
            moment(text).format('YYYY-MM-DD')
          )}
        </>
      );
    },
  },
  {
    title: '子订单ID',
    dataIndex: 'orderId',
    width: 100,
    fixed: 'left',
    render: text => {
      return <>{text === null ? <span className={styles.unFind}>未获取到</span> : text}</>;
    },
  },
  {
    title: '学员ID',
    dataIndex: 'stuId',
    width: 105,
    fixed: 'left',
    render: text => {
      return <>{text === null ? <span className={styles.unFind}>未获取到</span> : text}</>;
    },
  },
  {
    title: '组织架构',
    dataIndex: 'college',
    width: 180,
    fixed: 'left',
    render: (text, record) => {
      return (
        <>
          {`${
            record.collegeName ? (
              record.collegeName
            ) : (
              <span className={styles.unFind}>未获取到</span>
            )
          } ${record.familyName ? `| ${record.familyName}` : ''}  ${
            record.groupName ? `| ${record.groupName}` : ''
          }`}
        </>
      );
    },
  },
  {
    title: '推荐老师邮箱',
    dataIndex: 'teacherName',
    width: 110,
    render: text => {
      return <>{text === null ? <span className={styles.unFind}>未获取到</span> : text}</>;
    },
  },
  {
    title: '推荐老师',
    dataIndex: 'recommendedTeacher',
    width: 80,
  },
  {
    title: '重播听课',
    dataIndex: 'replayLecturesTime',
    width: 120,
  },
  {
    title: '直播听课',
    dataIndex: 'liveLecturesTime',
    width: 120,
  },
  {
    title: '判断逻辑',
    dataIndex: 'logicJudge',
    width: 100,
    render: text => {
      return <>{text === null ? 0 : text}</>;
    },
  },
  {
    title: '成单类型',
    dataIndex: 'orderType',
    width: 100,
    render: text => {
      return (
        <>
          {text === null ? (
            <span className={styles.unFind}>未获取到</span>
          ) : (
            window.BI_Filter(`BILL_TYPE|id:${text}`).name
          )}
        </>
      );
    },
  },
  {
    title: '是否提退',
    dataIndex: 'refundFlag',
    width: 100,
    render: text => {
      return <>{text === null ? 0 : text}</>;
    },
  },
  {
    title: '是否挽留成功',
    dataIndex: 'retainFlag',
    width: 100,
    render: text => {
      return <>{text === null ? 0 : text}</>;
    },
  },
  {
    title: '净流水',
    dataIndex: 'financeNetFlow',
    width: 90,
    render: text => {
      return <>{text === null ? '0.00' : text.toFixed(2)}</>;
    },
  },
  {
    title: '竞合比',
    dataIndex: 'competitionRatio',
    width: 110,
    render: text => {
      return <>{text ? (text * 100).toFixed(2) : '100.00'}</>;
    },
  },
  {
    title: '创收流水',
    dataIndex: 'incomeFlow',
    width: 120,
    render: text => {
      return <>{text === null || text === undefined ? '0.00' : text.toFixed(2)}</>;
    },
  },
  {
    title: '绩效流水',
    dataIndex: 'kpiFlow',
    width: 70,
    render: text => {
      return <>{text === null ? '0.00' : text.toFixed(2)}</>;
    },
  },
];

@connect(({ createIncome, loading }) => ({
  createIncome,
  loadingTime: loading.effects['createIncome/getDateRange'],
  loading: loading.effects['createIncome/recommendList'],
}))
class CreateList extends Component {
  constructor(props) {
    super(props);
    this.initData = {
      registrationBeginDate: null,
      registrationEndDate: null,
      collegeIdList: [],
      familyIdList: [],
      groupIdList: [],
      refundFlag: undefined,
      stuId: undefined,
      teacherName: undefined,
      retainFlag: undefined,
      orderId: undefined,
      orderTypeList: [],
      pageNum: 0,
      visible: false,
      visibleDel: false,
    };
    this.state = { ...this.initData };
  }
  componentDidMount() {
    const that = this;
    this.props
      .dispatch({
        type: 'createIncome/getDateRange',
        payload: {},
      })
      .then(response => {
        if (response) {
          this.initData.registrationBeginDate =
            moment(response.beginDate).format('YYYY-MM-DD') || null;
          this.initData.registrationEndDate = moment(response.endDate).format('YYYY-MM-DD') || null;
          this.setState({
            ...this.initData,
          });
          that.handleSearch();
        }
      });
    // 获取组织
    this.props.dispatch({
      type: 'createIncome/getOrgMapList',
      payload: { params: {} },
    });
  }
  onEdit = () => {
    const obj = {
      collegeId: 104,
      familyId: 269,
      groupId: 151,
      financeNetFlow: 5251.11,
      id: 7539,
      kpiFlow: 5251.13,
      lecturesTime: null,
      liveLecturesTime: 50,
      orderType: 1,
      recommendedTeacher: '孙晓伟',
      registrationDate: 1568304000000,
      replayLecturesTime: 40,
      logicJudge: 'ko听课',
      stuId: 11865500,
      orderId: 54432882,
      teacherName: 'sunxiaowei-fesco',
      competitionRatio: null,
    };
    this.setState({ visible: true, editData: obj });
  };
  onChange = (dates, dateStrings) => {
    this.setState({
      registrationBeginDate: dateStrings[0] || null,
      registrationEndDate: dateStrings[1] || null,
    });
  };
  onFormChange = (value, vname) => {
    if (vname === 'organization') {
      const list1 = [];
      const list2 = [];
      const list3 = [];
      value.forEach(v => {
        if (v.indexOf('a-') >= 0) {
          list1.push(v);
        }
        if (v.indexOf('b-') >= 0) {
          list2.push(v);
        }
        if (v.indexOf('c-') >= 0) {
          list3.push(v);
        }
      });
      this.setState({
        collegeIdList: [...list1],
        familyIdList: [...list2],
        groupIdList: [...list3],
      });
    } else {
      this.setState({
        [vname]: value,
      });
    }
  };
  onSubmit = val => {
    const params = { ...val };
    params.competitionRatio = params.competitionRatio === undefined ? 100 : params.competitionRatio;
    params.teacherName = params.recommendedTeacher;
    params.collegeId = params.organization[0] || undefined;
    params.familyId = params.organization[1] || undefined;
    params.groupId = params.organization[2] || undefined;
    this.props.dispatch({
      type: 'createIncome/edit',
      payload: { params },
    });
  };
  onCancel = () => {
    this.setState({ visible: false });
  };
  onCancelStep = () => {
    this.setState({ visibleDel: false });
  };
  getData = params => {
    const getListParams = { ...params };
    this.props.dispatch({
      type: 'createIncome/recommendList',
      payload: { getListParams },
    });
  };

  // 点击某一页函数
  changePage = (pageNum, size) => {
    const newParams = this.handleParams({ ...this.state, pageNum, size });
    this.getData(this.filterEmptyParams(newParams));
  };
  // 表单搜索函数
  handleSearch = params => {
    this.getData(this.handleParams(this.filterEmptyParams({ ...this.state, ...params })));
  };

  handleSearchEnter = () => {
    this.handleSearch();
  };

  handleParams = params => {
    const newParams = deepCopy(params);
    newParams.orderId = params.orderId ? parseInt(params.orderId) : undefined;
    newParams.stuId = params.stuId ? parseInt(params.stuId) : undefined;
    newParams.refundFlag = params.refundFlag ? parseInt(params.refundFlag) : undefined;
    newParams.retainFlag = params.retainFlag ? parseInt(params.retainFlag) : undefined;
    newParams.pageNum = params.pageNum ? Number(params.pageNum) : 0;
    newParams.pageSize = params.pageSize ? Number(params.pageSize) : 30;

    if (newParams.collegeIdList && newParams.collegeIdList.length > 0) {
      newParams.collegeIdList = newParams.collegeIdList.map(v => {
        return Number(v.replace('a-', ''));
      });
    }
    if (newParams.familyIdList && newParams.familyIdList.length > 0) {
      newParams.familyIdList = newParams.familyIdList.map(v => {
        return Number(v.replace('b-', ''));
      });
    }
    if (newParams.groupIdList && newParams.groupIdList.length > 0) {
      newParams.groupIdList = newParams.groupIdList.map(v => {
        return Number(v.replace('c-', ''));
      });
    }
    return newParams;
  };
  filterEmptyParams = data => {
    const params = data;
    for (const i in params) {
      if (
        params[i] === undefined ||
        params[i] === null ||
        params[i] === '' ||
        params[i].length === 0
      ) {
        delete params[i];
      }
    }
    return params;
  };
  resetList = () => {
    this.setState({ ...this.initData }, function() {
      this.getData(this.handleParams(this.filterEmptyParams(this.state)));
    });
  };

  // 删除数据
  createIncomeDel = () => {
    this.setState({ visibleDel: true });
  };

  // 添加数据
  createIncomeAdd = () => {
    this.props.setRouteUrlParams('/bottomOrder/createIncomeAdd');
  };

  disabledDate = current => {
    return current > moment(this.props.createIncome.endDate);
  };

  columnsAction = () => {
    const actionObj = [
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <>
              <span
                style={{ color: '#52C9C2', cursor: 'pointer' }}
                onClick={() => this.onEdit(record)}
              >
                编辑
              </span>
            </>
          );
        },
      },
      {
        title: '',
        dataIndex: 'duoyukuandu',
      },
    ];
    return [...tablecolumns, ...actionObj];
  };

  render() {
    const options = window.BI_Filter('BILL_TYPE');
    const { urlParams } = this.state;
    const {
      registrationBeginDate = undefined,
      registrationEndDate = undefined,
      collegeIdList = [],
      familyIdList = [],
      groupIdList = [],
      refundFlag,
      stuId,
      teacherName,
      retainFlag,
      orderId,
      orderTypeList = [],
      visible,
      visibleDel,
    } = this.state;
    const { orgListTreeData = [], orgList = [] } = this.props.createIncome;
    const val = this.props.createIncome.qualityList;
    const res = !val.response ? {} : !val.response.data ? {} : val.response.data;
    const data = res.pageInfo || {};
    const totalNum = !data.total ? 0 : data.total;
    const totalMoney = !res.kpiFlowTotal ? 0 : res.kpiFlowTotal;
    const pageNum = !data.pageNum ? 1 : data.pageNum;
    const dataSource = data.list;
    const columns = this.columnsAction();
    const WrappedAdvancedSearchForm = () => (
      <FormFilter
        onSubmit={this.handleSearch}
        isLoading={this.props.loading}
        isCreateIncome={1}
        otherModal={urlParams}
        resetList={this.resetList}
      >
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>报名日期：</span>
          <RangePicker
            allowClear
            value={[registrationBeginDate, registrationEndDate].map(
              item => (item ? moment(item) : null)
            )}
            disabledDate={this.disabledDate}
            format={dateFormat}
            style={{ width: 230, height: 32 }}
            onChange={this.onChange}
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 组织架构：
          </span>
          <TreeSelect
            style={{ width: 230 }}
            placeholder="请选择"
            allowClear
            value={[...collegeIdList, ...familyIdList, ...groupIdList]}
            multiple
            showArrow
            maxTagCount={1}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={orgListTreeData}
            onChange={value => this.onFormChange(value, 'organization')}
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>是否提退：</span>
          <Select
            allowClear
            placeholder="请选择"
            onChange={value => this.onFormChange(value, 'refundFlag')}
            style={{ width: 230, height: 32 }}
            value={refundFlag}
          >
            {['0', '1'].map(item => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>学&nbsp;&nbsp;员&nbsp;&nbsp;ID：</span>
          <Input
            onPressEnter={this.handleSearchEnter}
            className="agc"
            placeholder="请输入数字"
            min={0}
            value={stuId}
            style={{ width: 230, height: 32 }}
            onChange={e => this.onFormChange(e.target.value, 'stuId')}
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>推荐老师邮箱：</span>
          <Input
            onPressEnter={this.handleSearchEnter}
            placeholder="请输入"
            maxLength={20}
            value={teacherName}
            style={{ width: 230, height: 32 }}
            onChange={e => this.onFormChange(e.target.value, 'teacherName')}
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>是否挽留成功：</span>
          <Select
            allowClear
            placeholder="请选择"
            style={{ width: 230, height: 32 }}
            value={retainFlag}
            onChange={value => this.onFormChange(value, 'retainFlag')}
          >
            {['0', '1'].map(item => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>子订单ID：</span>
          <Input
            onPressEnter={this.handleSearchEnter}
            className="agc"
            min={0}
            value={orderId}
            placeholder="请输入数字"
            style={{ width: 230, height: 32 }}
            onChange={e => this.onFormChange(e.target.value, 'orderId')}
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 成单类型：
          </span>
          <Select
            allowClear
            mode="multiple"
            showArrow
            maxTagCount={1}
            maxTagTextLength={7}
            placeholder="请选择"
            onChange={value => this.onFormChange(value, 'orderTypeList')}
            style={{ width: 230, height: 32 }}
            value={orderTypeList}
          >
            {options.map(item => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
      </FormFilter>
    );
    // const getTab = () => {
    //   return [
    //     { name: '创收成单', path: '/bottomOrder/createIncome' },
    //     { name: 'KO成单', path: '/bottomOrder/koIncome' },
    //   ];
    // };
    return (
      <div>
        <BatchProcess visible={visibleDel} onCancel={this.onCancelStep} />
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={WrappedAdvancedSearchForm()}
          // contentButton={
          //   <div>
          //     <AuthorizedButton authority="/bottomOrder/createIncomeAdd">
          //       <Button onClick={this.createIncomeAdd} type="primary" className={common.newButton}>
          //         添加数据
          //       </Button>
          //     </AuthorizedButton>
          //     <span>&nbsp;&nbsp;</span>
          //     <AuthorizedButton authority="/bottomOrder/createIncomeDel">
          //       <Button
          //         onClick={this.createIncomeDel}
          //         type="primary"
          //         className={common.cancleButtonGray}
          //       >
          //         删除数据
          //       </Button>
          //     </AuthorizedButton>
          //   </div>
          // }
          contentTable={
            <div style={{ padding: 10 }}>
              <FormFilter.Table
                scroll={{ x: 1910, y: 573 }}
                size="middle"
                className="circleTable"
                pageNum={pageNum}
                totalMoney={totalMoney}
                totalNum={totalNum}
                loading={this.props.loading}
                dataSource={dataSource}
                columns={columns}
                onChangePage={this.changePage}
                createIncomeAdd={() => this.createIncomeAdd()}
                createIncomeDel={() => this.createIncomeDel()}
              />
            </div>
          }
        >
          <EditModal
            visible={visible}
            editData={this.state.editData}
            orgList={orgList}
            onSubmit={value => this.onSubmit(value)}
            onCancel={this.onCancel}
          />
        </ContentLayout>
      </div>
    );
  }
}

export default CreateList;
