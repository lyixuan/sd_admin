/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Radio,
  Checkbox,
  Col,
  Select,
  Spin,
  Upload,
  Modal,
  message,
} from 'antd';
import common from '../../Common/common.css';
import { uploadIcon } from '../../../services/api';
import styles from '../certification.css';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class CertificationCreate_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible1: false,
      previewImage1: '',
      previewVisible2: false,
      previewImage2: '',
      fileList1: [],
      fileList2: [],
      plainOptions: BI_Filter('Certification_ONLYUSER|id->value,name->label'),
      defaultCheckedList: [],
    };
    this.applyFlag = null; // 标记申请方式是电脑端还是手机端
    this.suitFlag = null; // 标记适用用户是指定用户还是岗位不限
  }

  handleSubmit = e => {
    e.preventDefault();
    const { fileList1 = [], fileList2 = [] } = this.state;
    const file1 = fileList1.length;
    const file2 = fileList2.length;
    if (file1 === 0 || file2 === 0) {
      message.error('已获得或未获得图片是必传项，图片仅支持PNG格式，请重新选择！');
    } else {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.props.handleSubmit(values, fileList1, fileList2);
        }
      });
    }
  };

  deleteDispatch = (val = [], type = 1) => {
    const { response = {} } = val.length > 0 ? val[0] : {};
    const { data = null } = response;
    const params = { type, picName: data };
    this.props.jumpFunction.dispatch({
      type: 'certification/delIcon',
      payload: { params },
    });
  };

  deleteIcon = (type = 1) => {
    if (type === 1) {
      this.deleteDispatch(this.state.fileList1, type);
    } else {
      this.deleteDispatch(this.state.fileList2, type);
    }
  };
  // 删除已获得认证图标
  handleCancel1 = () => {
    this.setState({ previewVisible1: false });
  };
  // 删除未获得认证图标
  handleCancel2 = () => {
    this.setState({ previewVisible2: false });
  };

  handlePreview1 = file => {
    this.setState({
      previewImage1: file.url || file.thumbUrl,
      previewVisible1: true,
    });
  };
  handlePreview2 = file => {
    this.setState({
      previewImage2: file.url || file.thumbUrl,
      previewVisible2: true,
    });
  };

  commonFun = (info = {}, type = 1) => {
    const { fileList = [], file = {} } = info;
    if (file.response) {
      if (file.response.code === 2000) {
        if (type === 1) {
          this.setState({ fileList1: fileList });
        } else {
          this.setState({ fileList2: fileList });
        }
      } else {
        message.error(file.response.msg);
      }
    }
  };

  handleChange1 = info => {
    this.commonFun(info, 1);
  };

  handleChange2 = info => {
    this.commonFun(info, 2);
  };

  beforeUpload = file => {
    const isPNG = file.type === 'image/png';
    if (!isPNG) {
      message.error('图片仅支持PNG格式!');
    }
    return isPNG;
  };

  // 申请方式修改的标记修改
  handleSelectChange = value => {
    this.applyFlag = value;
    this.props.form.setFieldsValue({
      allowAdd: 2,
    });
  };

  // 适用用户修改的标记修改
  suitSelectChange = value => {
    this.suitFlag = value;
    this.props.form.setFieldsValue({
      onlyUser: [],
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { submit } = this.props.jumpFunction;
    const { TextArea } = Input;
    const disabled = true;
    const { suitFlag, applyFlag } = this;
    const {
      previewVisible1,
      previewImage1,
      previewVisible2,
      previewImage2,
      fileList2,
      fileList1,
    } = this.state;
    const uploadButton = (
      <Button
        type="primary"
        className={common.submitButton}
        style={{ margin: '0' }}
        loading={false}
      >
        添加图标
      </Button>
    );
    const formLayout = 'inline';
    return (
      <Spin spinning={false}>
        <Form layout={formLayout} onSubmit={this.handleSubmit}>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*排&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序">
                {getFieldDecorator('orderNum', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        const reg = /^\d{3,6}$/; // /^0?1[3|4|5|8|7][0-9]\d{8}$/
                        if (!value) {
                          callback({ message: '排序为必填项，请填写!' });
                        } else if (!reg.test(value) && value) {
                          callback({ message: '排序需要是3-6位数字组成，请修改！' });
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(<Input style={{ width: 280 }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*认证项目">
                {getFieldDecorator('name', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        const reg = !value ? '' : value.replace(/\s*/g, '');
                        if (!reg) {
                          callback({ message: '认证项目为必填项，请填写!' });
                        } else if (reg.length > 15) {
                          callback({ message: '认证项目限制在15个字符之内，请修改!' });
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(<Input style={{ width: 280 }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*考核周期">
                {getFieldDecorator('assessCyc', {
                  initialValue: 1,
                })(
                  <Select placeholder="月度" style={{ width: 280, height: 32 }}>
                    {window.BI_Filter(`CHECK_CYCLE`).map(item => (
                      <Option value={Number(item.id)} key={Number(item.id)}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="&nbsp;&nbsp;标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;准">
                {getFieldDecorator('assessStandard', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        const reg = !value ? '' : value.replace(/\s*/g, '');
                        if (reg.length > 100) {
                          callback({ message: '标准限制在200个字符之内，请修改!' });
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(<TextArea rows={4} style={{ width: '280px', height: '84px' }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*已获得认证图标">
                {getFieldDecorator('obtainedIcon', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '已获得认证图标为必填项，请上传！' });
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <div className={styles.divContent}>
                    <Upload
                      action={uploadIcon()}
                      listType="picture-card"
                      onPreview={this.handlePreview1}
                      // fileList={fileList1}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange1}
                      data={{ type: 1 }}
                      onRemove={() => this.deleteIcon(1)}
                    >
                      {Array.isArray(fileList1)
                        ? fileList1.length >= 1 ? null : uploadButton
                        : null}
                    </Upload>
                    <Modal visible={previewVisible1} footer={null} onCancel={this.handleCancel1}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage1} />
                    </Modal>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="&nbsp;&nbsp;考核形式">
                {getFieldDecorator('assessStyle', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        const reg = !value ? '' : value.replace(/\s*/g, '');
                        if (reg.length > 100) {
                          callback({ message: '考核形式限制在200个字符之内，请修改!' });
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(<TextArea rows={4} style={{ width: '280px', height: '84px' }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*未获得认证图标">
                {getFieldDecorator('originalIcon', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '未获得认证图标为必填项，请上传！' });
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <div className={styles.divContent}>
                    <Upload
                      action={uploadIcon()}
                      listType="picture-card"
                      onPreview={this.handlePreview2}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange2}
                      data={{ type: 2 }}
                      onRemove={() => this.deleteIcon(2)}
                    >
                      {Array.isArray(fileList2)
                        ? fileList2.length >= 1 ? null : uploadButton
                        : null}
                    </Upload>
                    <Modal visible={previewVisible2} footer={null} onCancel={this.handleCancel2}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage2} />
                    </Modal>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*申请方式">
                {getFieldDecorator('applyMethod', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '申请方式为必填项，请选择！' });
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <Select style={{ width: 280, height: 32 }} onChange={this.handleSelectChange}>
                    {window.BI_Filter(`Certification_APPLYMETHOD`).map(item => (
                      <Option value={Number(item.id)} key={Number(item.id)}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*允许添加附件">
                {getFieldDecorator('allowAdd', {
                  initialValue: 2,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (applyFlag === 1) {
                          if (!value) {
                            callback({ message: '允许添加附件为必填项，请选择！' });
                          } else {
                            callback();
                          }
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <RadioGroup
                    style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}
                  >
                    <Radio
                      name="allowAdd"
                      value={1}
                      disabled={this.applyFlag === 2 ? disabled : false}
                    >
                      是
                    </Radio>
                    <Radio
                      name="allowAdd"
                      value={2}
                      disabled={this.applyFlag === 2 ? disabled : false}
                    >
                      否
                    </Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*适用用户">
                {getFieldDecorator('perfectUser', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '适用用户为必填项，请选择！' });
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <Select style={{ width: 280, height: 32 }} onChange={this.suitSelectChange}>
                    {window.BI_Filter(`Certification_SUITUSER`).map(item => (
                      <Option value={Number(item.id)} key={Number(item.id)}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*指定用户">
                {getFieldDecorator('onlyUser', {
                  initialValue: this.state.defaultCheckedList,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (suitFlag === 1) {
                          if (!value || value.length <= 0) {
                            callback({ message: '指定用户为必填项，至少选择一项！' });
                          } else {
                            callback();
                          }
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <CheckboxGroup
                    style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}
                    options={this.state.plainOptions}
                    className={common.checkboxGroup}
                    disabled={this.suitFlag === 2 ? disabled : false}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={{ marginTop: '20px' }}>
            <Col span={6} offset={17} style={{ textAlign: 'right' }}>
              <FormItem>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={this.props.resetContent}
                    type="primary"
                    className={common.cancleButton}
                  >
                    取消
                  </Button>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className={common.submitButton}
                    loading={submit}
                  >
                    提交
                  </Button>
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}

export default CertificationCreate_Form;
