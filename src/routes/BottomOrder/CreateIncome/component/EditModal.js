import React, { Component } from 'react';
// import { connect } from 'dva';
import { Modal, Input, TreeSelect, Select, Form, message } from 'antd';
import styles from './editModal.less';

const { TreeNode } = TreeSelect;
const { Option } = Select;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    error = value => {
      message.error(value);
    };

    render() {
      const { onCancel, onCreate, form } = this.props;
      const { visible, title, orderId, stuId, value, recommendedTeacher } = this.props.params;
      const { getFieldDecorator } = form;
      return (
        <Modal visible={visible} title={title} okText="确定" onCancel={onCancel} onOk={onCreate}>
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
                {getFieldDecorator('treeSelect', {
                  rules: [{ required: true, message: '组织架构不能为空' }],
                })(
                  <TreeSelect
                    showSearch
                    style={{ width: 230 }}
                    setFieldsValue={value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="Please select"
                    allowClear
                    treeDefaultExpandAll
                    onChange={this.onChange}
                  >
                    <TreeNode value="parent 1" title="parent 1" key="0-1">
                      <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                        <TreeNode value="leaf1" title="my leaf" key="random" />
                        <TreeNode value="leaf2" title="your leaf" key="random1" />
                      </TreeNode>
                      <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                        <TreeNode
                          value="sss"
                          title={<b style={{ color: '#08c' }}>sss</b>}
                          key="random3"
                        />
                      </TreeNode>
                    </TreeNode>
                  </TreeSelect>
                )}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>推荐老师邮箱:
              </span>
              <Form.Item style={{ float: 'left', marginTop: '3px' }}>
                {getFieldDecorator('teacherName', {
                  rules: [{ required: true, message: '推荐老师邮箱不能为空' }],
                })(
                  <Input
                    style={{ width: 230, marginRight: '6px' }}
                    onKeyDown={this.onKeyDown}
                    onBlur={this.leaveSearchMode}
                  />
                )}
              </Form.Item>
              <span>@sunlands.com</span>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>推荐老师:</span>
              {recommendedTeacher}
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>创收类型:
              </span>
              <Form.Item>
                {getFieldDecorator('title', {
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
              <span className={styles.left}>转介绍产品类型:</span>
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
                {getFieldDecorator('2')(
                  <Select showSearch style={{ width: 230 }} onChange={this.onChange}>
                    <Option value="jack">ko听课</Option>
                    <Option value="lucy">好推听课</Option>
                    <Option value="lucy">未听课</Option>
                  </Select>
                )}
              </Form.Item>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>重播听课:
              </span>
              <Form.Item style={{ float: 'left', marginTop: '3px' }}>
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: '创收类型不能为空' }],
                })(
                  <Input
                    style={{ width: 230, marginRight: '6px' }}
                    onKeyDown={this.onKeyDown}
                    onBlur={this.leaveSearchMode}
                  />
                )}
              </Form.Item>
              <span>分钟</span>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>直播听课:
              </span>
              <Form.Item style={{ float: 'left', marginTop: '3px' }}>
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: '创收类型不能为空' }],
                })(
                  <Input
                    style={{ width: 230, marginRight: '6px' }}
                    onKeyDown={this.onKeyDown}
                    onBlur={this.leaveSearchMode}
                  />
                )}
              </Form.Item>
              <span>分钟</span>
            </div>
            <div className={styles.line}>
              <span className={styles.left}>
                <i className={styles.red}>*</i>竞合比:
              </span>
              <Form.Item style={{ float: 'left', marginTop: '3px' }}>
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: '创收类型不能为空' }],
                })(
                  <Input
                    style={{ width: 230, marginRight: '6px' }}
                    onKeyDown={this.onKeyDown}
                    onBlur={this.leaveSearchMode}
                  />
                )}
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
    // const { visible, confirmLoading, title, orderId, stuId, recommendedTeacher } = this.state;
    const params = {
      orderId: this.props.orderId || 1111,
      stuId: this.props.stuId || 1123,
      recommendedTeacher: this.props.recommendedTeacher || 123,
      visible: this.props.visible || false,
      confirmLoading: false,
      title: '编辑创收订单信息',
      value: '',
    };
    return (
      <div>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={params.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          params={params}
        />
      </div>
    );
  }
}

export default EditModal;
