/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Select, Spin, Upload, Modal,message } from 'antd';
import common from '../../Common/common.css';

const FormItem = Form.Item;
const { Option } = Select;

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
    };
  }
  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    const {fileList1=[],fileList2=[]}=this.state;
    const file1=fileList1.length;
    const file2=fileList2.length
    console.log(file1,file2)
    if(file1===0 || file2===0){
      message.error('已获得或未获得图片是必传项，请选择！')
    }else{
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values)
          // this.props.handleSubmit(values);
        }
      });
    }
  };

  // 删除已获得认证图标
  handleCancel1 = () =>{
    this.setState({ previewVisible1: false});
  }
  // 删除未获得认证图标
  handleCancel2 = () => {
    this.setState({ previewVisible2: false});
  }

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
    const file=fileList.length>0?fileList[0]:{}
    const {type=null}=file
    const isPNG =type === 'image/png';
    if (!isPNG &&type) {
      message.error('图片仅支持PNG格式，请重新选择!');
    }else if(!type){
      this.setState({ fileList1: [] });
    }
    else{
      this.setState({ fileList1: fileList });
    }
  };

  handleChange2 = ({ fileList }) => {
    const file=fileList.length>0?fileList[0]:{}
    const {type=null}=file
    const isPNG =type === 'image/png';
    if (!isPNG &&type) {
      message.error('图片仅支持PNG格式，请重新选择!');
    }else if(!type){
      this.setState({ fileList2: [] });
    }else{
      this.setState({ fileList2: fileList });
    }
  };

  beforeUpload=(file)=> {
    const isPNG = file.type === 'image/png';
    if (!isPNG) {
      message.error('图片仅支持PNG格式!');
    }
    return isPNG;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { submit } = this.props.jumpFunction;
    const { TextArea } = Input;
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
                        }else if (!reg.test(value) && value) {
                          callback({ message: '排序需要是3-6位数字组成，请修改！' });
                        }else{
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
                        }else if (reg.length > 15) {
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
                })(<TextArea rows={4} style={{ width: '280px',height:'84px' }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*已获得认证图标">
                {getFieldDecorator('obtainedIcon', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value ) {
                            callback({ message: '已获得认证图标为必填项，请上传！' });
                        }else{
                            callback();
                          }
                      },
                    },
                  ],
                })(
                  <div style={{ width: '280px', textAlign: 'left' }}>
                    <Upload
                      action=""
                      listType="picture-card"
                      fileList={fileList1}
                      onPreview={this.handlePreview1}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange1}
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
                })(<TextArea rows={4} style={{ width: '280px',height:'84px' }} />)}
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
                        }else{
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <div style={{ width: '280px', textAlign: 'left' }}>
                    <Upload
                      action=""
                      listType="picture-card"
                      fileList={fileList2}
                      onPreview={this.handlePreview2}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange2}
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
