import React, { Component } from 'react';
import { Table, Button, Form, Input, Pagination } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

const FormItem = Form.Item;
let propsVal = '';
class QualityList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '学院',
        dataIndex: 'college',
      },
      {
        title: '家族',
        dataIndex: 'family',
      },
      {
        title: '族别',
        dataIndex: 'familytype',
      },
      {
        title: '归属班主任',
        dataIndex: 'teacher',
      },
      {
        title: '学员姓名',
        dataIndex: 'name',
      },
      {
        title: '违规等级',
        dataIndex: 'status',
      },
      {
        title: '质检单号',
        dataIndex: 'nums',
      },
    ];

    const dataSource = [
      {
        key: 1,
        college: `自变量学院`,
        family: `第二家族`,
        familytype: `自己`,
        teacher: `杨紫`,
        name: `张三`,
        status: `二级`,
        nums: `110110110110`,
      },
      {
        key: 2,
        college: `动漫学院`,
        family: `斗罗家族`,
        familytype: `小小`,
        teacher: `杨紫琼`,
        name: `炸藕无`,
        status: `二级`,
        nums: `110110110110`,
      },
      {
        key: 3,
        college: `葫芦娃学院`,
        family: `自己家族`,
        familytype: `你猜`,
        teacher: `程序员`,
        name: `李四`,
        status: `二级`,
        nums: `110110110110`,
      },
    ];

    this.state = {
      dataSource: !dataSource ? [] : dataSource,
    };
  }
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  handleSearch = e => {
    e.preventDefault();
    let val = {};
    propsVal.form.validateFields((err, values) => {
      val = values;
    });
    this.props.setCurrentUrlParams(val);
  };
  handleReset = () => {
    propsVal.form.resetFields();
    this.props.setCurrentUrlParams({});
  };
  qualityDel = () => {
    this.props.setRouteUrlParams('/quality/qualityDel', {
      a: 2,
      b: 3,
    });
  };
  qualityAdd = () => {
    this.props.setRouteUrlParams('/quality/qualityAdd', {
      a: 2,
      b: 3,
    });
  };

  render() {
    console.log(this.props);
    const { dataSource } = this.state;
    const columns = !this.columns ? [] : this.columns;
    const formLayout = 'inline';
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <FormItem>
              {getFieldDecorator('teacher', {
                rules: [
                  {
                    required: true,
                    message: '请输入归属班主任!',
                  },
                ],
              })(<Input placeholder="请输入归属班主任" style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem style={{ marginLeft: 119 }}>
              {getFieldDecorator('numbers', {
                rules: [
                  {
                    required: true,
                    message: '请输入质检单号!',
                  },
                ],
              })(<Input placeholder="请输入质检单号" style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem style={{ marginLeft: 119 }}>
              <Button onClick={this.handleSearch} type="primary" className={common.searchButton}>
                搜 索
              </Button>
              <Button onClick={this.handleReset} type="primary" className={common.cancleButton}>
                取 消
              </Button>
            </FormItem>
          </Form>
        </div>
      );
    });
    return (
      <ContentLayout
        pageHeraderUnvisible="visible"
        contentForm={<WrappedAdvancedSearchForm />}
        contentButton={
          <div>
            <AuthorizedButton authority="/user/createUser">
              <Button onClick={this.qualityAdd} type="primary" className={common.addQualityButton}>
                添加质检
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/account/accountList">
              <Button
                onClick={this.qualityDel}
                type="primary"
                className={common.deleteQualityButton}
              >
                删除质检
              </Button>
            </AuthorizedButton>
          </div>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：500条</p>
            <Table
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              className={common.tableContentStyle}
            />
          </div>
        }
        contentPagination={
          <Pagination
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            defaultCurrent={1}
            total={100}
            className={common.paginationStyle}
          />
        }
      />
    );
  }
}

export default QualityList;
