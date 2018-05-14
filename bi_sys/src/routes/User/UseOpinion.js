import React,{Component} from 'react';
import { connect } from 'dva';
import styles from './UseOpinion.css';
import { Button, Modal } from 'antd-mobile';

const alert = Modal.alert;
let alerttitle = <div className={styles.alerttitle}>提交成功</div>
let alertcontent = <div className={styles.alertcontent}>感谢你的反馈，运营专员将在24小时内跟进。</div>
 // 定义alert
const showAlert = () => {
    const alertInstance = alert(alerttitle, alertcontent, [
      { text: '关闭',onPress: () => alertInstance.close(), style: 'default' },
    ]);
    setTimeout(() => {
      // 可以调用close方法以在外部close
      alertInstance.close();
    }, 500000);
  };

// 声明UseOpinion组件
class UseOpinion extends Component {
    constructor(props) {
	    super(props);
	    this.state = {
              i_val: "",
              buttonbool: true,
	    };
    }
    // 限制文本域输入文字长度为1000，并同时监听未输入button处于不可点击状态，输入才可以点击。
    changeVal = (e) =>{
        var val = e.target.value; 
        var length = val.length;
        this.setState({i_val:val.substring(0,1000)}); 
        if (length > 0){
            this.setState({buttonbool:false})
        }
        else{
            this.setState({buttonbool:true});
        }
    }
	render(){
		return (
            <div className={styles.normal}>
                <div className={styles.heightdiv}></div>
                <div  className={styles.wrapdiv}>
                    <div className={styles.textdiv}></div>
                    <textarea className={styles.inputword} onChange={this.changeVal} name="input" value={this.state.i_val}  placeholder="请输入使用意见、建议、数据纠错等内容"></textarea>
                </div>
                <div className={styles.butttdiv}></div>
                <Button disabled={this.state.buttonbool} onClick={showAlert} type="primary" className={styles.subbutton} >
                    <div className={styles.wordstyle2}>
                        提交
                    </div>
                </Button>
            </div>
		);
	}
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(UseOpinion);
