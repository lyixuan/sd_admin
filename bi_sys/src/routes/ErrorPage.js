import React from 'react';
import { connect } from 'dva';
import styles from './ErrorPage.css';
import errorimg from '../assets/error.png'

function ErrorPage() {
  return (
     <div className={styles.normal}>
        <div className={styles.heightdiv}>
        </div>
        <div className={styles.divimg}>
          <img className={styles.imgcss} src={errorimg} alt='error'/>
        </div>
        <div className={styles.wordstyle}>
          <div className={styles.wordstyle1}>
            你没有权限访问此页面，或权限设置有误。
          </div>
          <div className={styles.wordstyle2}>
            请联系运营专员：假想名 集团运营中心
          </div>
          <div className={styles.wordstyle3}>
            xxx@sunlands.com
          </div>
        </div>
   </div>
  );
}
function mapStateToProps() {
  return {
   
  };
}
export default connect(mapStateToProps)(ErrorPage);
