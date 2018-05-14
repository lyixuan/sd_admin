import React,{Component} from 'react';
import { Calendar} from 'antd-mobile';
import styles from './Calendar.css';
import enUS from 'antd-mobile/lib/calendar/locale/en_US';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';

const extra = {
  '2017/07/15': { info: 'Disable', disable: true },
};

const now = new Date();
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5)] = { info: 'Disable', disable: true };
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6)] = { info: 'Disable', disable: true };
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)] = { info: 'Disable', disable: true };
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8)] = { info: 'Disable', disable: true };

Object.keys(extra).forEach((key) => {
  const info = extra[key];
  const date = new Date(key);
  if (!Number.isNaN(+date) && !extra[+date]) {
    extra[+date] = info;
  }
});

class CalendarDemo extends Component {

	originbodyScrollY = document.getElementsByTagName('body')[0].style.overflowY;
	constructor(props) {
	    super(props);
	    this.state = {
	      	en: false,
      		show: false,
      		config: {},
	    };
	}
	renderBtn(zh, en, config = {}) {
	    config.locale = this.state.en ? enUS : zhCN;

	    return (
	      <span
	        onClick={() => {
	          document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
	          this.setState({
	            show: true,
	            config,
	          });
	        }}
	      >
	        {this.state.en ? en : zh}
	      </span>
	    );
  	}

  	onSelectHasDisableDate = (dates) => {
	    console.warn('onSelectHasDisableDate', dates);
	}

	onConfirm = (startTime, endTime) => {
	    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
	    this.setState({
	      show: false,
	      startTime,
	      endTime,
	    });
	  }

	  onCancel = () => {
	    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
	    this.setState({
	      show: false,
	      startTime: undefined,
	      endTime: undefined,
	    });
	}

	getDateExtra = date => extra[+date];

	render(){
		return (
		    <div className={styles.normal}>
		      <Calendar
			          {...this.state.config}
			          visible={this.state.show}
			          onCancel={this.onCancel}
			          onConfirm={this.onConfirm}
			          onSelectHasDisableDate={this.onSelectHasDisableDate}
			          getDateExtra={this.getDateExtra}
			          defaultDate={now}
			          minDate={new Date(+now - 5184000000)}
			          maxDate={new Date(+now + 31536000000)}
			        />
		    </div>
		);
	}
}
export default CalendarDemo;
