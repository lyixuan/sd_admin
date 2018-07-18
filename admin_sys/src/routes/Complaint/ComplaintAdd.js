import React, { Component } from 'react';
import { connect } from 'dva';
import { qualityUpload } from '../../services/api';
import { setConfirm, clearConfirm } from '../../utils/reloadConfirm';
import StepLayout from '../../layouts/stepLayout';
import StepUpload from '../../selfComponent/setpForm/stepUpload';
import StepTable from '../../selfComponent/setpForm/stepTable';
import StepSucess from '../../selfComponent/setpForm/stepSucess';

@connect(({ blComplain, loading }) => ({
  blComplain,
  loading,
}))
class ComplaintAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: true,
      checkParams: '',
    };
  }

  componentDidMount() {
    this.editCurrent(0);
  }
  componentWillUnmount() {
    clearConfirm();
    this.initParamsFn(null);
  }
  // 回调
  onChildChange = (bol, checkParams) => {
    this.setState({
      isDisabled: bol,
      checkParams,
    });
  };
  // 初始化一些值
  initParamsFn = disableDel => {
    this.props.dispatch({
      type: 'blComplain/initParams',
      payload: { disableDel },
    });
  };
  // 校验excel文件
  fetchCheckData = params => {
    this.props.dispatch({
      type: 'blComplain/checkComplain',
      payload: { params },
    });
  };
  // 保存excel数据
  saveExcelData = params => {
    this.props.dispatch({
      type: 'blComplain/saveExcel',
      payload: { params },
    });
  };
  editCurrent = current => {
    this.props.dispatch({
      type: 'blComplain/editCurrent',
      payload: { current },
    });
  };
  historyFn() {
    this.props.history.push({
      pathname: '/complaint/complaintList',
    });
  }
  columnsData = () => {
    const columns = [
      {
        title: '行数',
        dataIndex: 'rowNum',
        width: '70px',
      },
      {
        title: '编号',
        dataIndex: 'bottomLinueNum',
        width: '92px',
      },
      {
        title: '投诉时间',
        dataIndex: 'complainTime',
        width: '105px',
      },
      {
        title: '学生id',
        dataIndex: 'stuId',
        width: '133px',
      },
      {
        title: '学生姓名',
        dataIndex: 'stuName',
        width: '92px',
      },
      {
        title: '老师id',
        dataIndex: 'cpId',
        width: '160px',
      },
      {
        title: '扣分值',
        dataIndex: 'countValue',
      },
    ];
    return columns;
  };
  render() {
    const { current, checkList, disableDel } = this.props.blComplain;
    const { isDisabled, checkParams } = this.state;
    const sucessNum = !checkList ? 0 : checkList.data.num;
    const errorList = !checkList ? [] : checkList.data.errorList;

    const dataSource = !errorList.length > 0 ? null : errorList;
    const columns = !this.columnsData() ? [] : this.columnsData();
    const tableTitle =
      !errorList.length > 0 ? (
        <div
          style={{
            width: '590px',
            height: '58px',
            background: '#F6F7FA',
            borderRadius: '3px',
            lineHeight: '58px',
            margin: '116px auto 0',
          }}
        >
          本次添加投诉数量
          <span style={{ color: '#52C9C2' }}>{sucessNum}</span>
          条！确定上传？
        </div>
      ) : null;

    // 有数据之后刷新页面提示弹框
    if (!isDisabled) {
      setConfirm();
    } else {
      clearConfirm();
    }

    const steps = [
      {
        title: '选择Excel',
        content: (
          <StepUpload
            uploadUrl={qualityUpload()}
            callBackParent={(bol, params) => {
              this.onChildChange(bol, params);
            }}
          />
        ),
      },
      {
        title: '校验文件',
        content: (
          <StepTable
            tableTitle={tableTitle}
            onlyTable="true"
            dataSource={dataSource}
            columns={columns}
            scroll={{ y: 264 }}
          />
        ),
      },
      {
        title: '上传成功',
        content: <StepSucess isDelImg="false" tipSucess={`您已成功上传  ${sucessNum}  条数据！`} />,
      },
    ];
    return (
      <StepLayout
        title="添加投诉"
        steps={steps}
        isDisabled={isDisabled}
        disableDel={disableDel}
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
          this.fetchCheckData({ filePath: checkParams });
        }}
        step2Fetch={() => {
          this.saveExcelData({ filePath: checkParams });
        }}
        current={current}
        editCurrent={param => {
          this.editCurrent(param);
        }}
      />
    );
  }
}

export default ComplaintAdd;
