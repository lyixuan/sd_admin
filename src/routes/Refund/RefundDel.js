import React, { Component } from 'react';
import { connect } from 'dva';
import StepLayout from '../../layouts/stepLayout';
import StepInput from '../../selfComponent/setpForm/stepInput';
import StepSucess from '../../selfComponent/setpForm/stepSucess';
import StepTable from '../../selfComponent/setpForm/stepTable';
import CheckResult from '../../selfComponent/setpForm/checkResult';
import { setConfirm, clearConfirm } from '../../utils/reloadConfirm';

@connect(({ blRefund, loading }) => ({
  blRefund,
  loading,
}))
class RefundDel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: true,
    };
  }

  componentDidMount() {
    // init current
    this.editCurrent(0);
  }
  // 离开页面的时候，把disableDel，nums恢复默认值null
  componentWillUnmount() {
    clearConfirm();
    this.initParamsFn(null, 'clear');
  }
  // 回调
  onChildChange = bol => {
    console.log(bol);
    this.setState({
      isDisabled: bol,
    });
  };
  getNums = nums => {
    this.props.dispatch({
      type: 'blRefund/getNums',
      payload: nums,
    });
  };
  // 初始化一些值
  initParamsFn = (disableDel, nums) => {
    const num = !nums ? this.props.blRefund.nums : '';
    this.props.dispatch({
      type: 'blRefund/initParams',
      payload: { disableDel, nums: num },
    });
  };
  fetchPreDel = params => {
    this.props.dispatch({
      type: 'blRefund/preDelRefund',
      payload: { params, search: this.props.location.search.split('?')[1] },
    });
  };
  fetchDel = params => {
    this.props.dispatch({
      type: 'blRefund/delRefund',
      payload: { params, search: this.props.location.search.split('?')[1] },
    });
  };
  editCurrent = current => {
    this.props.dispatch({
      type: 'blRefund/editCurrent',
      payload: { current },
    });
  };
  editLoading = isLoading => {
    this.props.dispatch({
      type: 'blRefund/editLoading',
      payload: { isLoading },
    });
  };
  historyFn() {
    this.props.history.push({
      pathname: '/bottomLine/refundList',
    });
  }
  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index + 1,
        bottomLineNum: item.bottomLineNum,
        complainTime: item.complainTime,
        stuName: `${item.stuName} | ${item.stuId}`,
        cpName: item.cpName,
        name:
          item.groupName && item.familyName
            ? `${item.collegeName} | ${item.familyName} | ${item.groupName}`
            : item.familyName ? `${item.collegeName} | ${item.familyName}` : `${item.collegeName}`,
      })
    );
    return data;
  };

  columnsData = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '工单编号',
        dataIndex: 'bottomLineNum',
      },
      {
        title: '投诉时间',
        dataIndex: 'complainTime',
      },
      {
        title: '学生名称 | id',
        dataIndex: 'stuName',
      },
      {
        title: '老师名称',
        dataIndex: 'cpName',
      },
      {
        title: '学院 | 家族 | 小组',
        dataIndex: 'name',
      },
    ];
    return columns;
  };
  render() {
    const search = this.props.location.search.split('?')[1];
    const { preDelData, nums, current, disableDel, isLoading } = this.props.blRefund;
    const { isDisabled } = this.state;
    const data = preDelData ? preDelData.data : null;

    const dataSource = !data || !data.successNums ? [] : this.fillDataSource(data.successNums);
    const columns = !this.columnsData() ? [] : this.columnsData();

    const successArr = [];
    if (dataSource.length > 0) {
      data.successNums.forEach(item => {
        successArr.push(item.bottomLineNum);
      });
    }
    const failNums = data ? data.failNums : [];
    const successSize = data ? data.successSize : 0;
    const inputContent = data ? data.failSize > 0 : null;

    // 有数据之后刷新页面提示弹框
    if (!isDisabled) {
      setConfirm();
    } else {
      clearConfirm();
    }

    const tipSucess = `您已成功删除 ${successSize} 条数据！`;
    const checkRes = !data ? null : (
      <CheckResult totalSize={data.totalSize} successSize={successSize} failSize={data.failSize} />
    );
    const steps = [
      {
        title: '输入编号',
        content: (
          <StepInput
            inputTitle="请输入想删除的 “编号”："
            inputContent="true"
            inputTip="true"
            nums={nums}
            getNums={param => {
              this.getNums(param);
            }}
            callBackParent={bol => {
              this.onChildChange(bol);
            }}
            pageType={search}
          />
        ),
      },
      {
        title: '校验编号',
        content: (
          <StepInput
            inputInfo={checkRes}
            inputContent={inputContent}
            disabled
            faileData={failNums}
          />
        ),
      },
      {
        title: '复核数据',
        content: (
          <StepTable
            tableTitle="请确认是否删除以下数据："
            dataSource={dataSource}
            columns={columns}
          />
        ),
      },
      {
        title: '删除成功',
        content: <StepSucess isDelImg="true" tipSucess={tipSucess} />,
      },
    ];
    return (
      <StepLayout
        routerData={this.props.routerData}
        title={search === '1' ? '删除退费' : '删除退挽'}
        steps={steps}
        tipSucess={tipSucess}
        goBack={() => {
          this.historyFn();
        }}
        callBackParent={bol => {
          this.onChildChange(bol);
        }}
        initParamsFn={dis => {
          this.initParamsFn(dis);
        }}
        step1Fetch={() => {
          this.fetchPreDel({ nums });
        }}
        step2Fetch={() => {
          this.editCurrent(2);
        }}
        step3Fetch={() => {
          this.fetchDel({ nums: successArr.join(' ') });
        }}
        editLoading={loading => {
          this.editLoading(loading);
        }}
        isLoading={isLoading}
        isDisabled={isDisabled}
        disableDel={disableDel}
        current={current}
        editCurrent={param => {
          this.editCurrent(param);
        }}
      />
    );
  }
}

export default RefundDel;
