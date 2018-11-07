import React from 'react';
import { Input, Checkbox } from 'antd';
import style from './index.less';

export default class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type || 1,
    };
  }
  changeInputValue = (...argument) => {
    if (this.props.changeInputValue) {
      this.props.changeInputValue(...argument);
    }
  };
  changeCheckboxValue = (...argument) => {
    if (this.props.changeInputValue) {
      this.props.changeCheckboxValue(...argument);
    }
  };
  switchDom = type => {
    switch (type) {
      case '1': // 人均在服学院排名比（基数）- 自考
        return this.renderType1('基数');
      case '2': // 人均在服学院排名比（基数）- 壁垒
        return this.renderType1('基数');
      case '3': // 管理规模（系数）
        return this.renderType2('系数');
      case '4': // 日均学分排名比（系数）- 自考
        return this.renderType1('系数');
      case '5': // 日均学分排名比（系数）- 壁垒
        return this.renderType1('系数');
      case '6': // 人均在服学院排名比（基数）
        return this.renderType1('基数');
      case '7': // 日均学分排名比（系数）
        return this.renderType1('系数');
      case '8': // 绩效比例
        return this.renderType3();
      default:
        break;
    }
  };
  renderInput = (obj = {}, keyName, classname = '') => {
    return (
      <Input
        className={`${style.input} ${classname}`}
        placeholder="0"
        dataname={keyName}
        value={obj[keyName]}
        onChange={e => this.changeInputValue(keyName, obj, e)}
      />
    );
  };
  renderCheckBox = (obj = {}, keyName, classname = '') => {
    return (
      <Checkbox
        className={`${style.radio} ${classname}`}
        dataname={keyName}
        checked={obj[keyName]}
        onChange={e => this.changeCheckboxValue(obj, e)}
      />
    );
  };

  renderBaserNumber = (item = {}, baseName = '') => {
    return (
      <span className={style.baseNumCotainer}>
        <span className={style.textCls}>{baseName}</span>
        {this.renderInput(item, 'levelValue')}
        <span>{`${baseName === '基数' ? ' 元' : ''}`}</span>
      </span>
    );
  };
  renderType1 = baseName => {
    const item = this.props.data || {};
    return (
      <div className={style.valueItem}>
        {this.renderInput(item, 'levelLowerLimit')}
        <span className={style.percent}>%</span>
        <span className={style.checkBox}>
          {this.renderCheckBox(item, 'lowerClose')}
          <span>闭区间</span>
        </span>
        <span className={style.breakLine}>~</span>
        {this.renderInput(item, 'levelUpperLimit')}
        <span className={style.percent}>%</span>
        <span className={style.checkBox}>
          {this.renderCheckBox(item, 'upperClose')}
          <span>闭区间</span>
        </span>
        {this.renderBaserNumber(item, baseName)}
      </div>
    );
  };
  renderType2 = baseName => {
    const item = this.props.data || {};
    return (
      <div className={style.valueItem}>
        {this.renderInput(item, 'levelLowerLimit')}
        <span className={style.checkBox}>
          {this.renderCheckBox(item, 'lowerClose')}
          <span>闭区间</span>
        </span>
        <span className={style.breakLine}>~</span>
        {this.renderInput(item, 'levelUpperLimit')}

        <span className={style.checkBox}>
          {this.renderCheckBox(item, 'upperClose')}
          <span>闭区间</span>
        </span>
        {this.renderBaserNumber(item, baseName)}
      </div>
    );
  };
  renderType3 = () => {
    const item = this.props.data || {};
    return (
      <div className={style.valueItem}>
        <div className={style.inlineCls}>
          <span className={style.textCls}>组内老师人数</span>
          {this.renderInput(item, 'teacherCount')}
        </div>
        <div className={style.inlineCls}>
          <span className={style.textCls}>运营长绩效</span>
          {this.renderInput(item, 'groupKpi')} %
        </div>
        <div className={style.inlineCls}>
          <span className={style.textCls}>班主任绩效</span>
          {this.renderInput(item, 'classKpi')} %
        </div>
      </div>
    );
  };

  render() {
    const { type = '' } = this.state;
    return this.switchDom(type);
  }
}
