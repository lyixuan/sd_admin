import React, {Component} from 'react';
import Table from 'rc-table';
import { Button, Modal } from 'antd-mobile';
import styles from './DetailTable.css';
import {connect} from 'dva';

const alert = Modal.alert;
let alerttitle = <div className={styles.alerttitle}>是否确定将详细数据发送到邮箱？</div>
let alertcontent = <div className={styles.alertcontent}>
              <div className={styles.alertcontent}>
              03.20 周日 - 03.22 周二 
              </div>
              <div className={styles.alertcontent}>
              未解决详情数据 99+
              </div>
              <div className={styles.alertcontent}>
              邮箱：1234567890@qq.com
              </div>
  </div>
 // 定义alert
const showAlert = () => {
    const alertInstance = alert(alerttitle, alertcontent, [
      { text: '取消',onPress: () => alertInstance.close(), style: 'default' },
      { text: '确定',onPress: () => alertInstance.close(), style: 'default' },
    ]);
    setTimeout(() => {
      // 可以调用close方法以在外部close
      alertInstance.close();
    }, 500000);
  };
  
class DetailTable extends Component {
  constructor(props) {
        super(props);
         this.state = {
          dementionId:this.props.dementionId,
        }
    };

  tableColums(v){ //遍历接口返回数据获取table的列头
      const columns = [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: v.titleOne,
          dataIndex: 'titleOne',
          key: 'titleOne',
        },
        {
          title: v.titleTwo,
          dataIndex: 'titleTwo',
          key: 'titleTwo',
        },
        {
          title: v.titleThree,
          dataIndex: 'titleThree',
          key: 'titleThree',
        },
        {
          title: v.titleFour,
          dataIndex: 'titleFour',
          key: 'titleFour',
        },
      ];
      return columns;
    }

  tableData(v){ //遍历接口返回数据获取table的行数据
      const data = []
      if(v.data==null){}else{
        v.data.map(function(item, index) {
        const rowdata = {
          key: index,
          id: index+1,
          titleOne: item.valOne,
          titleTwo: item.valTwo,
          titleThree: item.valThree,
          titleFour: item.valFour,
        }
        data.push(rowdata)
        } )
      }
      return data;
    }

  titleHanle(dementionId) { //通过dementionId遍历接口获得button的title
      const titledata = this.props.dataIndex.dataObj1.data;
      const result = []
      titledata.map(function(item, index) {
        if(item.id == dementionId)
        {
            const titleitem = {
                name: item.name,
            } 
            result.push(titleitem)
        }
      })
      return result;
    }

  componentWillReceiveProps(nextProps){
      if(nextProps.dementionId!=this.props.dementionId){
        this.setState({
          dementionId:nextProps.dementionId,
        });
      }
    }

  render() {
      const columns = this.props.dataIndex.dataObj3.data== null?[]:this.tableColums(this.props.dataIndex.dataObj3.data);
      const data = this.props.dataIndex.dataObj3.data.data==null?[]:this.tableData(this.props.dataIndex.dataObj3.data);
      const titleobj = this.titleHanle(this.state.dementionId).length==0?[{name:"返回空"}]:this.titleHanle(this.state.dementionId);
      const name = titleobj[0].name;
      return (
        this.props.dataIndex.dataObj3.data.data == null ? <div className={styles.normal}>接口返回空table内容为空</div> : 
        <div>
            <div className={styles.tabletitlediv}>
              <p className={styles.tabletitle}>{name}</p>
            </div>
            <Table columns={columns} data={data} className={styles.rctable} />
              
            <div   className={`${data.length < 1 ? styles.warmtoastnone : styles.warmtoast}`} >
              <div className={styles.warmtoasttitle}>
                *温馨提示
              </div>
              <div className={styles.warmtoastcontent}>
                数据太多了，还有{this.state.number}条数据。点击发送邮箱按钮，即可获取excel表格，快速查看所有数据哦。
              </div>
            </div>
            <div className={styles.footbutton}>
              <Button  type="primary" onClick={showAlert} className={styles.subbutton} >
                <div className={styles.wordstyle2}>
                  发送详细数据到邮箱
                </div>
              </Button>
  
            </div>
            <div className={styles.divheight}></div>
        </div>
    );
  }
}

function mapStateToProps(dataIndex) {
  return dataIndex;
}

export default connect(mapStateToProps)(DetailTable)
