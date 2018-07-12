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
  // 回调
  onChildChange = (bol, checkParams) => {
    this.setState({
      isDisabled: bol,
      checkParams,
    });
  };

  // 校验excel文件
  fetchCheckData = params => {
    this.props.dispatch({
      type: 'quality/checkQuality',
      payload: { params },
    });
  };

  editCurrent = current => {
    console.log(current);
    this.props.dispatch({
      type: 'quality/editCurrent',
      payload: { current },
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
        title: '子订单编号',
        dataIndex: 'rowNum',
        width: '100px',
      },
      {
        title: '编号已存在',
        dataIndex: 'qualityNum',
        width: '100px',
      },
      {
        title: '必填项缺失',
        dataIndex: 'qualityDate',
        width: '100px',
      },
      {
        title: '班主任组织关系匹配失败',
        dataIndex: 'teaId',
        width: '100px',
      },
      {
        title: '学院/家族/小组不存在',
        dataIndex: 'qualityType',
        width: '150px',
      },
      {
        title: '编号重复',
        dataIndex: 'countValue',
        width: '100px',
      },
    ];
    return columns;
  };
  render() {
    const { current, checkList } = this.props.quality;
    const { isDisabled, checkParams } = this.state;
    const sucessNum = !checkList ? 0 : checkList.data.num;
    const errorList = !checkList ? [] : checkList.data.errorList;

    const dataSource = !errorList.length > 0 ? null : errorList;
    const columns = !this.columnsData() ? [] : this.columnsData();
    const tableTitle =
      !errorList.length > 0 ? `本次添加退费数量 ${sucessNum} 条数据！确定上传？` : null;

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
        title="添加质检"
        steps={steps}
        isDisabled={isDisabled}
        goBack={() => {
          this.historyFn();
        }}
        step1Fetch={() => {
          this.fetchCheckData({ filePath: checkParams });
        }}
        step2Fetch={() => {
          this.editCurrent(2);
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
