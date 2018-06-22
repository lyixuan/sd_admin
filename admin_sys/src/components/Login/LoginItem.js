import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col } from 'antd';
import omit from 'omit.js';
import styles from './index.less';
import map from './map';

const FormItem = Form.Item;

function generator({ defaultProps, defaultRules, type }) {
  return WrappedComponent => {
    return class BasicComponent extends Component {
      static contextTypes = {
        form: PropTypes.object,
        updateActive: PropTypes.func,
      };

      constructor(props) {
        super(props);
        this.state = {
          count: 0,
        };
      }

      componentDidMount() {
        if (this.context.updateActive) {
          this.context.updateActive(this.props.name);
        }
      }

      componentWillUnmount() {
        clearInterval(this.interval);
      }

      onGetCaptcha = () => {
        let count = 59;
        this.setState({ count });
        if (this.props.onGetCaptcha) {
          this.props.onGetCaptcha();
        }
        this.interval = setInterval(() => {
          count -= 1;
          this.setState({ count });
          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
      };
      /*
      用于点击验证码的回调
      */
      changeGetCaptcha = () => {
        if (this.props.onChange) {
          this.props.onChange();
        }
      };

      render() {
        const { getFieldDecorator } = this.context.form;
        const options = {};
        let otherProps = {};
        const { onChange, defaultValue, rules, name, ...restProps } = this.props;
        options.rules = rules || defaultRules;
        if (onChange) {
          options.onChange = onChange;
        }
        if (defaultValue) {
          options.initialValue = defaultValue;
        }
        otherProps = restProps || otherProps;
        if (type === 'Captcha') {
          const inputProps = omit(otherProps, ['onGetCaptcha']);
          return (
            <FormItem>
              <Row gutter={8}>
                <Col span={14}>
                  {getFieldDecorator(name, options)(
                    <WrappedComponent {...defaultProps} {...inputProps} />
                  )}
                </Col>
                <Col span={10}>
                  <span className={styles.captchaBox}>
                    <i>{this.props.showcaptcha ? this.props.showcaptcha : ''}</i>
                  </span>
                  <span className={styles.changeImg} onClick={this.changeGetCaptcha}>
                    换一张
                  </span>
                </Col>
              </Row>
            </FormItem>
          );
        }
        return (
          <FormItem>
            {getFieldDecorator(name, options)(
              <WrappedComponent {...defaultProps} {...otherProps} />
            )}
          </FormItem>
        );
      }
    };
  };
}

const LoginItem = {};
Object.keys(map).forEach(item => {
  LoginItem[item] = generator({
    defaultProps: map[item].props,
    defaultRules: map[item].rules,
    type: item,
  })(map[item].component);
});

export default LoginItem;
