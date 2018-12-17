// 自定义弹框
import React from 'react';
import { Radio, Select, DatePicker } from 'antd';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

export default class ModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomDate: '2018-12-14',
      collegeId: 108,
      type: 0,
    };
  }
  onRadioChange = e => {
    this.setState({ type: e.target.value });
    this.props.updateModalData({ ...this.state, type: e.target.value });
  };
  // 点击选择添加不可选时间
  onDateChange = (date, dateString) => {
    this.setState({ bottomDate: dateString });
    this.props.updateModalData({ ...this.state, bottomDate: dateString });
  };

  render() {
    const { disabledDate, selectOption } = this.props;
    const hash = {};
    const options = selectOption.reduce((preVal, curVal) => {
      if (!hash[curVal.collegeId]) {
        hash[curVal.collegeId] = true;
        preVal.push(curVal);
      }
      return preVal;
    }, []);
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
        <>
          <span>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院：</span>
          <Select placeholder="请选择学院" style={{ width: 230, height: 32 }}>
            {options.map(item => (
              <Option key={item.collegeId} value={item.collegeId}>
                {item.collegeName}
              </Option>
            ))}
          </Select>
        </>
      </>
    );
  }
}
