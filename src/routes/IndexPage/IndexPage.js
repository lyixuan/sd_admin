import React, { Component } from 'react';
import styles from './indexPage.less';
import homeImg from '../../assets/homeImg.png';
import homeText from '../../assets/homeText.png';

class IndexPage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <img src={homeImg} alt="首页" className={styles.homeImg} />
          <div className={styles.userDescription}>
            <img src={homeText} alt="首页文字" />
          </div>
        </div>
      </div>
    );
  }
}
// ceh
export default IndexPage;
