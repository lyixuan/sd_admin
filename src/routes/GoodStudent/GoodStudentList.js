import React, { Component } from 'react';
import { Table, Button, Form, Input, Row, Col } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

const FormItem = Form.Item;
let propsVal = '';
let firstTeaName = '';
let firstQualityNum = '';
let firstPage = 0; // 分页的默认起开页面
@connect(({ goodStudent, loading }) => ({
  goodStudent,
  loading: loading.models.goodStudent,
}))
class GoodStudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const initVal = this.props.getUrlParams();
    firstTeaName = !initVal.firstTeaName ? '' : initVal.firstTeaName;
    firstQualityNum = !initVal.firstQualityNum ? '' : Number(initVal.firstQualityNum);
    firstPage = !initVal.firstPage ? 0 : Number(initVal.firstPage);
    const teaName = !firstTeaName ? undefined : firstTeaName;
    const qualityNum = !firstQualityNum ? undefined : firstQualityNum;
    const number = !firstPage ? 0 : firstPage;
    this.getData({ size: 30, number, teaName, qualityNum });
  }

  componentWillUnmount() {
    firstTeaName = null;
    firstQualityNum = null;
  }

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.changePage(current, pageSize);
  };

  getData = params => {
    const getListParams = { ...this.props.goodStudent.getListParams, ...params };
    this.props.dispatch({
      type: 'goodStudent/getQualityList',
      payload: { getListParams },
    });
  };
  // 点击某一页函数
  changePage = (current, pageSize) => {
    firstPage = current - 1;
    this.props.setCurrentUrlParams({ firstPage });
    this.getData({
      size: pageSize,
      number: firstPage,
      teaName: !firstTeaName ? undefined : firstTeaName,
      qualityNum: !firstQualityNum ? undefined : firstQualityNum,
    });
  };

  // 表单搜索函数
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        firstTeaName = !values.teaName ? undefined : values.teaName;
        firstQualityNum = !values.qualityNum ? undefined : values.qualityNum;
        firstPage = 0;
        const qualityListParams = {
          size: 30,
          number: 0,
          teaName: firstTeaName,
          qualityNum: firstQualityNum,
        };
        this.getData(qualityListParams);
        this.props.setCurrentUrlParams({ firstTeaName, firstQualityNum, firstPage });
      }
    });
  };
  // 表单重置
  handleReset = () => {
    firstTeaName = '';
    firstQualityNum = '';
    firstPage = 0;
    propsVal.form.resetFields();
    this.props.setRouteUrlParams('/goodStudent/qualityList');
    this.getData({ size: 30, number: 0 });
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
        width: '80px',
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

  // 删除数据
  goodStudentDel = () => {
    this.props.setRouteUrlParams('/goodStudent/goodStudentDel');
  };

  // 添加数据
  goodStudentAdd = () => {
    this.props.setRouteUrlParams('/goodStudent/goodStudentAdd');
  };

  render() {
    const val = this.props.goodStudent.qualityList;
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
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="归属班主任">
                  {getFieldDecorator('teaName', {
                    initialValue: firstTeaName,
                    rules: [],
                  })(<Input placeholder="请输入归属班主任" style={{ width: 230, height: 32 }} />)}
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <FormItem label="质检单号">
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
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <FormItem>
                  <Button
                    onClick={this.handleSearch}
                    type="primary"
                    className={common.searchButton}
                  >
                    搜 索
                  </Button>
                  <Button onClick={this.handleReset} type="primary" className={common.resetButton}>
                    重 置
                  </Button>
                </FormItem>
              </Col>
            </Row>
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
            <AuthorizedButton authority="/goodStudent/goodStudentAdd">
              <Button
                onClick={this.goodStudentAdd}
                type="primary"
                className={common.addQualityButton}
              >
                添加数据
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/goodStudent/goodStudentDel">
              <Button
                onClick={this.goodStudentDel}
                type="primary"
                className={common.deleteQualityButton}
              >
                删除数据
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
            defaultCurrent={firstPage + 1}
            total={totalNum}
            defaultPageSize={30}
          />
        }
      />
    );
  }
}

export default GoodStudentList;
