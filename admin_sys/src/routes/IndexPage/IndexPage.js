import React, { Component } from 'react';
import styles from './indexPage.less';
import indexImg from '../../assets/indexImg.png';
import ContentLayout from '../../layouts/ContentLayout';
import ball from '../../assets/arch.png';
import right from '../../assets/indexPage.png';

class IndexPage extends Component {
  render() {
    const content = (
      <div className={styles.container}>
        <div className={styles.userDescription}>
          <h3>欢迎使用小德BI系统</h3>
          <p>请在左侧导航栏中选择您想去的页面</p>
        </div>
        <img src={ball} alt="ball" className={styles.backgroundBall} />
        <img src={indexImg} alt="首页" className={styles.indexImg} />
        <img src={right} alt="首页" className={styles.backgroundRight} />
      </div>
    );
    return <ContentLayout contentForm={content} />;
  }
}

export default IndexPage;
