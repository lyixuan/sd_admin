import React, { Component } from 'react';
import { Table, Button, Pagination, Form, Popconfirm, DatePicker } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
let propsVal = '';
const dateFormat = 'YYYY/MM/DD';

class RefundList extends Component {
  componentDidMount() {}

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
    const dataSource = !this.fillDataSource() ? [] : this.fillDataSource();
    const columns = !this.columnsData() ? [] : this.columnsData();
    const formLayout = 'inline';
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <Form onSubmit={this.handleSearch} layout={formLayout}>
          <FormItem label="可选范围">
            {getFieldDecorator('dateRange', {
              rules: [{ required: true, message: '请选择生效日期' }],
            })(
              <RangePicker
                defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                format={dateFormat}
                style={{ width: 230, height: 32 }}
              />
            )}
          </FormItem>
          <FormItem style={{ marginLeft: 119 }}>
            <Button type="primary" htmlType="submit" className={common.searchButton}>
              保存
            </Button>
          </FormItem>
        </Form>
      );
    });
    return (
      <ContentLayout
        pageHeraderUnvisible="unvisible"
        title="时间管理"
        contentForm={<WrappedAdvancedSearchForm />}
        contentButton={
          <div>
            <AuthorizedButton authority="/refund/refundAdd">
              <Button onClick={this.refundAdd} type="primary" className={common.searchButton}>
                添加
              </Button>
            </AuthorizedButton>
          </div>
        }
        contentTable={
          <Table bordered dataSource={dataSource} columns={columns} pagination={false} />
        }
        contentPagination={
          <Pagination
            showSizeChanger
            onChange={this.changePage}
            onShowSizeChange={this.onShowSizeChange}
            defaultCurrent={3}
            total={100}
            className={common.paginationStyle}
          />
        }
      />
    );
  }
}
export default RefundList;
