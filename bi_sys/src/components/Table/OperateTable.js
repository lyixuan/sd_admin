import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './OperateTable.css';
import {  Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import {monthMean, weekMean, formatDate} from '../../utils/FormatDate'
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';
const now = new Date();
class OperateTable extends Component {
	constructor(props) {
        super(props);
         this.state = {
         	mean:'低于',
         	isLow:2
        }
    };
    selectFn(param){//请求接口
      let sendParams = {
        paramsObj:  {...this.props.Strick.paramsObj, ...param }
      }
      this.props.dispatch({
        type: 'Strick/fetch',
        payload: sendParams,
      })
    }
    onChange = (v)=>{
    	if(v){
    		this.setState({
    			mean:'高于',
    			isLow:1
    		})
    	}else {
    		this.setState({
    			mean:'低于',
    			isLow:true
    		})
    	}

    	 this.selectFn({splitLevel:this.state.isLow})
    }
	render() {
		let mean = this.state.mean;
	  	return (
	    <div className={styles.normal} id="operate">
	      	<Flex align="end" style={{height:'.5rem',padding:'16px 0 13px'}}>
	      	<p className={styles.data_title}>运营小助手</p>
		      <p className={styles.data_date}>{`${formatDate(weekMean(now).startTime)}-${formatDate(weekMean(now).endTime)}`}（周均）</p>
		    </Flex>
		    <Flex align="end" style={{lineHeight:'.8rem'}}>
		    	<p className={styles.data_tip}>以下项目得分{mean}集团均值，要注意哦~</p>
		      	 <div style={{ position: 'absolute',right: '.3rem',top:'.98rem', width:'1.3rem', height:'.4rem' }}>
			        <Switch
			          onChange={this.onChange}
			          checkedChildren={'高于均值'}
			          unCheckedChildren={'低于均值'}
			        />
			      </div>
		    </Flex>
	    </div>

	  );
	}
}
function mapStateToProps(Strick) {
  return Strick
}
export default connect(mapStateToProps)(OperateTable);
