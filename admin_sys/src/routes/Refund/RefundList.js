import React, { Component } from 'react';
import { Table, Button, Popconfirm, Pagination, Form, Row, Col, Input } from 'antd';

import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import styles from '../../common/AdvancedSearchForm.css';

const paramsObj = {
  username: '投诉时间',
  password: '子订单编号',
};
const FormItem = Form.Item;
let propsVal = '';

class RoleList extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: '100px',
      },
      {
        title: '角色',
        dataIndex: 'role',
        width: '200px',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: '300px',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '100px',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '100px',
        render: (text, record) => {
          return this.state.dataSource.length > 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              <a href="">编辑</a>
            </Popconfirm>
          ) : null;
        },
      },
    ];

    const dataSource = [
      {
        key: 1,
        name: `张三`,
        role: `院长`,
        status: `启用`,
        email: `hello@sunlands.com`,
      },
      {
        key: 2,
        name: `王五`,
        role: `学员`,
        status: `启用`,
        email: `hello@sunlands.com`,
      },
      {
        key: 3,
        name: `赵六`,
        role: `院长`,
        status: `禁止`,
        email: `hello@sunlands.com`,
      },
    ];

    this.state = {
      dataSource: !dataSource ? [] : dataSource,
      count: 3,
      username: params.username || 1223,
      password: params.password || 1111,
    };
  }

  componentDidMount() {}

  onDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
  getFields = () => {
    const count = 4;
    const { getFieldDecorator } = propsVal.form;
    const children = [];
    Object.keys(paramsObj).map((key, i) => {
      return children.push(
        <Col span={8} key={key} style={{ display: i < count ? 'block' : 'none' }}>
          <FormItem label={paramsObj[key]}>
            {getFieldDecorator(key, {
              initialValue: this.state.username,
              rules: [
                {
                  required: true,
                  message: '请输入搜索内容!',
                },
              ],
            })(<Input placeholder={`请输入${paramsObj[key]}`} />)}
          </FormItem>
        </Col>
      );
    });
    return children;
  };
  handleSearch = e => {
    e.preventDefault();
    let val = {};
    propsVal.form.validateFields((err, values) => {
      val = values;
    });
    console.log(val);
    this.setState({
      username: val.username,
    });
    this.props.setCurrentUrlParams(val);
  };

  handleReset = () => {
    propsVal.form.resetFields();
    this.props.setCurrentUrlParams({ s: 5 });
  };
  refundAdd = () => {
    const { count, dataSource } = this.state;
    this.props.history.push({
      pathname: '/refund/refundAdd',
      search: JSON.stringify({ s: 2 }),
    });
    const newData = {
      key: count + 1,
      name: `李四 ${count + 1}`,
      role: `质检员${count + 1}`,
      status: `禁止${count + 1}`,
      email: `world${count + 1}@sunlands.com`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  refundDel = () => {
    this.props.history.push({
      pathname: '/refund/refundDel',
      search: JSON.stringify({ s: 2 }),
    });
  };
  render() {
    const { dataSource } = this.state;
    const columns = !this.columns ? [] : this.columns;

    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      return (
        <Form className={styles.searchForm} onSubmit={this.handleSearch}>
          <Row gutter={24}>{this.getFields()}</Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      );
    });
    return (
      <ContentLayout
        contentForm={<WrappedAdvancedSearchForm />}
        contentButton={
          <div>
            <AuthorizedButton authority="/refund/refundAdd">
              <Button
                onClick={this.refundAdd}
                type="primary"
                style={{ margin: '20px 10px 16px 0' }}
              >
                添加退费
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/refund/refundDel">
              <Button
                onClick={this.refundDel}
                type="primary"
                style={{ margin: '20px 10px 16px 0' }}
              >
                删除退费
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
            onShowSizeChange={this.onShowSizeChange}
            defaultCurrent={3}
            total={100}
          />
        }
      />
    );
  }
}
export default RoleList;
