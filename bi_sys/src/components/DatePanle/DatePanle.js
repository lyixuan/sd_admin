import React,{Component} from 'react';
import styles from '../../routes/Credit/CreditDetails.css';
import  Select, { Option } from 'rc-select';
import { Flex,Calendar } from 'antd-mobile';
import {monthMean, weekMean, formatDate} from '../../utils/FormatDate'
import 'antd-mobile/dist/antd-mobile.css';//暂时使用
import 'rc-select/assets/index.css';
const now = new Date();
class DatePanle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTxt:""
    }
  }
  componentWillMount(){
    if (this.props.startTime&&this.props.endTime) {
      this._formatDateTxt(this.props.startTime,this.props.endTime);
    }
  }
  //自定义下拉菜单
  renderBtn(zh, config = {}) {
    return( <span>{zh}</span> );
  }
  //日期选择取消
  onCancel(){
	    this._hideCalendar();
	}
  //日期选择确认
  onConfirm = (startTime, endTime) => {
    this._formatDateTxt(startTime,endTime);
	  this._hideCalendar();
    this.callback(startTime,endTime);
	}
  //下拉菜单选择
  onSelect(val){
    if(val == 1){
      let startTime = weekMean(now).startTime;
      let endTime = weekMean(now).endTime;
      this._formatDateTxt(startTime,endTime);
      this.callback(startTime,endTime);
    }else if(val == 2){
      let startTime = monthMean(now).startTime;
      let endTime = monthMean(now).endTime;
      this._formatDateTxt(startTime,endTime);
      this.callback(startTime,endTime);
    }else if(val == 3){
      this._showCalendar();
    }
  }
  //组件回掉
  callback(startTime,endTime){
    if(this.props.onConfirm)
      this.props.onConfirm(startTime,endTime);
  }
  _formatDateTxt(startTime,endTime){
    this.setState({ dateTxt:`${formatDate(startTime)}-${formatDate(endTime)}` });
  }
  _showCalendar(){
    this.setState({ show:true });
    document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
  }
  _hideCalendar(){
    this.setState({ show:false });
    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
  }
  render(){
    return (
      <Flex justify="arround" style={{height:'0.56rem',padding: '0.28rem 0.3rem 0.38rem', backgroundColor: '#fff'}}>
          <p className={styles.data_date}>{this.state.dateTxt}</p>
          <div className={styles.selectCls}>
        <Select
              defaultValue="周均数据"
              optionLabelProp="children"
              style={{ width:"1.88rem" ,height:'.56rem'}}
              onChange={(val)=>{this.onSelect(val)}}>
              <Option value="1">周均数据</Option>
              <Option value="2">月均数据</Option>
              <Option value='3'>{this.renderBtn('自定义数据', '时间范围选择')}</Option>
            </Select>
          </div>
          <Calendar visible={this.state.show} infiniteOpt={true}
	          onCancel={()=>{this.onCancel()}}
	          onConfirm={(startTime,endTime)=>{this.onConfirm(startTime,endTime)}} />
      </Flex>
    )
  }
}

export default DatePanle;
