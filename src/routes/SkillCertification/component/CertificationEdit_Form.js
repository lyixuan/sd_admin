/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Select, Spin, Radio, Upload, Modal } from 'antd';
import common from '../../Common/common.css';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

class CertificationEdit_Form extends Component {
  constructor(props) {
    super(props);
    const {
      timeArea = '月度',
      id = null,
      name = null,
      code = null,
    } = this.props.jumpFunction.getUrlParams();

    const timeType = Number(window.BI_Filter(`Certification_TIMEAREA|name:${timeArea}`).id);
    this.state = {
      timeArea: timeType,
      id,
      name,
      code,
      previewVisible1: false,
      previewImage1: '',
      previewVisible2: false,
      previewImage2: '',
      fileList1: [],
      fileList2: [],
    };
  }
  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  handleCancel1 = () => this.setState({ previewVisible1: false });
  handleCancel2 = () => this.setState({ previewVisible2: false });

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

  handleChange1 = ({ fileList }) => {
    console.log(fileList)
    this.setState({ fileList1:fileList });
  }


  handleChange2 = ({ fileList }) => {
    console.log(fileList)
    this.setState({ fileList2:fileList });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const bol = false;
    const disabled = true;
    const { TextArea } = Input;
    const {timeArea = 1,id = null,name = null,code = null, previewVisible1, previewImage1,previewVisible2, previewImage2, fileList2 , fileList1} = this.state;
    const uploadButton = (
      <Button type="primary" className={common.submitButton} loading={false}>
        添加图标
      </Button>
    );
    const formLayout = 'inline';
    return (
      <Spin spinning={bol}>
        <Form layout={formLayout} onSubmit={this.handleSubmit}>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*排&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序">
                {getFieldDecorator('id', {
                  initialValue: id,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '排序为必填项，请选择!' });
                        }
                        callback();
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
                })(<Input style={{ width: 280 }} />)}
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
                        if (!value) {
                          callback({ message: '认证项目为必填项，请选择!' });
                        }
                        callback();
                      },
                    },
                  ],
                })(<Input style={{ width: 280 }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*考核周期">
                {getFieldDecorator('sex', {
                  initialValue: timeArea,
                })(
                  <Select style={{ width: 280 }} disabled={disabled}>
                    <Option value={1}>月度</Option>
                    <Option value={2}>季度</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="&nbsp;&nbsp;标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;准">
                {getFieldDecorator('standard', {
                  initialValue: null,
                })(<TextArea rows={4} style={{ width: 280 }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="考核形式">
                {getFieldDecorator('method', {
                  initialValue: null,
                })(<TextArea rows={4} style={{ width: 280 }} />)}
              </FormItem>
            </Col>
          </Row>

          <Row >
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*已获得认证图标">
                {getFieldDecorator('havaOwed', {
                  initialValue: null,
                })(
                  <>
                    <Upload
                      action=""
                      listType="picture-card"
                      fileList={fileList1}
                      onPreview={this.handlePreview1}
                      onChange={this.handleChange1}
                    >
                      {Array.isArray(fileList1)?fileList1.length >= 1 ? null : uploadButton:null}
                    </Upload>
                    <Modal visible={previewVisible1} footer={null} onCancel={this.handleCancel1}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage1} />
                    </Modal>
                  </>
                )}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*未获得认证图标"  >
                {getFieldDecorator('unOwed', {
                  initialValue: null,
                })(
                  <div style={{ width: '280px', textAlign: 'left' }}>
                    <Upload
                      action=""
                      listType="picture-card"
                      fileList={fileList2}
                      onPreview={this.handlePreview2}
                      onChange={this.handleChange2}
                    >
                      {Array.isArray(fileList2)?fileList2.length >= 1 ? null : uploadButton:null}
                    </Upload>
                    <Modal visible={previewVisible2} footer={null} onCancel={this.handleCancel2}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage2} />
                    </Modal>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="&nbsp;&nbsp;是否停用">
                {getFieldDecorator('view', {
                  initialValue: 0,
                })(
                  <RadioGroup
                    style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}
                  >
                    <Radio name="privilege" value={1}>
                      是
                    </Radio>
                    <Radio name="privilege" value={0}>
                      否
                    </Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="子项是否允许手动输入">
                {getFieldDecorator('view', {
                  initialValue: 0,
                })(
                  <RadioGroup
                    style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}
                  >
                    <Radio name="privilege" value={1}>
                      是
                    </Radio>
                    <Radio name="privilege" value={0}>
                      否
                    </Radio>
                  </RadioGroup>
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
                    loading={false}
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
