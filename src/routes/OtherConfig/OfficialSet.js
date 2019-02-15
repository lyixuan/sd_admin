import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, message } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';
import ModalDialog from '../../selfComponent/Modal/Modal';

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/accountList'],
}))
class OfficialSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 弹窗显隐
      contentWord: null, // textArea回显初始化
    };
  }

  componentDidMount() {}

  // 编辑
  onEdit = () => {
    this.setState({ visible: true });
  };

  showModal(bol) {
    this.setState({ visible: bol });
  }

  // 模态框回显
  clickModalOK = contentWord => {
    if (!contentWord) {
      message.error('文案编辑不可为空');
      this.showModal(true);
    } else {
      // const paramsObj = { contentWord};
      // this.props.dispatch({
      //   type: 'shortName/editCollege',
      //   payload: { paramsObj },
      // });
      console.log(contentWord);
      this.showModal(false);
    }
  };

  // input双向绑定
  handelChange(e) {
    this.setState({
      contentWord: e.target.value,
    });
  }

  render() {
    const { TextArea } = Input;
    const { visible = false, contentWord } = this.state;
    const modalContent = (
      <TextArea
        style={{ width: '425px', height: '100px' }}
        onChange={e => {
          this.handelChange(e);
        }}
        value={contentWord}
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
              style={{
                width: '400px',
                height: '86px',
                display: 'block',
                marginBottom: '30px',
                marginTop: '27px',
              }}
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
              clickOK={() => this.clickModalOK(contentWord)}
            />
          </>
        }
      />
    );
  }
}
export default OfficialSet;
