import React from 'react';
import {Modal, Button, Icon} from 'antd-mobile';
import styles from './GroupDialog.css';
import GroupListStyle from '../GroupList.css';
import {connect} from 'dva';

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

class GroupDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: this.props.modelflag || false,
      selected: 1,
      listData: this.props.listData || [],
      // modal2: false,
    };
  }

  selectGroup(groupId = null) {
    this.props.dispatch({
      type: 'home/updateTrend',
      payload: {},
    });
    this.setState({
      selected: groupId
    })

    console.log('添加更改图表事件');
  }

  showModal() {
    this.setState({
      isShowModal: true,
    });
  }

  closeDialog() {
    this.setState({
      isShowModal: false,
    });
    console.log('关闭dialog')
  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  setListItem(data, v) {
    const self = this;
    let itemList = v.map(function (item, index) {
      const title = item.college;
      const datalist = [];
      item.data.map(function (item, index) {
        const rowdata = {
          serialNum: item.rank,
          name: item.name,
          groupID: item.id,
        }
        datalist.push(rowdata)
      })
      return (
        <div key={index}>
          <span>{title}</span>
          {datalist.map((item, index) => (
            <Button
              className={item.groupID === self.state.selected ? GroupListStyle.btnSelected : GroupListStyle.btnStyle}
              style={{width: '2.05rem'}} key={item.groupID}
              onClick={self.selectGroup.bind(self, item.groupID)}>{item.name}</Button>
          ))}
        </div>

      )
    });
    return itemList
  }

  renderHeadElement(v) {
    const self = this;
    return (
      <div className={styles.modalHead}>
        <span>自变量</span>
        <Icon type="cross-circle" className={styles.dialogCloseBtn} onClick={self.closeDialog.bind(self)}/>
      </div>
    )
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'groupDialogList/fetch',
      payload: {},
    });
  }

  //父组件的props改变，则子组件数据要跟着改变
  componentWillReceiveProps(nextProps) {
    if (nextProps.modelflag != this.props.modelflag) {
      this.setState({isShowModal: nextProps.modelflag});
    }
  }

  render() {
    const dataObjtest = this.props.groupDialogList.dataObj1;
    return (
      !dataObjtest ? <div className={styles.normal}>添加loading</div> :
        <div>
          <Modal
            ref='GroupDialog'
            visible={this.state.isShowModal}
            transparent
            maskClosable={false}
            title={this.renderHeadElement(dataObjtest.items)}
            wrapProps={{onTouchStart: this.onWrapTouchStart}}
            className={styles.groupModal}
            wrapClassName={styles.gwrapRoupModal}
          >
            <div className={GroupListStyle.flexContainer}>
              {this.setListItem(this.state.listData, dataObjtest.items)}
            </div>
          </Modal>
        </div>
    );
  }

}


//模态框******************

//export default (GroupDialog);

function mapStateToProps(groupDialogList) {
  return groupDialogList;
}

export default connect(mapStateToProps)(GroupDialog);
