import React, { Component } from 'react';
import { connect } from 'dva';
import { qualityUpload } from '../../services/api';
import { setConfirm, clearConfirm } from '../../utils/reloadConfirm';
import StepLayout from '../../layouts/stepLayout';
import StepUpload from '../../selfComponent/setpForm/stepUpload';
import StepTable from '../../selfComponent/setpForm/stepTable';
import StepSucess from '../../selfComponent/setpForm/stepSucess';

@connect(({ quality, loading }) => ({
  quality,
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
    this.editCurrent(0);
  }

  componentWillUnmount() {
    clearConfirm();
    this.initParamsFn(null);
    // 点击添加的时候清除文件
    this.saveFileList([]);
  }
  // 回调
  onChildChange = (bol, checkParams) => {
    if (checkParams) {
      this.setState({
        isDisabled: bol,
        checkParams,
      });
    } else {
      this.setState({
        isDisabled: bol,
      });
    }
  };
  // 初始化一些值
  initParamsFn = disableDel => {
    this.props.dispatch({
      type: 'quality/initParams',
      payload: { disableDel },
    });
  };
  // 校验excel文件
  fetchCheckData = params => {
    this.props.dispatch({
      type: 'quality/checkQuality',
      payload: { params },
    });
  };
  // 保存excel数据
  saveExcelData = params => {
    this.props.dispatch({
      type: 'quality/saveExcel',
      payload: { params },
    });
  };

  saveFileList = fileList => {
    this.props.dispatch({
      type: 'quality/saveFileList',
      payload: { fileList },
    });
  };
  editCurrent = current => {
    this.props.dispatch({
      type: 'quality/editCurrent',
      payload: { current },
    });
  };
  editLoading = isLoading => {
    console.log(isLoading);
    this.props.dispatch({
      type: 'quality/editLoading',
      payload: { isLoading },
    });
  };
  historyFn() {
    this.props.history.push({
      pathname: '/quality/qualityList',
    });
  }
  columnsData = () => {
    const columns = [
      {
        title: '行数',
        dataIndex: 'rowNum',
      },
      {
        title: '质检单号',
        dataIndex: 'qualityNum',
      },
      {
        title: '监控日期',
        dataIndex: 'qualityDate',
      },
      {
        title: '班主任id',
        dataIndex: 'teaId',
      },
      {
        title: '违规等级',
        dataIndex: 'qualityType',
      },
      {
        title: '扣除学分',
        dataIndex: 'countValue',
      },
    ];
    return columns;
  };
  render() {
    let fileData = ''; // 保存上传文件返回值，防止返回再点下一步报错
    const { current, checkList, fileList, disableDel, isLoading } = this.props.quality;
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
          本次添加质检数量
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
        title="添加质检"
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
          this.fetchCheckData({ filePath: fileData });
        }}
        step2Fetch={() => {
          this.saveExcelData({ filePath: fileData });
        }}
        editLoading={loading => {
          this.editLoading(loading);
        }}
        isLoading={isLoading}
        current={current}
        editCurrent={param => {
          this.editCurrent(param);
        }}
      />
    );
  }
}

export default RefundAdd;
