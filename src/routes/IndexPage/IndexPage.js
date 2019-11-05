import React, { Component } from 'react';
import styles from './indexPage.less';
import homeImg from '../../assets/homeImg.png';
import homeText from '../../assets/homeText.png';
import { INDEX_HOST } from '../../utils/constants';

class IndexPage extends Component {
  componentDidMount() {
    if (INDEX_HOST) {
      window.location.href = `${INDEX_HOST}/inspector${window.location.href}`;
    }
  }

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
