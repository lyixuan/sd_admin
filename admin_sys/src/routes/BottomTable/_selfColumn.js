import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import { formatDate } from '../../utils/FormatDate';
import { BOTTOM_TABLE_STATUS, BOTTOM_TABLE_LIST } from '../../utils/constants';
import packSucess from '../../assets/packSucess.svg';
import packError from '../../assets/packError.svg';
import compress from '../../assets/compress.svg';
import packing from '../../assets/packing.svg';

// 获取table列表头
export function columnsFn(callback) {
  const imgArr = [packing, packSucess, packError];
  const columns = [
    {
      title: '底表名称',
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
      title: '底表类型',
      dataIndex: 'type',
      render: text =>
        BOTTOM_TABLE_LIST.map(item => {
          if (Number(item.id) === text) {
            return item.name;
          }
          return null;
        }),
    },
    {
      title: '底表时间',
      dataIndex: 'bottomTime',
      render: text => formatDate(text).substr(0, 10),
    },
    {
      title: '添加时间',
      dataIndex: 'modifyTime',
      render: text => formatDate(text),
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      render: text => {
        return (
          <>
            <img src={imgArr[text]} alt="packError" style={{ marginRight: '8px' }} />
            {BOTTOM_TABLE_STATUS.map(item => {
              if (Number(item.id) === text) {
                return item.name;
              }
              return null;
            })}
          </>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => {
        return (
          <>
            {Number(record.status) !== 1 ? null : (
              <AuthorizedButton authority="/bottomTable/downloadBottomTable">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => callback(record)}
                >
                  下载
                </span>
              </AuthorizedButton>
            )}
          </>
        );
      },
    },
  ];
  return columns || [];
}
