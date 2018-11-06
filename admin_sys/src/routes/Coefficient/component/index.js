import React, { PureComponent } from 'react';
//  import PropTypes from 'prop-types';
import { Button } from 'antd';
import { performanceType } from 'utils/dataDictionary';
import ItemDom from './item';
import style from './index.less';
import common from '../../Common/common.css';

class InputItem extends PureComponent {
  constructor(props) {
    super(props);
    const value = props.value || [];
    const itemList = this.mapOriginData(Array.isArray(value) ? value : []);
    this.state = {
      type: props.id,
      name: performanceType[props.id] || '',
      itemList,
    };
    this.initModel = {
      classKpi: null,
      groupKpi: null,
      id: null,
      levelLowerLimit: null,
      levelUpperLimit: null,
      levelValue: null,
      lowerClose: false,
      teacherCount: null,
      type: props.id,
      upperClose: false,
      index: 0,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || []),
      };
    }
    return null;
  }
  componentDidMount() {
    const { itemList } = this.state; // 数据默认一条,当数据小于一条时给予补足一条;
    if (itemList.length < 1) {
      this.addItem();
    }
  }
  mapOriginData = arr => {
    const list = Array.isArray(arr) ? arr : [];
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
    const { onChange } = this.props;
    const value = list;
    this.setState({ itemList: list });
    onChange(value);
  };

  changeInputValue = (key = '', item = {}, e) => {
    const target = e.currentTarget;
    const newObj = { ...item };
    if (!/\d+/.test(target.value) && target.value.length) {
      return;
    }
    newObj[key] = Number(target.value);
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
    const newAddObject = { ...this.initModel };
    const indexArr = itemList.map(list => list.index);
    newAddObject.index = indexArr.length > 0 ? Math.max.apply(null, indexArr) + 1 : 1;
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
  render() {
    const { name, itemList, type } = this.state;
    // const Dom=ItemDom({type:1});
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
              <ItemDom
                type={type}
                data={item}
                changeInputValue={this.changeInputValue}
                changeCheckboxValue={this.changeCheckboxValue}
              />
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
