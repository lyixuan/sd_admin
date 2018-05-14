import React, { Component }  from 'react';
import { connect } from 'dva';
import styles from './Mine.css';
import MineComponent from '../components/Mine/Mine';

function Mine() {
  return (
    <div className={styles.normal}>
      <MineComponent />
    </div>
  );
}



export default connect()(Mine);
