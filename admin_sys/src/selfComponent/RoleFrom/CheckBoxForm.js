import React, { Component } from 'react';
import { Checkbox } from 'antd';
import styles from './RoleForm.css';

const CheckboxGroup = Checkbox.Group;

class CheckBoxForm extends Component {
  /*
  * 单选按钮事件
  * */
  onChange = (checkedList, checkAll, nodes, pid, gid, checkedVal) => {
    const newVal = nodes.filter(item1 => checkedVal.find(item2 => item2 === item1.id));

    this.getVal.isClick = true;
    if (newVal.length > 0) {
      // 选中，加上pid和gid
      this.getVal.checkAllObj[checkedList] = Array.from(new Set([...checkedVal, gid, pid]));
    } else {
      // 取消
      this.getVal.checkAllObj[checkedList] = [];
    }
    const newObjLen = this.getVal.checkAllObj[checkedList].length;
    this.getVal.checkAllObj[checkAll] = nodes.length === newObjLen - 2;
  };
  /*
  * 全选按钮事件
  * */
  onCheckAllChange = (grandId, nodes, allKey, listKey, e) => {
    this.getVal.isClick = true;
    const nodeIDs = []; //
    nodes.forEach(key => {
      nodeIDs.push(grandId);
      nodeIDs.push(key.id);
      nodeIDs.push(key.parentId);
    });
    this.getVal.checkAllObj[listKey] = e.target.checked ? Array.from(new Set(nodeIDs)) : [];
    this.getVal.checkAllObj[allKey] = e.target.checked;
  };

  getVal = {
    checkAllObj: this.props.checkAllObj,
    isClick: false,
  };
  render() {
    const { dataSource, grandId, isShowFooter, filterIds, getRoleIds } = this.props;
    const { name, checkAll, checkedList, id, nodes } = dataSource;
    let initVal = !getRoleIds
      ? []
      : filterIds.child.filter(item => getRoleIds.find(item1 => item === item1));

    const plainOptions = [];
    nodes.forEach(key => {
      plainOptions.push({ label: key.name, value: key.id, id });
    });
    if (!this.getVal.isClick) {
      if (initVal.length > 0) {
        initVal = [...initVal, grandId, id];
      }

      this.getVal.checkAllObj[checkAll] = Number(plainOptions.length) + 2 === initVal.length;
      this.getVal.checkAllObj[checkedList] = initVal;
    }
    this.props.getCheckObj(this.getVal.checkAllObj); // 传值给父级

    return (
      <div>
        <p className={styles.littleTitle}>{name}</p>
        {nodes.length === 0 ? null : (
          <div>
            <Checkbox
              onChange={this.onCheckAllChange.bind(this, grandId, nodes, checkAll, checkedList)}
              checked={this.getVal.checkAllObj[checkAll]}
              disabled={!(isShowFooter === 'true')}
              className={styles.checkBox}
            >
              全选
            </Checkbox>
            <CheckboxGroup
              options={plainOptions}
              value={this.getVal.checkAllObj[checkedList]}
              disabled={!(isShowFooter === 'true')}
              onChange={this.onChange.bind(this, checkedList, checkAll, nodes, id, grandId)}
              className={styles.checkboxGroup}
            />
          </div>
        )}
      </div>
    );
  }
}

export default CheckBoxForm;
