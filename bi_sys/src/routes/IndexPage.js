import React from 'react';
import {connect} from 'dva';
import styles from './IndexPage.css';
import {Link} from 'dva/router';
import {List,Button} from 'antd-mobile';
// import CylinderEcharts from '../components/Chart/BarEcharts';
// import HengBarEcharts from '../components/Chart/HengBarEcharts';
// import LineEcharts from '../components/Chart/LineEcharts';


const Item = List.Item;


class IndexPage extends React.Component {
  componentDidMount() {
    setTimeout(() => (
      this.props.dispatch({
        type: 'example1/fetch',
      })
  ),
    3000
  )


  }
  render() {
    console.log(this)
    return (
      <div className={styles.normal}>
        <div>
          <List renderHeader={() => 'Basic Style'} className="my-list">
          <Button>ceshi</Button>  
            <Item extra={'用户图标'}><Link to="/UserIndex">个人中心图标点ddddd击进入个人中心页</Link></Item>
            <Item extra={'学分详情'}><Link to="/CreditIndex">点击图表进入学分详情页</Link></Item>
          </List>
        </div>
        <div>
          <h3>图标测试</h3>
          {/* <CylinderEcharts/> */}
          {/*<HengBarEcharts />*/}
          {/*<LineEcharts/>*/}
        </div>
      </div>
    )
  }
}

function mapStateToProps({example1}) {
  return {
    example1
  };
}

export default connect(mapStateToProps)(IndexPage);
