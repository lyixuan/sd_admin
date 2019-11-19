import React from 'react';
import styles from './styles/footer.less';
import { SERVER_HOST } from '../utils/constants';
import request from '../utils/request';

const HOST_NEW2 = `${SERVER_HOST}/deskperfpcapi`;

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      footerName: '',
    };
    const that = this;
    request(`${HOST_NEW2}/globalInfo/getFooter`).then(resp => {
      if (resp && resp.code === 20000) {
        that.setState({
          footerName: resp.data.value,
        });
      }
    });
  }
  render() {
    return <div className={styles.footerLayout}>{this.state.footerName}</div>;
  }
}
