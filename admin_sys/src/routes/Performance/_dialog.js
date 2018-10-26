import React, { Component } from 'react';
import { Select } from 'antd';
import moment from 'moment';
import ModalDialog from '../../selfComponent/Modal/Modal';

const { Option } = Select;

class DialogPerformance extends Component {
  paramObj = {
    type: '',
    keyYM: '',
    collegeName: '',
    dateTime: '',
  };
  clickModalOK = () => {
    this.props.fetchData(this.paramObj);
  };
  handleSelectChange1 = (val, options) => {
    const opsObj = options.props || {};
    this.paramObj.collegeName = opsObj.children || '';
    this.paramObj.type = val;
  };
  handleSelectChange2 = val => {
    const formatStr = 'YYYY-MM';
    this.paramObj.dateTime =
      val === '1'
        ? moment().format(formatStr)
        : moment()
            .subtract(1, 'month')
            .format(formatStr);
    this.paramObj.keyYM = val;
  };
  renderContent = collegeGroup => {
    return (
      <div>
        <div>
          <span>导出范围：</span>
          <Select
            placeholder="导出范围"
            style={{ width: 230, height: 32 }}
            onChange={this.handleSelectChange1}
          >
            {Object.keys(collegeGroup).map(item => (
              <Option value={item} key={item}>
                {collegeGroup[item]}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ marginTop: '16px' }}>
          <span>选择时间：</span>
          <Select
            placeholder="选择时间"
            style={{ width: 230, height: 32 }}
            onChange={this.handleSelectChange2}
          >
            <Option value="0" key={0}>
              上个月
            </Option>
            <Option value="1" key={1}>
              本月
            </Option>
          </Select>
        </div>
      </div>
    );
  };
  render() {
    const { collegeGroup, title, showModal, visible } = this.props;
    return (
      <ModalDialog
        title={title}
        visible={visible}
        modalContent={this.renderContent(collegeGroup)}
        showModal={showModal}
        clickOK={() => this.clickModalOK()}
      />
    );
  }
}
export default DialogPerformance;
