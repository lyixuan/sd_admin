import React,{Component} from 'react';
import styles from './CreditDetails.css';
import DatePanle from '../../components/DatePanle/DatePanle';


class NewCreditDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime:'',
      endTime:''
    }
  }

  componentDidMount() {
  }

  dateChange(startTime,endTime){
    console.log(startTime);
    console.log(endTime);
  }
  render() {
    return(
      <div className={styles.normal}>
        <DatePanle onConfirm={(startTime,endTime)=>{this.dateChange(startTime,endTime)}} startTime={'2017-1-1'} endTime={'2018-1-1'}/>
      </div>
    )
  }
}
export default NewCreditDetails
