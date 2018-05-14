import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import styles from './UserIndex.css';
import {List} from 'antd-mobile';
import introduction from '../../assets/introduction.png'
import opinion from '../../assets/opinion.png'
import rightarrow from '../../assets/rightarrow.png'


//测试
import GroupList from '../../components/GroupList';

//待解决
// const Item = List.Item;
//待解决
// const Brief = Item.Brief;
// 待解决img  alt问题
function UserIndex() {
  return (
    <div className={styles.normal}>
  <div className={styles.header}>
        <div className={styles.headerrightimg}>
          <img className={styles.imgopinion} src={introduction} alt=""/>
        </div>
        <div className={styles.headertitle}>
        <Link to="UseCourse" className={styles.title} >使用教程</Link>
        </div>
        <div className={styles.headerleftimg}>
         <Link to="UseCourse"  ><img className={styles.imgarrow} src={rightarrow} alt=""/></Link>
        </div>
      </div>
      <div className={styles.divsegmentingline}>
        <div className={styles.segmentingline}></div>
      </div>
      <div className={styles.header}>
        <div className={styles.headerrightimg}>
          <img className={styles.imgopinion} src={opinion} alt=""/>
        </div>
        <div className={styles.headertitle}>
            <Link to="UseOpinion" className={styles.title} >意见/反馈</Link>
        </div>
        <div className={styles.headerleftimg}>
        <Link to="UseOpinion"><img className={styles.imgarrow} src={rightarrow} alt=""/></Link>
        </div>
      </div>
      <GroupList familyType="selfExam"/>
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(UserIndex);
