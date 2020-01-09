import React, { Component } from 'react';
import styles from './indexPage.less';
import homeImg from '../../assets/homeImg.png';
import homeText from '../../assets/homeText.png';
import { INDEX_HOST } from '../../utils/constants';
import topImage from '../../assets/indexPage/top-image.png';
import centerImage from '../../assets/indexPage/center-image.png';
import bottomImage from '../../assets/indexPage/bottom-image.png';

class IndexPage extends Component {
  componentDidMount() {
    if (INDEX_HOST) {
      window.location.href = `${INDEX_HOST}/inspector/indexPage`;
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <img src={topImage} alt="图片" className={styles.top}/>
          <div className={styles.center}>
            <img src={centerImage} alt="图片" className={styles.centerImage}/>
          </div>
          <img src={bottomImage} alt="图片" className={styles.bottom}/>
        </div>
      </div>
    );
  }
}
// ceh
export default IndexPage;
