import React, { Component } from 'react';
import styles from './indexPage.less';
import indexImg from '../../assets/indexImg.png';

class IndexPage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.userDescription}>
          <h3>-欢迎使用小德BI系统-</h3>
          <p>请在左侧导航栏中选择您想去的页面</p>
        </div>
        <img src={indexImg} alt="首页" className={styles.indexImg} />
      </div>
    );
  }
}

export default IndexPage;
