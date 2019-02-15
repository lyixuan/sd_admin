import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button } from 'antd';
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
    };
  }

  componentDidMount() {
    this.getData();
  }

  // 编辑账号函数
  onEdit = () => {
    this.setState({ visible: true });
  };

  getData = values => {
    console.log(values);
    // this.props.dispatch({
    //   type: 'account/accountList',
    //   payload: { accountListParams },
    // });
  };

  setDialogSHow(bol) {
    this.setState({ visible: bol });
  }

  // 模态框回显
  editName = e => {
    this.getData(e);
  };

  render() {
    const { TextArea } = Input;
    const { visible = false } = this.state;
    const modalContent = <TextArea style={{ width: '425px', height: '100px' }} />;
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
              modalContent={modalContent}
              clickOK={e => this.editName(e)}
              footButton={['取消', '提交']}
              showModal={bol => {
                this.setDialogSHow(bol);
              }}
            />
          </>
        }
      />
    );
  }
}
export default OfficialSet;
