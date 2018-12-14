// 自定义弹框
import React from 'react';
import { Radio, Select, DatePicker } from 'antd';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

export default class ModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioVal: 1,
      dateTime: 1,
      college: 1,
    };
  }
  onRadioChange = e => {
    this.setState({ radioVal: e.target.value });
    this.props.updateModalData({ ...this.state, radioVal: e.target.value });
  };
  // 点击选择添加不可选时间
  onDateChange = (date, dateString) => {
    this.setState({ dateTime: dateString });
    this.props.updateModalData({ ...this.state, dateTime: dateString });
  };
  render() {
    const { disabledDate } = this.props;
    return (
      <>
        <>
          <span>底表类型：</span>
          <Radio.Group
            onChange={this.onRadioChange}
            value={this.state.radioVal}
            style={{ width: '230px' }}
          >
            <Radio value={1} style={{ marginRight: '40px' }}>
              学分底表
            </Radio>
            <Radio value={2} style={{ marginRight: '0' }}>
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
          <Select placeholder="全部" style={{ width: 230, height: 32 }}>
            <Option value="全部">全部</Option>
          </Select>
        </>
      </>
    );
  }
}
