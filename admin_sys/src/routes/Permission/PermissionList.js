import React, { Component } from 'react';
import { Table, Button, Form, Input, Row, Col } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
import { levelData } from '../../utils/dataDictionary';

const FormItem = Form.Item;
let propsVal = '';
let firstName = '';
let firstPage = 0; // 分页的默认起开页面
@connect(({ permission, loading }) => ({
  permission,
  loading: loading.effects['permission/permissionList'],
}))
class PermissionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const initVal = this.props.getUrlParams();
    firstName = !initVal.firstName ? '' : initVal.firstName;
    firstPage = !initVal.firstPage ? 0 : Number(initVal.firstPage);
    const permissionListParams = {
      size: 30,
      number: !firstPage ? 0 : firstPage,
      sort: 'id',
      name: !initVal.firstName ? undefined : initVal.firstName,
    };
    this.getData(permissionListParams)
  }
  componentWillUnmount() {
    firstName = null;
    firstPage = 0;
  }
  // 权限编辑
  onEdit = val => {
    this.props.setRouteUrlParams('/permission/editPermission', {
      id: val.id,
      level: val.level,
    });
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.changePage(current, pageSize);
  };

  getData=(permissionListParams)=>{
    this.props.dispatch({
      type: 'permission/permissionList',
      payload: { permissionListParams },
    });
  }

  // 点击某一页函数
  changePage = (current, pageSize) => {
    firstPage = current -1;
    this.props.setCurrentUrlParams({firstPage});
    const permissionListParams = { size: pageSize, number: firstPage, sort: 'id',name:!firstName?undefined:firstName};
    this.getData(permissionListParams)
  };

  // 表单重置
  handleReset = () => {
    firstName = '';
    firstPage = 0;
    propsVal.form.resetFields();
    this.props.setRouteUrlParams('/config/permissionList');
    this.getData({size: 30, number: 0, sort: 'id' })
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        firstName = values.name;
        firstPage = 0;
        this.props.setCurrentUrlParams({
          firstName: !values.name ? undefined : values.name,
          firstPage,
        });
        const permissionListParams = {
          name: !values.name ? undefined : values.name.replace(/\s*/g, ''),
          sort: 'id',
          size: 30,
          number: 0,
        };
        this.getData(permissionListParams)
      }
    });
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        id: item.id,
        name: item.name,
        level: levelData[item.level],
        resourceUrl: item.resourceUrl,
        parentId: item.parentId,
        iconUrl: item.iconUrl,
        sortFlag: item.sortFlag,
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
      },
      {
        title: '权限名称',
        dataIndex: 'name',
      },
      {
        title: '权限类型',
        dataIndex: 'level',
      },
      {
        title: '权限路由',
        dataIndex: 'resourceUrl',
      },
      {
        title: '上级编号',
        dataIndex: 'parentId',
      },
      {
        title: '一级页面图标',
        dataIndex: 'iconUrl',
        render: record => {
          return !record ? (
            <span>{!record ? '' : record}</span>
          ) : (
            <img src={record} alt="上一级页面图标" style={{ width: '30px' }} />
          );
          // <span>{record}</span>
        },
      },
      {
        title: '权限排序',
        dataIndex: 'sortFlag',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/permission/editPermission">
                <span
                  style={{ color: '#52C9C2', cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑
                </span>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns || [];
  };

  // 创建权限
  handleAdd = () => {
    this.props.setRouteUrlParams('/permission/createPermission', { a: 2, b: 3 });
  };

  render() {
    const { loading } = this.props;
    const data = !this.props.permission.permissionList.response
      ? []
      : !this.props.permission.permissionList.response.data
        ? []
        : this.props.permission.permissionList.response.data;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = this.columnsData();
    const formLayout = 'inline';
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="权限名称">
                  {getFieldDecorator('name', {
                    initialValue: firstName,
                  })(<Input placeholder="请输入权限名称" style={{ width: 230, height: 32 }} />)}
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <FormItem>
                  <Button htmlType="submit" type="primary" className={common.searchButton}>
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
          <AuthorizedButton authority="/permission/createPermission">
            <Button onClick={this.handleAdd} type="primary" className={common.createButton}>
              创 建
            </Button>
          </AuthorizedButton>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalNum}条</p>
            <Table
              bordered
              loading={loading}
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
            defaultCurrent={firstPage+1}
            total={totalNum}
            defaultPageSize={30}
            pageSizeOptions={['30']}
          />
        }
      />
    );
  }
}

export default PermissionList;
