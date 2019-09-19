/* eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Input, Icon } from 'antd';
import sucessImg from '../../../../assets/sucessImg.png';
import delImg from '../../../../assets/delImg.png';
import styles from './BatchProcessing.less';
import Steps from './Steps';

const { Option } = Select;
const { TextArea } = Input;

@connect(({ stepsModel }) => ({
  stepsModel,
}))
/**
 * current ，，目前显示第几个modal
 * visible 显示隐藏modal
 * disabled 批量服务跟批量置为是联动的，当批量服务是删除的时候，批量置为不能选择
 * batchType 批量服务type
 * batchValue 批量服务value
 * orderIds 订单ids
 */
class BatchProcessing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   loading: false,
      current: 0,
      visible: false,
      disabled: false,
      batchType: null,
      batchValue: null,
      orderIds: '',
      step1Data: {},
      step2Data: {},
    };
  }
  //   componentDidMount() {
  //     this.setState({ visible: this.props.visible });
  //   }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.visible !== nextProps.visible) {
      this.setState({ visible: nextProps.visible });
      return true;
    }
    return false;
  }
  //   handleOk = () => {
  //     this.setState({ loading: true });
  //     setTimeout(() => {
  //       this.setState({ loading: false, visible: false });
  //     }, 3000);
  //   };

  onChangeFn1 = value => {
    value === '3'
      ? this.setState({ disabled: true, batchType: value })
      : this.setState({ disabled: false, batchType: value });
  };
  onChangeFn2 = value => {
    this.setState({ batchValue: value });
  };

  onTextChange = ({ target: { value } }) => {
    this.setState({ orderIds: value });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  step1FetchFn = () => {
    const { batchType, batchValue, orderIds } = this.state;
    const params = {
      batchType,
      batchValue,
      orderIds,
    };
    this.props
      .dispatch({
        type: 'stepsModel/stepsVerify',
        payload: { params },
      })
      .then(res => {
        this.setState({ current: 1, step1Data: res });
      });
  };
  step2FetchFn = () => {
    const { batchType, batchValue, orderIds } = this.state;
    const params = {
      batchType,
      batchValue,
      orderIds,
    };
    this.props
      .dispatch({
        type: 'stepsModel/stepSubmit',
        payload: { params },
      })
      .then(res => {
        this.setState({ current: 2, step2Data: res });
      });
  };
  step3FetchFn = () => {
    this.setState({ visible: false });
    this.props.history.push({
      pathname: '/bottomOrder/createIncome',
    });
  };
  editCurrentFn = current => {
    this.setState({ current });
  };

  gotoNext() {
    const { batchType, batchValue, orderIds } = this.state;
    if (batchType && batchType !== '3' && batchValue && orderIds) {
      return false;
    }
    if (((batchType && batchType === '3') || batchValue) && orderIds) {
      return false;
    }
    return true;
  }
  render() {
    const { current, visible, disabled, batchType, batchValue, orderIds } = this.state;

    const { step1Data, step2Data } = this.state;

    const params = {};
    params.steps = [
      {
        title: '批量编辑1:请输入基本信息',
        content: (
          <div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>批量服务:
              </span>
              <Select
                defaultValue={batchType}
                showSearch
                placeholder="请选择"
                style={{ width: 370 }}
                onChange={this.onChangeFn1}
              >
                <Option value="1">是否提退</Option>
                <Option value="2">是否挽留成功</Option>
                <Option value="3">删除</Option>
              </Select>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>批量置为:</span>
              <Select
                defaultValue={batchValue}
                showSearch
                disabled={disabled}
                placeholder="请选择"
                style={{ width: 370 }}
                onChange={this.onChangeFn2}
              >
                <Option value="0">0</Option>
                <Option value="1">1</Option>
              </Select>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>子订单ID:
              </span>
              <TextArea
                value={orderIds}
                onChange={this.onTextChange}
                style={{ width: 370 }}
                placeholder="请输入子订单ID,多个编号请使用逗号、空格、换行区分"
                autosize={{ minRows: 3, maxRows: 5 }}
              />
            </div>
          </div>
        ),
      },
      {
        title: '批量编辑2：基础信息校验结果',
        content: (
          <div>
            <div className={styles.line}>
              <span className={styles.left}>批量服务:</span>
              {batchType}
            </div>
            <div className={styles.line}>
              <span className={styles.left}>批量置为:</span>
              {batchValue}
            </div>
            <div className={styles.num}>
              <p>
                <span>
                  校验数据总量：<i className={styles.green}>{step1Data.totalCount}</i> 条
                </span>
                <span>
                  <Icon
                    type="check-circle"
                    theme="filled"
                    style={{ color: '#52C9C2', marginRight: '5px' }}
                  />成功：{step1Data.successCount} 条
                </span>
                <span>
                  <Icon type="close-circle" style={{ color: 'red', marginRight: '5px' }} />失败：{
                    step1Data.failCount
                  }
                  条{' '}
                </span>
              </p>
              <div className={styles.textAreaCon}>
                <p>以下子订单ID未找到：</p>
                <textArea disabled className={styles.text} style={{ width: '100%' }}>
                  {step1Data.failList}
                </textArea>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: '批量编辑3：批量操作结果',
        content: (
          <div>
            <div className={styles.line}>
              <span className={styles.left}>批量服务:</span>
              {batchType}
            </div>
            <div className={styles.line}>
              <span className={styles.left}>批量置为:</span>
              {batchValue}
            </div>
            <div className={styles.num}>
              <p className={styles.img}>
                <img src={step2Data.status ? sucessImg : delImg} alt="" />
              </p>
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {step2Data.status ? (
                  <span>
                    成功更新 <i className={styles.green}>98</i>条订单记录
                  </span>
                ) : (
                  <i className={styles.red}>数据更新失败</i>
                )}
              </p>
            </div>
          </div>
        ),
      },
    ];

    params.current = current;
    params.visible = visible;
    params.step1disabled = this.gotoNext();
    params.step2disabled = !(step1Data && step1Data.successCount >= 1);
    params.step1Fetch = () => {
      this.step1FetchFn();
    };
    params.step2Fetch = () => {
      this.step2FetchFn();
    };
    params.step3Fetch = () => {
      this.step3FetchFn();
    };
    params.editCurrent = curr => {
      this.editCurrentFn(curr);
    };

    return (
      <div>
        <Steps params={params} />
      </div>
    );
  }
}

export default BatchProcessing;
