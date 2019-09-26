import React, { Component } from 'react';
// import { connect } from 'dva';
import { Modal, Input, InputNumber, Select, Form, Cascader } from 'antd';
import styles from './editModal.less';

const { Option } = Select;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    onCancel = () => {
      this.props.onCancel();
    };
    onMailChange = e => {
      const mail = e.currentTarget.value ? e.currentTarget.value : null;
      this.props.onMailChange(mail);
    };
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.onCreate(values);
        }
      });
    };

    render() {
      const { visible, title, orgList = [], form, params, mailName } = this.props;
      const {
        orderId,
        stuId,
        collegeId,
        familyId,
        groupId,
        teacherName,
        logicJudge,
        replayLecturesTime,
        liveLecturesTime,
        competitionRatio,
        engageType,
        recommendType,
        id,
      } = params;

      const { getFieldDecorator } = form;
      return (
        <Modal
          width={550}
          visible={visible}
          title={title}
          destroyOnClose
          maskClosable={false}
          okText="确定"
          onCancel={this.onCancel}
          onOk={this.handleSubmit}
        >
          <Form layout="vertical" className="createEditForm">
            <div className={styles.line}>
              <Form.Item style={{ display: 'none' }}>
                {getFieldDecorator('id', {
                  initialValue: id,
                })(<Input disabled style={{ width: 230, marginRight: '6px' }} />)}
              </Form.Item>
              <span className={styles.left}>子订单ID:</span>
              <Form.Item>
                {getFieldDecorator('orderId', {
                  initialValue: orderId,
                })(<Input disabled style={{ width: 230, marginRight: '6px' }} />)}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>学员ID:</span>
              <Form.Item>
                {getFieldDecorator('stuId', {
                  initialValue: stuId,
                })(<Input disabled style={{ width: 230, marginRight: '6px' }} />)}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>组织架构:
              </span>
              <Form.Item style={{ overflow: 'hidden', marginTop: 3 }}>
                {getFieldDecorator('organization', {
                  initialValue: [collegeId, familyId, groupId],
                  rules: [{ required: true, message: '组织架构不能为空' }],
                })(
                  <Cascader
                    style={{ width: 230 }}
                    placeholder="请选择"
                    allowClear
                    options={orgList}
                    changeOnSelect
                    fieldNames={{ label: 'name', value: 'id', children: 'nodeList' }}
                  />
                )}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>推荐老师邮箱:
              </span>
              <Form.Item style={{ float: 'left' }}>
                {getFieldDecorator('teacherName', {
                  initialValue: teacherName,
                  rules: [{ required: true, message: '推荐老师邮箱不能为空' }],
                })(
                  <Input
                    style={{ width: 230, marginRight: '6px' }}
                    onChange={e => this.onMailChange(e)}
                  />
                )}
              </Form.Item>
              <span className={styles.right}>@sunlands.com</span>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>推荐老师:</span>
              <Form.Item>
                {getFieldDecorator('recommendedTeacher', {
                  initialValue: mailName,
                })(<Input disabled style={{ width: 230, marginRight: '6px' }} />)}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>创收类型:
              </span>
              <Form.Item style={{ overflow: 'hidden' }}>
                {getFieldDecorator('engageType', {
                  initialValue: engageType,
                  rules: [{ required: true, message: '创收类型不能为空' }],
                })(
                  <Select style={{ width: 230 }} allowClear>
                    {window.BI_Filter('INTRO_TYPE').map(item => (
                      <Option key={item.name} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>转介绍类型:</span>
              <Form.Item>
                {getFieldDecorator('recommendType', {
                  initialValue: recommendType,
                })(
                  <Select style={{ width: 230 }} allowClear>
                    {window.BI_Filter('CREATE_TYPE').map(item => (
                      <Option key={item.name} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
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
                  <Select style={{ width: 230 }} allowClear>
                    <Option value="KO听课">KO听课</Option>
                    <Option value="好推听课">好推听课</Option>
                    <Option value="未听课">未听课</Option>
                  </Select>
                )}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>重播听课:</span>
              <Form.Item style={{ float: 'left' }}>
                {getFieldDecorator('replayLecturesTime', {
                  initialValue: replayLecturesTime,
                })(
                  <InputNumber
                    min={0}
                    max={100000000}
                    precision={2}
                    style={{ width: 230, marginRight: '6px' }}
                  />
                )}
              </Form.Item>
              <span className={styles.right}>分钟</span>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>直播听课:</span>
              <Form.Item style={{ float: 'left' }}>
                {getFieldDecorator('liveLecturesTime', {
                  initialValue: liveLecturesTime,
                })(
                  <InputNumber
                    min={0}
                    max={100000000}
                    precision={2}
                    style={{ width: 230, marginRight: '6px' }}
                  />
                )}
              </Form.Item>
              <span className={styles.right}>分钟</span>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>竞合比:</span>
              <Form.Item style={{ float: 'left' }}>
                {getFieldDecorator('competitionRatio', {
                  initialValue: competitionRatio,
                })(
                  <InputNumber
                    min={0}
                    max={100}
                    precision={2}
                    style={{ width: 230, marginRight: '6px' }}
                  />
                )}
              </Form.Item>
              <span className={styles.right}>%</span>
            </div>
          </Form>
        </Modal>
      );
    }
  }
);

// eslint-disable-next-line
class EditModal extends Component {
  onMailChange = mail => {
    this.props.onMailChange(mail);
  };
  handleCancel = () => {
    this.props.onCancel();
  };
  handleCreate = val => {
    this.props.onSubmit(val);
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const {
      editData = {},
      visible = false,
      confirmLoading = false,
      orgList = [],
      mailName,
    } = this.props;
    const params = {
      orderId: editData.orderId || '未获取到',
      stuId: editData.stuId || '未获取到',
      collegeId: editData.collegeId || undefined,
      familyId: editData.familyId || undefined,
      groupId: editData.groupId || undefined,
      teacherName: editData.teacherName || undefined,
      recommendedTeacher: editData.recommendedTeacher || undefined,
      logicJudge: editData.logicJudge,
      replayLecturesTime: editData.replayLecturesTime,
      liveLecturesTime: editData.liveLecturesTime,
      engageType: editData.engageType,
      recommendType: editData.recommendType,
      id: editData.id,
      competitionRatio:
        editData.competitionRatio === null ||
        editData.competitionRatio === undefined ||
        editData.competitionRatio === ''
          ? 100
          : editData.competitionRatio,
    };
    return (
      <CollectionCreateForm
        visible={visible}
        confirmLoading={confirmLoading}
        title="编辑创收订单信息"
        orgList={orgList}
        params={params}
        mailName={mailName}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate}
        onMailChange={mail => this.onMailChange(mail)}
        wrappedComponentRef={this.saveFormRef}
      />
    );
  }
}

export default EditModal;
