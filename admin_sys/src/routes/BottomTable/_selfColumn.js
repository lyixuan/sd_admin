import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import packSucess from '../../assets/packSucess.svg';
import packError from '../../assets/packError.svg';
import compress from '../../assets/compress.svg';
// import packing from '../../assets/packing.svg';

// 获取table列表头
export function columnsFn(callback) {
  const columns = [
    {
      title: '底表名称',
      dataIndex: 'id',
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
    },
    {
      title: '底表时间',
      dataIndex: 'stuId',
    },
    {
      title: '添加时间',
      dataIndex: 'countBeginTime',
    },
    {
      title: '任务状态',
      dataIndex: 'ordId',
      render: text => {
        return (
          <>
            <img
              src={text !== 2 ? packError : packSucess}
              alt="packError"
              style={{ marginRight: '8px' }}
            />
            {text}
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
            {Number(record.ordId) !== 2 ? null : (
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
