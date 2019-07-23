// 获取table列表头
export function columnsFn() {
  const columns = [
    {
      title: '组织',
      dataIndex: 'id',
      width: '80px',
    },
    {
      title: '家族',
      dataIndex: 'bizDate',
    },
    {
      title: '家族长',
      dataIndex: 'ordId',
    },
    {
      title: '家族长ID',
      dataIndex: 'orgName',
    },
    {
      title: '累计选课人数',
      dataIndex: 'cpName',
    },
    {
      title: '当前在服人数',
      dataIndex: 'stuName',
    },
    {
      title: '应出勤人数',
      dataIndex: 'recommendLevel',
    },
    {
      title: '实际出勤人数',
      dataIndex: 'upFlag',
    },
    {
      title: '出勤率',
      dataIndex: 'countValue',
    },
    {
      title: '家族人数',
      dataIndex: 'upFlag',
    },
    {
      title: '人均应出勤学院',
      dataIndex: 'countValue',
    },
    {
      title: '足课人数',
      dataIndex: 'upFlag',
    },
    {
      title: '足课率',
      dataIndex: 'countValue',
    },
    {
      title: '足课转化人数',
      dataIndex: 'countValue',
    },
    {
      title: '足课转化率',
      dataIndex: 'countValue',
    },
  ];
  return columns || [];
}
