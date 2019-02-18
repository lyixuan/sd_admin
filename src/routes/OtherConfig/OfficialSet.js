import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, message } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';
import ModalDialog from '../../selfComponent/Modal/Modal';

const { TextArea } = Input;

@connect(({ otherConfig, loading }) => ({
  otherConfig,
  loading: loading.effects['otherConfig/getSignUpMessage'],
}))
class OfficialSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 弹窗显隐
      editText: null,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'otherConfig/getSignUpMessage',
    });
  }

  // 编辑
  onEdit = () => {
    this.showModal(true);
  };

  showModal(bol) {
    this.setState({ visible: bol, editText: this.props.otherConfig.messageText });
  }

  // 模态框回显
  clickModalOK = () => {
    const editText = this.state.editText || '';
    if (!editText) {
      message.error('文案编辑不可为空');
    } else {
      const isEqure = editText === this.props.otherConfig.messageText;
      if (!isEqure) {
        this.props.dispatch({
          type: 'otherConfig/saveSignUpMessage',
          payload: { message: editText },
        });
      }
      this.showModal(false);
    }
  };

  // input双向绑定
  handelChange = e => {
    this.setState({
      editText: e.target.value,
    });
  };

  render() {
    const { visible = false, editText } = this.state;
    const { otherConfig = {} } = this.props;
    const { messageText } = otherConfig;
    const modalContent = (
      <TextArea
        value={editText}
        onChange={this.handelChange}
        style={{ width: '425px', height: '100px' }}
      />
    );
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <>
            <p style={{ color: '#000', fontSize: '18px' }}>报名通道文案设置</p>
            <p style={{ color: '#000', fontSize: '14px' }}>设置手机端报名通道关闭页的文案</p>
            <TextArea
              disabled
              style={{
                width: '400px',
                height: '86px',
                display: 'block',
                marginBottom: '30px',
                marginTop: '27px',
              }}
              value={messageText}
            />
            <AuthorizedButton authority="/otherConfig/officialSet">
              <Button
                onClick={this.onEdit}
                type="primary"
                className={common.createButton}
                style={{ marginLeft: '180px' }}
              >
                编辑
              </Button>
            </AuthorizedButton>
            <ModalDialog
              style={{ width: '620px' }}
              title="编辑文案"
              visible={visible}
              footButton={['取消', '保存']}
              modalContent={modalContent}
              showModal={bol => this.showModal(bol)}
              clickOK={this.clickModalOK}
            />
          </>
        }
      />
    );
  }
}
export default OfficialSet;
