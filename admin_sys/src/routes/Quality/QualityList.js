import React, { Component } from 'react';
import { Table, Button, Form, Input } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

const FormItem = Form.Item;
let propsVal = '';
let firstTeaName = '';
let firstQualityNum = '';
@connect(({ quality, loading }) => ({
  quality,
  loading: loading.models.quality,
}))
class QualityList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.getData({ size: 30, number: 0 });
  }

  componentWillUnmount() {
    firstTeaName = null;
    firstQualityNum = null;
  }

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.getData({ size: pageSize, number: current - 1 });
  };

  getData = params => {
    const getListParams = { ...this.props.quality.getListParams, ...params };
    this.props.dispatch({
      type: 'quality/getQualityList',
      payload: { getListParams },
    });
  };
  // 点击某一页函数
  changePage = (current, pageSize) => {
    this.getData({ size: pageSize, number: current - 1 });
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
        this.getData(qualityListParams);
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
        countValue: item.countValue,
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
        title: 'id',
        dataIndex: 'id',
        width: '65px',
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
        title: '扣除学分',
        dataIndex: 'countValue',
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
    this.props.setRouteUrlParams('/quality/qualityDel');
  };

  // 添加质检
  qualityAdd = () => {
    this.props.setRouteUrlParams('/quality/qualityAdd');
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
            <FormItem label="归属班主任">
              {getFieldDecorator('teaName', {
                initialValue: firstTeaName,
                rules: [],
              })(<Input placeholder="请输入归属班主任" style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem style={{ marginLeft: 119 }} label="质检单号">
              {getFieldDecorator('qualityNum', {
                initialValue: firstQualityNum,
                rules: [],
              })(
                <Input
                  placeholder="请输入质检单号"
                  maxLength={20}
                  style={{ width: 230, height: 32 }}
                />
              )}
            </FormItem>
            <FormItem style={{ marginLeft: 119 }}>
              <Button onClick={this.handleSearch} type="primary" className={common.searchButton}>
                搜 索
              </Button>
              <Button onClick={this.handleReset} type="primary" className={common.cancleButton}>
                重 置
              </Button>
            </FormItem>
          </Form>
        </div>
      );
    });
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={<WrappedAdvancedSearchForm />}
        contentButton={
          <div>
            <AuthorizedButton authority="/quality/qualityAdd">
              <Button onClick={this.qualityAdd} type="primary" className={common.addQualityButton}>
                添加质检
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/quality/qualityDel">
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
              loading={this.props.loading}
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              className={common.tableContentStyle}
            />
          </div>
        }
        contentPagination={
          <SelfPagination
            onChange={(current, pageSize) => {
              this.changePage(current, pageSize);
            }}
            onShowSizeChange={(current, pageSize) => {
              this.onShowSizeChange(current, pageSize);
            }}
            total={totalNum}
          />
        }
      />
    );
  }
}

export default QualityList;
