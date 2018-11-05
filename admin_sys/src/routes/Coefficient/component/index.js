import React, { PureComponent } from 'react';
//  import PropTypes from 'prop-types';
import { Input, Button, Checkbox } from 'antd';
import style from './index.less';
import common from '../../Common/common.css';

class InputItem extends PureComponent {
  constructor(props) {
    super(props);
    const value = props.value || {};
    const itemList = this.mapOriginData(Array.isArray(value.list) ? value.list : []);

    this.state = {
      name: value.name || '',
      itemList,
    };
  }
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }
  mapOriginData = () => {
    const { value = {} } = this.props;
    const list = Array.isArray(value.list) ? value.list : [];
    return list.map((item, index) => ({
      ...item,
      index,
    }));
  };

  changeItemValue = obj => {
    const { itemList } = this.state;
    for (const item in itemList) {
      if (obj.index === itemList[item].index) {
        itemList[item] = obj;
        break;
      }
    }
    this.handleChange(itemList);
  };
  handleChange = list => {
    const { value, onChange } = this.props;
    value.list = list;
    this.setState({ itemList: list });
    onChange(value);
  };

  changeInputValue = (key = '', item = {}, e) => {
    const target = e.currentTarget;
    const newObj = { ...item };
    if (!/\d+/.test(target.value) && target.value.length) {
      return;
    }
    newObj[key] = target.value;
    this.changeItemValue(newObj);
  };
  changeCheckboxValue = (item = {}, e) => {
    const { target = {} } = e;
    const { checked, dataname } = target;
    const newObj = { ...item };
    newObj[dataname] = checked;
    this.changeItemValue(newObj);
  };
  addItem = () => {
    // 添加在原有的数据结构下进行添加,原有数据默认会有一条数据
    const { itemList = [] } = this.state;
    if (itemList.length < 1) {
      console.warn('数据异常');
      return;
    }
    const firstItem = itemList.slice(0, 1)[0] || {};
    const newAddObject = { ...firstItem };
    for (const item in newAddObject) {
      if (item === 'index') {
        newAddObject[item] = Math.max.apply(null, itemList.map(list => list.index)) + 1;
      } else {
        newAddObject[item] = null;
      }
    }
    itemList.push(newAddObject);
    this.handleChange(itemList);
  };
  deleteItem = item => {
    const { itemList = [] } = this.state;
    if (itemList.length === 1) {
      console.warn('默认一条数据');
      return;
    }
    itemList.splice(itemList.findIndex(list => list.index === item.index), 1);
    this.handleChange(itemList);
  };

  renderInputItem = item => {
    return (
      <span>
        <Input
          className={style.input}
          placeholder="0"
          onChange={e => this.changeInputValue('beginVal', item, e)}
          value={item.beginVal}
        />
        <span className={style.percent}>%</span>
        <span className={style.checkBox}>
          <Checkbox
            className={style.radio}
            dataname="isEqBeginVal"
            onChange={e => this.changeCheckboxValue(item, e)}
          />
          <span>闭区间</span>
        </span>
      </span>
    );
  };
  renderBaserNumber = (item = {}) => {
    return (
      <span className={style.baseNumCotainer}>
        <span>基数:</span>
        <Input
          className={style.input}
          placeholder="0"
          dataname="baseVal"
          value={item.baseVal}
          onChange={e => this.changeInputValue('baseVal', item, e)}
        />
        <span>元</span>
      </span>
    );
  };

  render() {
    const { name, itemList } = this.state;
    return (
      <div className={style.itemCotainer}>
        <div className={style.itemHead}>
          <span className={style.itemName}>{name}</span>
          <Button
            type="primary"
            className={common.searchButton}
            style={{ float: 'right', margin: '25px 55px 0 0' }}
            onClick={this.addItem}
          >
            添加区间
          </Button>
        </div>
        <ul className={style.formCotainer}>
          {itemList.map(item => (
            <li key={item.index}>
              {/* 开始区间 */}
              {this.renderInputItem(item)}
              {/* <Input
      className={style.input}
      placeholder="0"
      onChange={(e)=>(this.changeInputValue('beginVal',item,e))}
      value={item.beginVal}
     
    />
    <span className={style.percent}>%</span>
    <span className={style.checkBox}>
      <Checkbox className={style.radio} 
      dataname="isEqBeginVal" 
      onChange={(e)=>(this.changeCheckboxValue(item,e))} />
      <span>闭区间</span>
    </span> */}
              <span className={style.breakLine}>~</span>
              {/* 结束区间 */}
              <Input
                className={style.input}
                placeholder="0"
                value={item.endVal}
                onChange={e => this.changeInputValue('endVal', item, e)}
              />
              <span className={style.percent}>%</span>
              <span className={style.checkBox}>
                <Checkbox
                  className={style.radio}
                  dataname="isEqEndVal"
                  onChange={e => this.changeCheckboxValue(item, e)}
                />
                <span>闭区间</span>
              </span>
              {/* 基数 */}
              {this.renderBaserNumber(item)}
              <Button
                type="default"
                className={common.cancleButton}
                onClick={() => this.deleteItem(item)}
                style={{ float: 'right', margin: '0 55px 0 0' }}
              >
                删除
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
export default InputItem;
