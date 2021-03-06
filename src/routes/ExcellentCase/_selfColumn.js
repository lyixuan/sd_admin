import { Popover } from 'antd';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import caseDetail from '../../assets/caseDetail.svg';
import style from './ExcellentCase.css';

// 获取table列表头
export function columnsFn(callback) {
  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '认证项目',
      dataIndex: 'certificationItemName',
    },
    {
      title: '提交时间',
      dataIndex: 'applyTime',
    },
    {
      title: '报名',
      dataIndex: 'sign',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {text}
            {(text === '通过' || text === '未通过' || text === '不通过') && record.signRemark ? (
              <Popover
                content={<div className={style.bline}>{record.signRemark}</div>}
                trigger="click"
              >
                <img
                  src={caseDetail}
                  alt="packError"
                  style={{ marginLeft: '10px', lineHeight: '88px' }}
                />
              </Popover>
            ) : null}
          </div>
        );
      },
    },
    {
      title: '认证',
      dataIndex: 'auth',
      render: (text, record) => {
        return (
          <>
            {text}
            {(text === '通过' || text === '未通过' || text === '不通过') && record.authRemark ? (
              <Popover
                content={<div className={style.bline}>{record.authRemark}</div>}
                trigger="click"
              >
                <img
                  src={caseDetail}
                  alt="packError"
                  style={{ marginLeft: '10px', lineHeight: '88px' }}
                />
              </Popover>
            ) : null}
          </>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => {
        return (
          <AuthorizedButton authority="/excellent/checkCertifiedDetail">
            <div
              style={{
                color: '#52C9C2',
                cursor: 'pointer',
              }}
              onClick={() => callback(record)}
            >
              <span style={{ marginRight: '8px' }}>查看详情</span>
            </div>
          </AuthorizedButton>
        );
      },
    },
  ];
  return columns || [];
}
