import { Popover } from 'antd';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import { formatDate } from '../../utils/FormatDate';
import { BOTTOM_TABLE_STATUS } from '../../utils/constants';
import caseDetail from '../../assets/caseDetail.svg';
import compress from '../../assets/compress.svg';
import style from './ExcellentCase.css';

// 获取table列表头
export function columnsFn(callback) {
  const columns = [
    {
      title: '序号',
      dataIndex: 'type',
    },
    {
      title: '认证项目',
      dataIndex: 'taskName',
      render: text => {
        return (
          <>
            <img src={compress} alt="compress" style={{ marginRight: '8px' }} />
            {text}
          </>
        );
      },
    },
    {
      title: '提交时间',
      dataIndex: 'bottomTime',
      render: text => formatDate(text).substr(0, 10),
    },
    {
      title: '报名',
      dataIndex: 'createTime',
      render: (text, record) => {
        return (
          <>
            <span>{text ? '待审核' : '通过'}</span>
            <Popover
              content={<div className={style.bline}>内容测试{record.reason}</div>}
              trigger="click"
            >
              <img src={caseDetail} alt="packError" style={{ marginLeft: '10px' }} />
            </Popover>
          </>
        );
      },
    },
    {
      title: '认证',
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <>
            {BOTTOM_TABLE_STATUS.map(item => {
              if (Number(item.id) === text) {
                return item.name;
              }
              return null;
            })}
            <Popover
              content={<div className={style.bline}>内容测试{record.reason}</div>}
              trigger="click"
            >
              <img src={caseDetail} alt="packError" style={{ marginLeft: '10px' }} />
            </Popover>
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
                display: 'flex',
                justifyContent: 'space-around',
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
