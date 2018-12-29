import React from 'react';
import styles from './exception.less';
import img from '../../assets/error.png';

export default class Exception extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <img src={img} alt="error" />
          <h3>{this.props.message}</h3>
        </div>
      </div>
    );
  }
}
