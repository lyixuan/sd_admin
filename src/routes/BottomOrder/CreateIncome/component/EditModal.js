import React, { Component } from 'react';
// import { connect } from 'dva';
import { Modal, Input, Select, Form, Cascader } from 'antd';
import styles from './editModal.less';

const { Option } = Select;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        ...props.params,
      };
    }
    onFormChange = (value, vname) => {
      if (vname === 'organization') {
        console.log(1111, value);
      } else {
        this.setState({
          [vname]: value,
        });
      }
    };
    onCancel = () => {
      this.props.onCancel();
    };
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        console.log(44, values);
        if (!err) {
          this.setState({
            sendVal: values,
          });
          this.showModal(true);
        } else {
          console.error(err);
        }
      });
    };

    render() {
      const { visible, title, orgList = [], form } = this.props;
      const {
        orderId,
        stuId,
        collegeId,
        familyId,
        groupId,
        recommendedTeacher,
        logicJudge,
        replayLecturesTime,
        liveLecturesTime,
        competitionRatio,
      } = this.state;
      const teacherName = recommendedTeacher;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={title}
          okText="确定"
          onCancel={this.onCancel}
          onOk={this.handleSubmit}
        >
          <Form layout="vertical">
            <div className={styles.line}>
              <span className={styles.left}>子订单ID:</span>
              {orderId}
            </div>
            <div className={styles.line}>
              <span className={styles.left}>学员ID:</span>
              {stuId}
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>组织架构:
              </span>
              <Form.Item style={{ float: 'left', marginTop: '3px' }}>
                {getFieldDecorator('organization', {
                  rules: [{ required: true, message: '组织架构不能为空' }],
                })(
                  <Cascader
                    style={{ width: 230 }}
                    placeholder="请选择"
                    allowClear
                    value={[collegeId, familyId, groupId]}
                    options={orgList}
                    fieldNames={{ label: 'id', value: 'name', children: 'nodeList' }}
                    onChange={val => this.onFormChange(val, 'organization')}
                  />
                )}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>推荐老师邮箱:
              </span>
              <Form.Item style={{ float: 'left', marginTop: '3px' }}>
                {getFieldDecorator('recommendedTeacher', {
                  initialValue: recommendedTeacher,
                  rules: [{ required: true, message: '推荐老师邮箱不能为空' }],
                })(<Input style={{ width: 230, marginRight: '6px' }} />)}
              </Form.Item>
              <span>@sunlands.com</span>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>推荐老师:</span>
              {teacherName}
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>创收类型:
              </span>
              <Form.Item>
                {getFieldDecorator('title', {
                  initialValue: recommendedTeacher,
                  rules: [{ required: true, message: '创收类型不能为空' }],
                })(
                  <Select showSearch style={{ width: 230 }} onChange={this.onChange}>
                    <Option value="jack">普通好推</Option>
                    <Option value="lucy">竞合-前端发起</Option>
                    <Option value="tom">竞合-后端发起（无归属）</Option>
                    <Option value="tom">无流量</Option>
                    <Option value="tom">普通续报</Option>
                    <Option value="tom">竞合续报</Option>
                  </Select>
                )}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>转介绍类型:</span>
              <Form.Item>
                {getFieldDecorator('1')(
                  <Select showSearch style={{ width: 230 }} onChange={this.onChange}>
                    <Option value="1">产品转介绍</Option>
                    <Option value="2">运营转介绍</Option>
                    <Option value="3">APP转介绍</Option>
                  </Select>
                )}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>逻辑判断:</span>
              <Form.Item>
                {getFieldDecorator('logicJudge', {
                  initialValue: logicJudge,
                })(
                  <Select showSearch style={{ width: 230 }}>
                    <Option value="ko听课">ko听课</Option>
                    <Option value="好推听课">好推听课</Option>
                  </Select>
                )}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>重播听课:
              </span>
              <Form.Item style={{ float: 'left', marginTop: '3px' }}>
                {getFieldDecorator('replayLecturesTime', {
                  initialValue: replayLecturesTime,
                  rules: [{ required: true, message: '重播听课不能为空' }],
                })(<Input style={{ width: 230, marginRight: '6px' }} />)}
              </Form.Item>
              <span>分钟</span>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>直播听课:
              </span>
              <Form.Item style={{ float: 'left', marginTop: '3px' }}>
                {getFieldDecorator('liveLecturesTime', {
                  initialValue: liveLecturesTime,
                  rules: [{ required: true, message: '直播听课不能为空' }],
                })(<Input style={{ width: 230, marginRight: '6px' }} />)}
              </Form.Item>
              <span>分钟</span>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>竞合比:
              </span>
              <Form.Item style={{ float: 'left', marginTop: '3px' }}>
                {getFieldDecorator('competitionRatio', {
                  initialValue: competitionRatio,
                  rules: [{ required: true, message: '竞合比不能为空' }],
                })(<Input style={{ width: 230, marginRight: '6px' }} />)}
              </Form.Item>
              <span>%</span>
            </div>
          </Form>
        </Modal>
      );
    }
  }
);

// eslint-disable-next-line
class EditModal extends Component {
  // onChange = value => {
  //   console.log(`selected ${value}`);
  // };
  handleCreate = () => {
    console.log(1111);
    const { form } = this.formRef.props;
    form.validateFields(err => {
      if (err) {
        return;
      }
      // console.log('Received values of form: ', values);
      form.resetFields();
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const {
      editData = {},
      visible = false,
      confirmLoading = false,
      orgListTreeData = [],
    } = this.props;
    const params = {
      orderId: editData.orderId || '未获取到',
      stuId: editData.stuId || '未获取到',
      collegeId: editData.collegeId || undefined,
      familyId: editData.familyId || undefined,
      groupId: editData.groupId || undefined,
      recommendedTeacher: editData.recommendedTeacher || undefined,
      teacherName: editData.teacherName || undefined,
      logicJudge: editData.logicJudge,
      replayLecturesTime: editData.replayLecturesTime,
      liveLecturesTime: editData.liveLecturesTime,
      competitionRatio: editData.competitionRatio,
    };
    return (
      <div>
        <CollectionCreateForm
          visible={visible}
          confirmLoading={confirmLoading}
          title="编辑创收订单信息"
          orgListTreeData={orgListTreeData}
          params={params}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          wrappedComponentRef={this.saveFormRef}
        />
      </div>
    );
  }
}

export default EditModal;
