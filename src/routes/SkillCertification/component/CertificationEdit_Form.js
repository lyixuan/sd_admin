/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Spin,
  Radio,
  Upload,
  Modal,
  message,
  Checkbox,
} from 'antd';
import common from '../../Common/common.css';
import { uploadIcon } from '../../../services/api';
import styles from '../certification.css';
import { checkoutToken } from '../../../utils/Authorized';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
let isPng = false;
const headerObj = { authorization: checkoutToken() };

class CertificationEdit_Form extends Component {
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
    };
    this.id = null;
    this.suitFlag = null; // 标记适用用户是指定用户还是岗位不限
  }

  UNSAFE_componentWillReceiveProps(nexprops) {
    if (nexprops.certification) {
      if (
        JSON.stringify(nexprops.certification.fileList1) !==
        JSON.stringify(this.props.certification.fileList1)
      ) {
        const { fileList1 } = this.nexprops.certification;
        this.setState({ fileList1 });
      }
      if (
        JSON.stringify(nexprops.certification.fileList2) !==
        JSON.stringify(this.props.certification.fileList2)
      ) {
        const { fileList2 } = this.nexprops.certification;
        this.setState({ fileList2 });
      }
    }
  }

  componentWillUnmount() {
    this.id = null;
    this.suitFlag = null; // 标记适用用户是指定用户还是岗位不限
  }

  handleSubmit = e => {
    e.preventDefault();
    let { fileList1, fileList2 } = this.state;
    fileList1 =
      fileList1.length === 0 ? this.props.jumpFunction.certification.fileList1 : fileList1;
    fileList2 =
      fileList2.length === 0 ? this.props.jumpFunction.certification.fileList2 : fileList2;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values, fileList1, fileList2);
      }
    });
  };

  handleCancel1 = () => {
    this.setState({ previewVisible1: false });
  };
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
    let { fileList } = info;
    const { saveFileList } = this.props;
    if (isPng) {
      fileList = fileList.slice(-1);
      if (type === 1) {
        this.setState({ fileList1: fileList });
      } else {
        this.setState({ fileList2: fileList });
      }
    }
    if (info.file.response) {
      if (info.file.response.code === 2000) {
        if (saveFileList) {
          saveFileList(fileList, type);
        }
      } else {
        message.error(info.file.response.msg);
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
    isPng = file.type === 'image/png';
    if (!isPng) {
      message.error('图片仅支持PNG格式!');
    }
    return isPng;
  };

  wordFun = text => {
    return (
      <Button type="primary" className={common.submitButton} loading={false}>
        {text}图标
      </Button>
    );
  };

  // 适用用户修改的标记修改
  suitSelectChange = value => {
    this.suitFlag = value;
    this.props.form.setFieldsValue({
      userTypeFormList: [],
    });
  };

  dataStruct = (value = []) => {
    const list = [];
    value.map(item => {
      if (item.userType) {
        list.push(item.userType);
      }
      return 0;
    });
    return list;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { submit, itemDetal, certification = {} } = this.props.jumpFunction;
    const { getItemById = {} } = certification;
    const {
      orderNum = null,
      name = null,
      code = null,
      status = 1,
      enabledSubDefine = false,
      assessCyc = 1,
      assessStyle = null,
      assessStandard = null,
      id = null,
      allowUpdateAttachment = false,
      applyType = 100,
      fitUser = 100,
      certificationOrgMapList = [],
    } = getItemById;
    this.id = id;
    const disabled = true;
    const suitFlag = this.suitFlag || 100;
    const onlyUserList = this.dataStruct(certificationOrgMapList);
    const { previewVisible1, previewImage1, previewVisible2, previewImage2 } = this.state;
    let { fileList1, fileList2 } = this.state;
    fileList1 =
      fileList1.length === 0 ? this.props.jumpFunction.certification.fileList1 : fileList1;
    fileList2 =
      fileList2.length === 0 ? this.props.jumpFunction.certification.fileList2 : fileList2;
    const formLayout = 'inline';
    return (
      <Spin spinning={itemDetal}>
        <Form layout={formLayout} onSubmit={this.handleSubmit}>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*排&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序">
                {getFieldDecorator('orderNum', {
                  initialValue: orderNum,
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
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="&nbsp;&nbsp;认证编码">
                {getFieldDecorator('code', {
                  initialValue: code,
                })(<Input style={{ width: 280 }} disabled={disabled} />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*认证项目">
                {getFieldDecorator('name', {
                  initialValue: name,
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
                  initialValue: Number(assessCyc),
                })(
                  <Select placeholder="月度" style={{ width: 280, height: 32 }} disabled={disabled}>
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
                  initialValue: assessStandard,
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
                })(
                  <div className={styles.divContent}>
                    <Upload
                      action={uploadIcon()}
                      headers={headerObj}
                      listType="picture-card"
                      onPreview={this.handlePreview1}
                      fileList={fileList1}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange1}
                      data={{ type: 1 }}
                      showUploadList={{ showRemoveIcon: false }}
                    >
                      {Array.isArray(fileList1)
                        ? fileList1.length >= 1 ? this.wordFun('更新') : this.wordFun('添加')
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
                  initialValue: assessStyle,
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
                })(
                  <div className={styles.divContent}>
                    <Upload
                      action={uploadIcon()}
                      headers={headerObj}
                      listType="picture-card"
                      onPreview={this.handlePreview2}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange2}
                      data={{ type: 2 }}
                      showUploadList={{ showRemoveIcon: false }}
                      fileList={fileList2}
                    >
                      {Array.isArray(fileList2)
                        ? fileList2.length >= 1 ? this.wordFun('更新') : this.wordFun('添加')
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
              <FormItem label="&nbsp;&nbsp;是否停用">
                {getFieldDecorator('isDisable', {
                  initialValue: status === 3 ? disabled : false,
                })(
                  <RadioGroup
                    style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}
                  >
                    <Radio name="privilege" value={disabled}>
                      是
                    </Radio>
                    <Radio name="privilege" value={false}>
                      否
                    </Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="子项是否允许手动输入">
                {getFieldDecorator('enabledSubDefine', {
                  initialValue: enabledSubDefine,
                })(
                  <RadioGroup
                    style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}
                  >
                    <Radio name="privilege" value={disabled}>
                      是
                    </Radio>
                    <Radio name="privilege" value={false}>
                      否
                    </Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*申请方式">
                {getFieldDecorator('applyType', {
                  initialValue: applyType || 100,
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
                  <Select style={{ width: 280, height: 32 }} disabled={disabled}>
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
                {getFieldDecorator('allowUpdateAttachment', {
                  initialValue: allowUpdateAttachment ? 1 : 0,
                  rules: [],
                })(
                  <RadioGroup
                    style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}
                  >
                    <Radio
                      name="allowUpdateAttachment"
                      value={1}
                      disabled={Number(applyType) === 100 ? disabled : false}
                    >
                      是
                    </Radio>
                    <Radio
                      name="allowUpdateAttachment"
                      value={0}
                      disabled={Number(applyType) === 100 ? disabled : false}
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
                {getFieldDecorator('fitUser', {
                  initialValue: fitUser ? Number(fitUser) : 100,
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
                {getFieldDecorator('userTypeFormList', {
                  initialValue: onlyUserList,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (suitFlag === 100) {
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
                    disabled={
                      suitFlag ? suitFlag === 200 : Number(fitUser) === 200 ? disabled : false
                    }
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

export default CertificationEdit_Form;
