// 自定义弹框
import React from 'react';
import { Radio, Select, DatePicker } from 'antd';
import { DATA_ANALYST_ID } from '../../utils/constants';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

export default class ModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomDate: '',
      collegeId: null,
      type: 0,
    };
  }
  // 底表类型选择
  onRadioChange = e => {
    this.setState({ type: e.target.value });
    this.props.updateModalData({ ...this.state, type: e.target.value });
  };
  // 底表时间选择
  onDateChange = (date, dateString) => {
    this.setState({ bottomDate: dateString });
    this.props.updateModalData({ ...this.state, bottomDate: dateString });
  };
  // 学院选择
  onSelectChange = val => {
    this.setState({ collegeId: val });
    this.props.updateModalData({ ...this.state, collegeId: val });
  };

  isDataAnalyst = false;
  // 判断是否是数据分析师
  isDataAnalystFn = () => {
    const { authList } = this.props;
    authList.map(item => {
      if (Number(item.id) === Number(DATA_ANALYST_ID)) {
        this.isDataAnalyst = true;
        return this.isDataAnalyst;
      }
      return this.isDataAnalyst;
    });
    return this.isDataAnalyst;
  };
  // 过滤数据
  selectOptions = () => {
    const { selectOption } = this.props;
    const hash = {};
    return selectOption.reduce((preVal, curVal) => {
      if (!hash[curVal.collegeId]) {
        hash[curVal.collegeId] = true;
        preVal.push(curVal);
      }
      return preVal;
    }, []);
  };
  render() {
    const { disabledDate } = this.props;

    const options = this.selectOptions();
    const isDataAnalyst = this.isDataAnalystFn();
    this.props.isDataAnalyst(isDataAnalyst);

    return (
      <>
        <>
          <span>底表类型：</span>
          <Radio.Group
            onChange={this.onRadioChange}
            value={this.state.type}
            style={{ width: '230px' }}
          >
            <Radio value={0} style={{ marginRight: '40px' }}>
              学分底表
            </Radio>
            <Radio value={1} style={{ marginRight: '0' }}>
              预估分底表
            </Radio>
          </Radio.Group>
        </>
        <div style={{ margin: '17px auto' }}>
          <span>底表时间：</span>
          <DatePicker
            format={dateFormat}
            disabledDate={disabledDate}
            style={{ width: 230, height: 32 }}
            onChange={this.onDateChange}
          />
        </div>
        {!isDataAnalyst ? null : (
          <>
            <span>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院：</span>
            <Select
              placeholder="请选择学院"
              onChange={this.onSelectChange}
              style={{ width: 230, height: 32 }}
            >
              {options.map(item => (
                <Option key={item.collegeId} value={item.collegeId}>
                  {item.collegeName}
                </Option>
              ))}
            </Select>
          </>
        )}
      </>
    );
  }
}
