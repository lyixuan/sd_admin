import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Dropdown, Avatar, Divider } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import styles from './index.less';
import bilogo from '../../assets/new-logo.png';
import downloadImg from '../../assets/download.png';
import {MENU_HOST} from '../../utils/constants';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser = {},
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      selectedGroup,
    } = this.props;
    let logoUrl = MENU_HOST + '/inspector/indexPage';
    let downloadUrl = MENU_HOST + '/inspector/downloadCenter';
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {selectedGroup.map(item => (
          <Menu.Item key={item.id}>
            <span style={{ display: 'inline-block', width: '20px', marginLeft: '-3px' }}>
              <Icon type={item.icon} style={{ fontSize: 14, position: 'relative' }} />
            </span>
            {item.name}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={bilogo} alt="logo" width="24" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <a href={logoUrl}>
          <img src={bilogo} alt="logo" className={styles.newLogo} />
        </a>
        {/*<Icon*/}
        {/*  className={styles.trigger}*/}
        {/*  type={collapsed ? 'menu-unfold' : 'menu-fold'}*/}
        {/*  onClick={this.toggle}*/}
        {/*/>*/}
        <div className={styles.right}>
          <a className={styles.download} href={downloadUrl}>
            <img src={downloadImg} alt="" className={styles.image}/>
          </a>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="large" className={styles.avatar} src={currentUser.avatar} />
                {/*<span className={styles.name}>{currentUser.name}</span>*/}
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
