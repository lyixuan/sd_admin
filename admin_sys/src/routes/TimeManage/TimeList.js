import React, { Component } from 'react';
import { Table, Button, Form, Popconfirm, DatePicker } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';
import styles from './TimeList.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
let propsVal = '';
const dateFormat = 'YYYY/MM/DD';

class TimeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {}

  // 添加
  onAdd = () => {
    this.showModal(true);
  };
  // 删除账号函数  删除后数据更新？
  onDelete = key => {
    console.log(key.id);
    const deleteAccountParams = { accountId: key.id };
    const accountListParams = {};
    this.props.dispatch({
      type: 'account/deleteAccount',
      payload: { deleteAccountParams, accountListParams },
    });
  };
  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  showModal = bol => {
    this.setState({
      visible: bol,
    });
  };
  // 点击某一页函数
  changePage = (current, pageSize) => {
    console.log(current, pageSize);
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    let val = {};
    propsVal.form.validateFields((err, values) => {
      val = values;
    });

    this.props.setCurrentUrlParams(val);
  };

  // 初始化tabale 列数据
  fillDataSource = () => {
    const data = [];
    for (let i = 0; i < 50; i += 1) {
      data.push({
        key: i,
        name: `张三`,
        role: `院长`,
        status: `启用`,
        email: `hello${i}@sunlands.com`,
      });
    }
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '时间',
        dataIndex: 'key',
        width: 400,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/account/editAccount">
                <Popconfirm title="是否确认删除时间?" onConfirm={() => this.onDelete(record)}>
                  <span style={{ color: '#52C9C2', marginLeft: 12 }}>删除</span>
                </Popconfirm>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns;
  };
  render() {
    const { visible } = this.state;
    const dataSource = !this.fillDataSource() ? [] : this.fillDataSource();
    const columns = !this.columnsData() ? [] : this.columnsData();
    const formLayout = 'inline';

    const datePicker = (
      <RangePicker
        initialValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
        format={dateFormat}
        style={{ width: 230, height: 32 }}
      />
    );

    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <Form onSubmit={this.handleSearch} layout={formLayout}>
          <p className={styles.formTitle}>“自定义时间”可选范围设置</p>
          <div className={styles.formCls}>
            <FormItem label="可选范围">
              {getFieldDecorator('dateRange', {
                rules: [{ required: true, message: '请选择生效日期' }],
              })(datePicker)}
            </FormItem>
            <FormItem style={{ marginLeft: 119 }}>
              <Button
                type="primary"
                htmlType="submit"
                className={common.searchButton}
                style={{ margin: '0' }}
              >
                保存
              </Button>
            </FormItem>
          </div>
        </Form>
      );
    });
    return (
      <div>
        <ContentLayout
          pageHeraderUnvisible="unvisible"
          title="时间管理"
          contentForm={<WrappedAdvancedSearchForm />}
          contentButton={
            <div>
              <p className={styles.tableTitle}>“不可用日期”设置</p>
              <p className={styles.content}>
                <span className={styles.txt}>设置不可用的日期（指定日期将不参与学分计算）</span>
                <AuthorizedButton authority="/timeManage/TimeList">
                  <Button
                    onClick={this.onAdd}
                    type="primary"
                    className={common.searchButton}
                    style={{ margin: '0 14px' }}
                  >
                    添加
                  </Button>
                </AuthorizedButton>
              </p>
            </div>
          }
          contentTable={
            <div style={{ width: '590px' }}>
              <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                useFixedHeader
                scroll={{ y: 600 }}
                pagination={false}
              />
            </div>
          }
          // contentPagination={
          //   <Pagination
          //     showSizeChanger
          //     onChange={this.changePage}
          //     onShowSizeChange={this.onShowSizeChange}
          //     defaultCurrent={3}
          //     total={100}
          //     className={common.paginationStyle}
          //     style={{width:'590px'}}
          //   />
          // }
        />
        <ModalDialog
          title="添加不可用时间"
          visible={visible}
          modalContent={datePicker}
          showModal={bol => this.showModal(bol)}
        />
      </div>
    );
  }
}
export default TimeList;
