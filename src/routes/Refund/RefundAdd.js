import React, { Component } from 'react';
import { connect } from 'dva';
import { qualityUpload } from '../../services/api';
import { setConfirm, clearConfirm } from '../../utils/reloadConfirm';
import StepLayout from '../../layouts/stepLayout';
import StepUpload from '../../selfComponent/setpForm/stepUpload';
import StepTable from '../../selfComponent/setpForm/stepTable';
import StepSucess from '../../selfComponent/setpForm/stepSucess';

@connect(({ blRefund, loading }) => ({
  blRefund,
  loading,
}))
class RefundAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: true,
      checkParams: '',
    };
  }

  componentDidMount() {
    // init current
    this.editCurrent(0);
  }
  componentWillUnmount() {
    console.log(22);
    clearConfirm();
    this.initParamsFn(null);
    // 点击添加的时候清除文件
    this.saveFileList([]);
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
      type: 'blRefund/initParams',
      payload: { disableDel },
    });
  };
  // 校验excel文件
  fetchCheckData = params => {
    this.props.dispatch({
      type: 'blRefund/checkRefund',
      payload: { params, search: this.props.location.search.split('?')[1] },
    });
  };
  // 保存excel数据
  saveExcelData = params => {
    this.props.dispatch({
      type: 'blRefund/saveExcel',
      payload: { params, search: this.props.location.search.split('?')[1] },
    });
  };
  saveFileList = fileList => {
    this.props.dispatch({
      type: 'blRefund/saveFileList',
      payload: { fileList },
    });
  };
  editCurrent = current => {
    this.props.dispatch({
      type: 'blRefund/editCurrent',
      payload: { current },
    });
  };
  editLoading = isLoading => {
    console.log(isLoading);
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

  columnsData = () => {
    const columns = [
      {
        title: '行数',
        dataIndex: 'rowNum',
      },
      {
        title: '子订单编号',
        dataIndex: 'ordId',
      },
      {
        title: '学生id',
        dataIndex: 'stuId',
      },
      {
        title: '学生姓名',
        dataIndex: 'stuName',
      },
      {
        title: '老师id',
        dataIndex: 'cpId',
      },
      {
        title: '编号',
        dataIndex: 'bottomLineNum',
      },
      {
        title: '投诉时间',
        dataIndex: 'complainTime',
      },
      {
        title: '学院得分',
        dataIndex: 'collegeScore',
      },
      {
        title: '家族得分',
        dataIndex: 'familyScore',
      },
      {
        title: '小组得分',
        dataIndex: 'groupScore',
      },
    ];
    return columns;
  };
  render() {
    const search = this.props.location.search.split('?')[1];
    let fileData = ''; // 保存上传文件返回值，防止返回再点下一步报错
    const { current, checkList, fileList, disableDel, isLoading } = this.props.blRefund;
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
          本次添加{search === '1' ? '退费' : '退挽'}数量
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
            fileList={fileList}
            callBackParent={(bol, params) => {
              this.onChildChange(bol, params);
            }}
            saveFileList={param => {
              this.saveFileList(param);
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
          />
        ),
      },
      {
        title: '上传成功',
        content: <StepSucess isDelImg="false" tipSucess={`您已成功上传  ${sucessNum}  条数据！`} />,
      },
    ];

    fileData = fileList.length > 0 ? fileList[0].response.data : checkParams;
    return (
      <StepLayout
        routerData={this.props.routerData}
        title={search === '1' ? '添加退费' : '添加退挽'}
        steps={steps}
        isDisabled={isDisabled}
        disableDel={disableDel}
        goBack={() => {
          this.historyFn();
        }}
        initParamsFn={dis => {
          this.initParamsFn(dis);
        }}
        callBackParent={bol => {
          this.onChildChange(bol);
        }}
        editLoading={loading => {
          this.editLoading(loading);
        }}
        isLoading={isLoading}
        step1Fetch={() => {
          this.fetchCheckData({ filePath: fileData });
        }}
        step2Fetch={() => {
          this.saveExcelData({ filePath: fileData });
        }}
        current={current}
        editCurrent={param => {
          this.editCurrent(param);
        }}
      />
    );
  }
}

export default RefundAdd;
