import React, { Component } from 'react';
//  import PropTypes from 'prop-types';
import { Input, Button, Radio } from 'antd';
import style from './index.less';
import common from '../../Common/common.css';

class InputItem extends Component {
  handleChange = () => {
    const { value, onChange, id } = this.props;
    // const newValue = [...value];
    // newValue[index] = e.target.value;
    console.log(value, id, onChange);
    // onChange(value)
  };
  renderInputItem = () => {
    return (
      <span>
        <Input className={style.input} />
        <span>%</span>
        <Radio className={style.radio} />
        <span>闭区间</span>
      </span>
    );
  };
  renderBaserNumber = () => {
    return (
      <span>
        <span>基数:</span>
        <Input className={style.input} />
        <span>元</span>
      </span>
    );
  };

  render() {
    console.log(this.props);
    return (
      <div className={style.itemCotainer}>
        <div className={style.itemHead}>
          <span className={style.itemName}>人均再付学员排比</span>
          <Button
            type="primary"
            className={common.searchButton}
            style={{ float: 'right', margin: '25px 55px 0 0' }}
          >
            添加区间
          </Button>
        </div>
        <div className={style.formCotainer}>
          {this.renderInputItem()}
          <span>~</span>
          {this.renderInputItem()}
          {this.renderBaserNumber()}
          <Button
            type="default"
            className={common.cancleButton}
            style={{ float: 'right', margin: '25px 55px 0 0' }}
          >
            删除
          </Button>
        </div>

        <Input onChange={() => this.handleChange(2)} />
      </div>
    );
  }
}
InputItem.defaultProps = {
  value: {},
};
export default InputItem;
