import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { stringify } from 'qs';
import { parse } from 'url';
import { assignUrlParams } from '@/utils/utils';
import { history } from '@/index';
import ButtonBox from './buttonBox';
import styles from './index.less';

/*
*@params initFlagModal object   初始化参数非必填;   base string
*@params flag          string   用于储存值以及返回数据key
*@params clicktype     string   作用于button上面用于处理提交,撤销等事件(onSubmit,onReset)
*@params url           string   点击提交时的跳转以及将参数绑定到该url上面
*renderDom             element   默认传入onSubmit,当有此方法的时候再会显示onSubit按钮,同理onReset
*/

class FormPrams extends Component {
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    initFlagModal: PropTypes.object,
  };
  static defaultProps = {
    className: '',
    onSubmit: () => {},
    initFlagModal: {},
  };
  constructor(props) {
    super(props);
    this.initFlagModal = this.props.initFlagModal;
    this.flagKeyArr = []; // 用于储存flag值
  }

  componentDidMount() {
    this.initData();
  }
  onReset = () => {
    this.flagKeyArr.forEach(item => {
      this.initFlagModal[item] = null;
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
    const params = this.getUrlParams();
    const urlParams = this.assignUrlParams(params);
    this.flagKeyArr.forEach(item => {
      this.initFlagModal[item] = urlParams[item];
    });
    this.initFlagModal = this.filterEmptyUrlParams(this.initFlagModal);
    this.onSubmit();
  };
  assignUrlParams = (obj = {}) => {
    return assignUrlParams(this.props.initFlagModal || {}, obj);
  };

  handleChange = (e, originEvent) => {
    const flag = e.target.getAttribute('flag');
    this.initFlagModal[flag] = e.target.value;
    if (originEvent) {
      originEvent.call(null, e);
    }
  };

  saveData = initFlagModal => {
    const params = initFlagModal || this.initFlagModal;
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
      if (!newParams[i]) {
        delete newParams[i];
      }
    }
    return newParams;
  };
  checkoutComponentProps = child => {
    let addParams = {};
    const { initFlagModal } = this;
    if (child.props.flag) {
      //  form  表单输入值都有saveFlag
      const { flag } = child.props;
      this.flagKeyArr = [...this.flagKeyArr, flag];
      addParams.value = initFlagModal[flag] || child.props.value;
      addParams = Object.assign({}, addParams, this.resetOnChange(child));
    }
    if (child.props.clicktype) {
      addParams = Object.assign({}, addParams, this.bindButtonClick(child));
    }
    return addParams;
  };
  resetOnChange = child => {
    // rewrite onChange event
    return {
      onChange: e => this.handleChange(e, child.props.onChange),
    };
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
      let childrenItem = child.props.children;
      if (Array.isArray(child.props.children)) {
        childrenItem = this.cloneChildren(child.props.children);
      }
      const propsParams = this.checkoutComponentProps(child);
      return React.cloneElement(child, { children: childrenItem, ...propsParams });
    });
  };
  render() {
    const children1 = this.cloneChildren(this.props.children);
    return (
      <React.Fragment>
        {[...children1]}
        <div className={styles.buttonContainer}>
          <ButtonBox {...this.props} onSubmit={this.onSubmit} onReset={this.onReset} />
        </div>
      </React.Fragment>
    );
  }
}

export default FormPrams;
