import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, DatePicker, Row, Col, message,Table } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';
import ModalDialog from '../../selfComponent/Modal/Modal';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
let propsVal = '';
let firstBeginTime = '';
let firstEndTime = '';
const dateFormat = 'YYYY-MM-DD';

@connect(({ cacheManage, loading }) => ({
  cacheManage,
  submit: loading.models.updateCache,
  cacheUpdate: loading.models.cacheList,
}))
class CacheManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  // 页面render之前需要请求的接口
  componentDidMount() {
    this.getCatchData();
  }



  componentWillUnmount() {
    firstBeginTime = null;
    firstEndTime = null;
  }
  onChange = (dates, dateStrings) => {
    const aa = dateStrings[0];
    const bb = dateStrings[1];
    firstBeginTime = aa;
    firstEndTime = bb;
  };

  getCatchData = params => {
    const cacheListParams = params;
    this.props.dispatch({
      type: 'cacheManage/cacheList',
      payload: { cacheListParams },
    });
  };

  setDialogSHow(bol) {
    this.setState({
      visible: bol,
    });
  }

  // 确定弹框
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields(err => {
      if (!err) {
        if (!firstBeginTime) {
          message.error('缓存时间为必选项，请选择');
        } else {
          this.setDialogSHow(true);
        }
      }
    });
  };

  // 模态框回显
  clearCache = () => {
    const updateCacheParams = {
      beginDate: !firstBeginTime ? undefined : `${firstBeginTime} 00:00:00`,
      endDate: !firstEndTime ? undefined : `${firstEndTime} 00:00:00`,
    };
    this.props.dispatch({
      type: 'cacheManage/updateCache',
      payload: { updateCacheParams },
    });
    this.setDialogSHow(false);
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '时间',
        dataIndex: 'dateTime',
        width: 400,
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
    ];
    return columns;
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    const arr =[]
    Object.keys(val).map(key => {
      return arr.push({ data: key,status:val[key] });
    })
    arr.map((item, index) =>
      data.push({
        key: index,
        dateTime:item.data,
        status:item.status==='1'?'刷新成功':(item.status==='2'?'刷新失败':'刷新中'),
      })
    );
    return data;
  };
  fresh=()=>{
    this.getCatchData();
  }

  render() {
    const {cacheListData} = this.props.cacheManage;
    const dataSource = !cacheListData
      ? []
      : !cacheListData.data
        ? []
        : this.fillDataSource(!cacheListData.data ? {} : cacheListData.data);

    const { submit ,cacheUpdate} = this.props;
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label="需刷新缓存时间">
                {getFieldDecorator('dateRange', {
                  initialValue: !firstEndTime
                    ? null
                    : [moment(firstBeginTime, dateFormat), moment(firstEndTime, dateFormat)],
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '请选择刷新缓存时间' });
                        }
                        callback();
                      },
                    },
                  ],
                })(
                  <RangePicker
                    format={dateFormat}
                    style={{ width: 230, height: 32 }}
                    onChange={this.onChange}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <FormItem>
                <AuthorizedButton authority="/complaint/complaintAdd">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={common.createButton}
                    loading={submit}
                  >
                    确定
                  </Button>
                </AuthorizedButton>
                <AuthorizedButton authority="/complaint/complaintAdd">
                  <Button
                    type="primary"
                    onClick={this.fresh}
                    className={common.createButton}
                    loading={submit}
                    style={{marginLeft:'20px'}}
                  >
                    刷新
                  </Button>
                </AuthorizedButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      );
    });

    const modalContent = (
      <div>
        <p style={{ textAlign: 'center', marginBottom: '10px' }}>
          {' '}
          即将刷新{firstBeginTime}～{firstEndTime}的缓存，请确认！{' '}
        </p>
      </div>
    );

    const columns = !this.columnsData() ? [] : this.columnsData();
    return (
      <div>
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={<WrappedAdvancedSearchForm />}

          contentTable={
            <div style={{ width: '590px' ,marginTop:'40px'}}>
              <Table
                bordered
                loading={cacheUpdate}
                dataSource={dataSource}
                columns={columns}
                useFixedHeader
                scroll={{ y: 600 }}
                pagination={false}
              />
            </div>
          }

        />
        <ModalDialog
          title="确认"
          visible={this.state.visible}
          modalContent={modalContent}
          clickOK={() => this.clearCache()}
          footButton={['取消', '提交']}
          showModal={bol => {
            this.setDialogSHow(bol);
          }}
        />
      </div>
    );
  }
}

export default CacheManage;
