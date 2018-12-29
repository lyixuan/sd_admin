/*
* tipSucess，成功提示
* imgtype, 图片类型0：删除，1：上传
* */
import React, { Component } from 'react';
import styles from './step.css';
import sucessImg from '../../assets/sucessImg.png';
import delImg from '../../assets/delImg.png';

class stepSucess extends Component {
  render() {
    const { tipSucess, isDelImg } = this.props;
    return (
      <div className={styles.wrapSucess}>
        <div className={styles.imgSucess}>
          <img src={isDelImg === 'true' ? delImg : sucessImg} alt="" />
        </div>
        {tipSucess ? <div className={styles.tipSucess}> {tipSucess} </div> : null}
      </div>
    );
  }
}

export default stepSucess;
