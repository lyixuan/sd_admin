import React, { Component } from 'react';
import { Select } from 'antd';
import ModalDialog from '../../selfComponent/Modal/Modal';

const { Option } = Select;

class DialogPerformance extends Component {
  paramObj = {
    collegeId: '',
    keyYM: '',
  };
  clickModalOK = () => {
    this.props.fetchData(this.paramObj);
  };
  handleSelectChange1 = val => {
    this.paramObj.collegeId = val;
  };
  handleSelectChange2 = val => {
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
