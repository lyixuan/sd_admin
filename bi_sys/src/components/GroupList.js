import React from 'react';
import {connect} from 'dva';
import { Button } from 'antd-mobile';
import commonStyle from './Chart/ChartCommonStyle.css';
import styles from './GroupList.css';
import GroupDialog from './Dialog/GroupDialog';

class GroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
    }
    this.selectGroup = this.selectGroup.bind(this);
    this.lookAllGroup = this.lookAllGroup.bind(this)
  }

  componentDidMount() {
    this.props.dispatch({
      type:'home/getGroupList',
      payload:{
        "startTime":1514736000000,
      "end":1526108866667,
      "creditType": 1,
      "groupType": 1,
      "rankType": 3,
      "dataType": 3,
      "familyType":0}
    })
  }
  componentWillReceiveProps(nextProps){
    console.log(nextProps)
  }

  lookAllGroup() {
    // let dialog=this.refs.GroupDialog;
    // dialog.showModal();
    // console.log('传值')
    this.setState({
      showModel: true,
    })
  }
  selectLimitGroup(authorityType,data){
    //假设1为运营用户,2为学院用户,待遇产品沟通
    const newData=data.slice();     //
    const dataObj={
      data:[],
      isShowAllGroup:false
    };

    if(authorityType===1){


    }else{

    }


  }

  selectGroup(groupId = null) {
    this.setState({
      selected: groupId
    })
    console.log('添加更改图表事件');
  }

  setListItem(data,selectedId) {
    const self = this;
    let itemList = data.map(function (item, index) {
      //排名占时用index,后添加rank字段
      return (
        <Button className={item.groupId === selectedId ? styles.btnSelected : styles.btnStyle}
                key={item.groupId} onClick={self.selectGroup.bind(self, item.groupId)}>
          <i className={item.groupId === selectedId ? styles.selectedSerialNumStyle : styles.serialNumStyle}>{index+1}</i>
          {item.name}</Button>
      )
    });
    return itemList
  }

  render() {
    const {familyType}=this.props;
    const {rankDataObj,fmilyTypeFilteKeyIDs}=this.props.home;
    const isDontHasData=rankDataObj[familyType]===undefined||JSON.stringify(rankDataObj[familyType])==='{}';
    const dataScorse=isDontHasData||rankDataObj[familyType]===null?{}:rankDataObj[familyType];
    const isSelectedId=fmilyTypeFilteKeyIDs[familyType];
    console.log(dataScorse,isSelectedId)
    return (
      isDontHasData||dataScorse.total===0||dataScorse.data===null?'':
      <div className={styles.normal} style={{background:'rgba(0,0,0,0.5)'}}>
        <div className={styles.flexContainer}>
          {this.setListItem(dataScorse.data,isSelectedId)}
        </div>
        {
           <div className={commonStyle.checkAllGroup} onClick={this.lookAllGroup}>查看全部</div>
        }
        {/*模态框*/}
        {/* <GroupDialog listData={groupData} modelflag={this.state.showModel} groupID="1234" ref="GroupDialog"/> */}

        {/*模态框*/}</div>
    )
  }


}
export default connect(({home}) => ({home}))(GroupList);
