import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { stringify } from 'qs';
import { parse } from 'url';
import moment from 'moment';
import { assignUrlParams } from '@/utils/utils';
import { history } from '@/index';
import ButtonBox from './buttonBox';
import styles from './index.less';

/*
*@params modal         object  初始化参数非必填;   base string
*@params flag          string   用于储存值以及返回数据key
*@params clicktype     string   作用于button上面用于处理提交,撤销等事件(onSubmit,onReset)
*@params url           string   点击提交时的跳转以及将参数绑定到该url上面
*renderDom             element   默认传入onSubmit,当有此方法的时候再会显示onSubit按钮,同理onReset
*/

class FormPrams extends Component {
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    modal: PropTypes.object,
  };
  static defaultProps = {
    className: '',
    onSubmit: () => {},
    modal: {},
  };
  constructor(props) {
    super(props);
    this.state = {
      isUpdate: false, // 用于强制更新组件
    };
    this.modal = this.props.modal || {};
    this.flagKeyArr = []; // 用于储存flag值
  }

  componentDidMount() {
    this.initData();
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.modal) !== JSON.stringify(this.props.modal)) {
      this.modal = this.props.modal;
    }
  }
  onReset = () => {
    this.flagKeyArr.forEach(item => {
      this.modal[item] = null;
    });
    this.saveData();
  };
  onSubmit = () => {
    this.saveData();
  };
  getUrlParams = () => {
    const { location = {} } = history;
    return parse(location.search, true).query || {};
  };
  initData = () => {
    let params = this.getUrlParams();
    if (this.props.modal) {
      params = this.assignUrlParams(params);
    }
    this.flagKeyArr.forEach(item => {
      this.modal[item] = params[item];
    });
    this.modal = this.filterEmptyUrlParams(this.modal);
    this.onSubmit();
  };
  assignUrlParams = (obj = {}) => {
    return assignUrlParams(this.props.modal || {}, obj);
  };

  handleChange = (e, originEvent) => {
    const flag = e.target.getAttribute('flag');
    this.modal[flag] = e.target.value;
    if (originEvent) {
      originEvent.call(null, e);
    }
  };
  selectChange = (value, flag, originEvent) => {
    this.modal[flag] = value;
    console.log(this.modal[flag], value);
    if (originEvent) {
      originEvent.call(null, value);
    }
    this.setState({
      isUpdate: !this.state.isUpdate,
    });
  };
  pickerWrapperChange = (value, strData, flag, originEvent) => {
    this.modal[flag] = strData || '';
    if (originEvent) {
      originEvent.call(null, value, strData);
    }
    this.setState({
      isUpdate: !this.state.isUpdate,
    });
  };

  saveData = modal => {
    const params = modal || this.modal;
    if (this.props.onSubmit) {
      this.props.onSubmit(params);
    }
    this.saveParamsInUrl(params);
  };
  saveParamsInUrl = query => {
    const pathname = this.props.url || history.location.pathname;
    const originSearch = parse(history.location.search, true).query || null;
    let paramsObj = pathname === history.location.pathname ? { ...originSearch, ...query } : query;
    paramsObj = this.filterEmptyUrlParams(paramsObj);
    history.replace({
      pathname,
      search: stringify(paramsObj),
    });
  };
  filterEmptyUrlParams = params => {
    const newParams = params || {};
    for (const i in newParams) {
      if (newParams[i] === undefined) {
        delete newParams[i];
      }
    }
    return newParams;
  };
  checkoutComponentProps = child => {
    let addParams = {};
    const { modal } = this;
    if (child.props.flag) {
      //  form  表单输入值都有flag
      const { flag } = child.props;
      this.flagKeyArr = [...this.flagKeyArr, flag];
      addParams.value = modal[flag] === undefined ? child.props.value : modal[flag];
      addParams = Object.assign({}, addParams, this.resetOnChange(child));
    }
    if (child.props.clicktype) {
      addParams = Object.assign({}, addParams, this.bindButtonClick(child));
    }
    return addParams;
  };

  resetOnChange = child => {
    // rewrite onChange event
    return this.checkoutElementType(child);
  };
  checkoutElementType = child => {
    const elementType = typeof child.type;
    const type = elementType === 'function' ? child.type.name : child.type;

    const returnObj = {};
    let dateValue = null;
    switch (type.toLowerCase()) {
      case 'input':
        returnObj.onChange = e => this.handleChange(e, child.props.onChange);
        break;
      case 'select':
        returnObj.onChange = value =>
          this.selectChange(value, child.props.flag, child.props.onChange);
        break;
      case 'pickerwrapper':
        dateValue = this.modal[child.props.flag] || child.props.value;
        returnObj.value = dateValue ? moment(dateValue) : dateValue;
        returnObj.onChange = (value, strData) =>
          this.pickerWrapperChange(value, strData, child.props.flag, child.props.onChange);
        break;
      default:
        break;
    }
    return returnObj;
  };
  bindButtonClick = child => {
    //  bind form onChange event
    const { clicktype = null } = child.props;
    const event = this[clicktype];
    if (!event) {
      throw new Error('请传入正确的clicktype');
    }
    return {
      onClick: event,
    };
  };
  cloneChildren = children => {
    return React.Children.map(children, child => {
      let childrenItem = child.props.children || null;
      if (typeof child.props.children === 'object') {
        childrenItem = this.cloneChildren(child.props.children);
      }
      const propsParams = this.checkoutComponentProps(child);
      return React.cloneElement(child, { children: childrenItem, ...propsParams });
    });
  };
  render() {
    const children = this.cloneChildren(this.props.children);
    return (
      <div className={styles.formCls}>
        {[...children]}
        <div className={styles.buttonContainer}>
          <ButtonBox {...this.props} onSubmit={this.onSubmit} onReset={this.onReset} />
        </div>
      </div>
    );
  }
}

export default FormPrams;
