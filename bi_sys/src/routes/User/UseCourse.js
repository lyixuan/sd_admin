import React from 'react';
import { connect } from 'dva';
import styles from './UseCourse.css';

function UseCourse() {
  return (
    <div className={styles.normal}>
      用户教程,纯展示页面
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(UseCourse);
