import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import dict from 'utils/dictionaries';
import common from '../../routes/Common/common.css';
import styles from './PerformanceForm.less';

const FormItem = Form.Item;
class PerformanceForm extends Component {
  constructor(props) {
    super(props);
    // const fromWhere = this.props.jumpFunction.getUrlParams();
    this.state = {
      // id: !fromWhere.id ? '' : fromWhere.id,
    };
  }
  getUserInfo = () => {
    const actualKpiInfo = this.props.actualKpiInfo || {};
    const { totalKpi, userId } = actualKpiInfo;
    return { totalKpi, id: userId };
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { actualKpi } = values;
        const params = {
          actualKpi,
          ...this.getUserInfo(),
        };
        this.props.handleSubmit(params);
      }
    });
  };
  // 整合学院|家族|小组展示
  renderCollegeName = item => {
    if (item.collegeName && item.familyName && item.groupName) {
      return `${item.collegeName} | ${item.familyName} | ${item.groupName}`;
    } else if (item.collegeName && item.familyName) {
      return `${item.collegeName} | ${item.familyName}`;
    } else {
      return `${item.collegeName || ''}`;
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const actualKpiInfo = this.props.actualKpiInfo || {};
    const users = actualKpiInfo.user || {};
    const kpiEffectMonth = actualKpiInfo.kpiEffectMonth || {};
    const { submitLoading } = this.props.jumpFunction;
    return (
      <div className={styles.m_performance}>
        <Row type="flex" justify="start">
          <Col span={12}>
            <span className={styles.u_lableWidth}>身份证号：</span>
            <span>{users.idCard}</span>
          </Col>
          <Col span={12}>
            <span className={styles.u_lableWidth}>
              姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：
            </span>
            <span>{users.name}</span>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={12}>
            <span className={styles.u_lableWidth}>
              岗&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位：
            </span>
            <span>{dict.groupTypeDict[users.userType]}</span>
          </Col>
          <Col span={12}>
            <span className={styles.u_lableWidth}>学院|家族|小组：</span>
            <span>{this.renderCollegeName(actualKpiInfo)}</span>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={12}>
            <span className={styles.u_lableWidth}>
              月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份：
            </span>
            <span>{kpiEffectMonth.effectMonth}</span>
          </Col>
          <Col span={12}>
            <span className={styles.u_lableWidth}>总包金额：</span>
            <span>{actualKpiInfo.totalKpi}</span>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={12}>
            <span className={`${styles.u_lableWidth} ${styles.u_wrapWidth}`}>基本绩效：</span>
            <span>{actualKpiInfo.basicKpi}</span>
          </Col>
          <Col span={12}>
            <span className={`${styles.u_lableWidth} ${styles.u_wrapWidth}`}>打分绩效：</span>
            <span>{actualKpiInfo.floatKpi}</span>
          </Col>
        </Row>

        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row type="flex" justify="start">
            <Col span={12}>
              <FormItem label="实发金额：">
                {getFieldDecorator('actualKpi', {
                  initialValue: actualKpiInfo.actualKpi,
                  rules: [
                    {
                      pattern: /^\d{1,10}$/g,
                      message: '输入金额不合法',
                      required: true,
                    },
                  ],
                })(<Input style={{ width: 280, height: 32 }} />)}
                <span className={styles.inputTip}>更新实发金额后，打分绩效=实发金额-基本绩效</span>
              </FormItem>
            </Col>
          </Row>
          <br /> <br />
          <Row type="flex" justify="end">
            <FormItem>
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
                loading={submitLoading}
              >
                提交
              </Button>
            </FormItem>
          </Row>
        </Form>
      </div>
    );
  }
}

export default PerformanceForm;
