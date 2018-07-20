import React from 'react';
import { Input, Icon } from 'antd';
import styles from './index.less';

const map = {
  UserName: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: '请输入邮箱',
    },
    rules: [
      {
        required: true,
      },
    ],
  },
  Password: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '请输入密码',
    },
    rules: [
      {
        required: true,
        min: 6,
        max: 16,
        message: '密码由6-16位英文字母、数字或符号组成',
      },
    ],
  },
  NoHintPwd: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '请输入密码',
    },
    rules: [
      {
        required: true,
        message: '密码不能为空!',
      },
    ],
  },
  Mobile: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Emil: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: '请输入账户邮箱',
    },
    rules: [
      {
        required: true,
        message: '账户不能为空!',
      },
    ],
  },
  Captcha: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: '验证码不能为空!',
      },
    ],
  },
};

export default map;
