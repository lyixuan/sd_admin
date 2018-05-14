import React, {Component} from 'react';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import styles from './Home.css';
import CarouseComponent from '../components/Carouse/Carouse';
import TabComponent from '../components/Mine/Mine';
import ListComponent from '../components/Table/OperateTable';
import Strick from '../components/Strick/Strick';
import top from '../assets/top.svg'
import $ from 'jquery';


function backTop(minHeight) {
  $('html, body').animate({scrollTop: 0}, 700)

}

class Home extends Component {
  constructor(props) {
    super(props);
  };

  componentWillMount() {

    this.props.dispatch({          //此数据在其他请求中会用到,所以放在will里面请求
      type: 'index/fetch',
      payload: {
      },
    });
  }

  componentDidMount() {
    setTimeout(() => {
      // this.suctionTop()
    }, 1000);
  }
  componentWillReceiveProps(nextProps) {       //待解决
  }


  suctionTop = () => {
    // $(window).scroll(function () {
    //   var windowH = $(window).scrollTop()
    //   let dataH = $("#dataCenter") ? ($("#dataCenter").offset().top - windowH ) : null;
    //   let operateH = $("#operate") ? ($("#operate").offset().top - windowH ) : null;
    //
    //   if (dataH < 0 && operateH > 0) {
    //     $('#dataTop').fadeIn(100)
    //   } else {
    //     $('#dataTop').fadeOut(100)
    //   }
    //
    //   if (windowH > 2000) {
    //     $('#backTopBtn').fadeIn(100)
    //   } else {
    //     $('#backTopBtn').fadeOut(100)
    //   }
    // })
  }

  topPosition(v) {
    if (v == 'dataCenter') {
      $('html, body').animate({scrollTop: $("#dataCenter").offset().top}, 700)
    }
    if (v == 'operateCenter') {
      $('html, body').animate({scrollTop: $("#operate").offset().top}, 700)
    }
  }

  render() {
    return (this.props.index.userInfo?
      <div className={styles.normal}>
        <div className={styles.topBarCls} id="dataTop" onClick={() => {
          this.topPosition('dataCenter')
        }}>03.20周五 - 03.22周日 l 周均数据 l 正面均分 l 排名 l 家族 l 集团排名
        </div>
        <div className={styles.topBarCls} id="operateTop" onClick={() => {
          this.topPosition('operateCenter')
        }}>03.23周五 - 03.22周日 l 周均数据 l 正面均分 l 排名 l 家族 l 集团排名
        </div>
        <CarouseComponent/>
        <TabComponent/>
        <ListComponent/>
        {/*<Strick/>*/}
        <div className={styles.goTopCls} onClick={backTop} id="backTopBtn"><img src={top}/></div>
      </div>:<div>loading...</div>
    );
  }

}

export default connect(({index}) => ({index}))(Home);
