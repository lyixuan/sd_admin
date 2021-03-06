// import { Progress } from 'antd';
import { STATIC_HOST } from '@/utils/constants';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import { formatDate } from '../../utils/FormatDate';
import { BOTTOM_TABLE_STATUS } from '../../utils/constants';
import packSucess from '../../assets/packSucess.svg';
import packError from '../../assets/packError.svg';
import compress from '../../assets/compress.svg';
import packing from '../../assets/packing.svg';
import DownLoad from '../../components/downLoad';

// 获取table列表头
export function columnsFn() {
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
    // {
    //   title: '底表类型',
    //   dataIndex: 'type',
    //   render: text =>
    //     BOTTOM_TABLE_LIST.map(item => {
    //       if (item.id !== '' && Number(item.id) === text) {
    //         return item.name;
    //       }
    //       return null;
    //     }),
    // },
    {
      title: '底表时间',
      dataIndex: 'bottomTime',
      render: text => formatDate(text).substr(0, 10),
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
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
                <div
                  style={{
                    color: '#52C9C2',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-around',
                  }}
                >
                  <div>
                    <DownLoad
                      loadUrl={`${STATIC_HOST}${record.zipPath}`}
                      fileName={() => record.taskName}
                    />
                  </div>
                  {/* <span style={{ marginRight: '8px' }}>下载</span> */}
                  {/* <div style={{ width: '32px' }}> */}
                  {/* <Progress percent={percent} showInfo={false} /> */}
                  {/* </div> */}
                </div>
              </AuthorizedButton>
            )}
          </>
        );
      },
    },
  ];
  return columns || [];
}
