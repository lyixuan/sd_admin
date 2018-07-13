import React, { Component } from 'react';
import { Table, Button, Form, Input, Pagination } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

const FormItem = Form.Item;
let propsVal = '';
let firstTeaName = '';
let firstQualityNum = '';
@connect(({ quality, loading }) => ({
  quality,
  loading,
}))
class QualityList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const qualityListParams = { size: 30, number: 0 };
    this.props.dispatch({
      type: 'quality/getQualityList',
      payload: { qualityListParams },
    });
  }
  componentWillUnmount() {
    firstTeaName = null;
    firstQualityNum = null;
  }

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    const qualityListParams = { size: pageSize, number: current - 1 };
    this.props.dispatch({
      type: 'quality/getQualityList',
      payload: { qualityListParams },
    });
  };
  // 点击某一页函数
  changePage = (current, pageSize) => {
    const qualityListParams = { size: pageSize, number: current - 1 };
    this.props.dispatch({
      type: 'quality/getQualityList',
      payload: { qualityListParams },
    });
  };

  // 表单搜索函数
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        firstTeaName = values.teaName;
        firstQualityNum = values.qualityNum;
        const qualityListParams = {
          size: 30,
          number: 0,
          teaName: !values.teaName ? undefined : values.teaName,
          qualityNum: !values.qualityNum ? undefined : values.qualityNum,
        };
        this.props.dispatch({
          type: 'quality/getQualityList',
          payload: { qualityListParams },
        });
      }
    });
  };
  // 表单重置
  handleReset = () => {
    firstTeaName = '';
    firstQualityNum = '';
    propsVal.form.resetFields();
    this.props.setCurrentUrlParams({});
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        id: item.id,
        collegeName: item.collegeName,
        familyName: item.familyName,
        groupName: item.groupName,
        teaName: item.teaName,
        stuName: item.stuName,
        qualityTypeName: item.qualityTypeName,
        qualityNum: item.qualityNum,
      })
    );
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '序列',
        dataIndex: 'id',
      },
      {
        title: '学院',
        dataIndex: 'collegeName',
      },
      {
        title: '家族',
        dataIndex: 'familyName',
      },
      {
        title: '组别',
        dataIndex: 'groupName',
      },
      {
        title: '归属班主任',
        dataIndex: 'teaName',
      },
      {
        title: '学员姓名',
        dataIndex: 'stuName',
      },
      {
        title: '违规等级',
        dataIndex: 'qualityTypeName',
      },
      {
        title: '质检单号',
        dataIndex: 'qualityNum',
      },
    ];
    return columns;
  };

  // 删除质检
  qualityDel = () => {
    this.props.setRouteUrlParams('/quality/qualityDel', {
      a: 2,
      b: 3,
    });
  };

  // 添加质检
  qualityAdd = () => {
    this.props.setRouteUrlParams('/quality/qualityAdd', {
      a: 2,
      b: 3,
    });
  };

  render() {
    const val = this.props.quality.qualityList;
    const data = !val.response ? [] : !val.response.data ? [] : val.response.data;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = !this.columnsData() ? [] : this.columnsData();
    const formLayout = 'inline';
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <FormItem>
              {getFieldDecorator('teaName', {
                initialValue: firstTeaName,
                rules: [],
              })(<Input placeholder="请输入归属班主任" style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem style={{ marginLeft: 119 }}>
              {getFieldDecorator('qualityNum', {
                initialValue: firstQualityNum,
                rules: [],
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
        title="质检列表"
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
            <p className={common.totalNum}>总数：{totalNum}条</p>
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
            onChange={this.changePage}
            onShowSizeChange={this.onShowSizeChange}
            defaultCurrent={1}
            total={totalNum}
            className={common.paginationStyle}
          />
        }
      />
    );
  }
}

export default QualityList;
