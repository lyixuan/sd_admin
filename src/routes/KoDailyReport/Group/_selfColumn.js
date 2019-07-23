// 获取table列表头
export function columnsFn() {
  const columns = [
    {
      title: '学院',
      dataIndex: 'id',
      width: '80px',
    },
    {
      title: '家族',
      dataIndex: 'bizDate',
    },
    {
      title: '小组',
      dataIndex: 'ordId',
    },
    {
      title: '运营长',
      dataIndex: 'orgName',
    },
    {
      title: '运营长ID',
      dataIndex: 'cpName',
    },
    {
      title: '累计选课人数',
      dataIndex: 'stuName',
    },
    {
      title: '当前在服人数',
      dataIndex: 'countValue',
    },
    {
      title: '应出勤人数',
      dataIndex: 'countValue',
    },
    {
      title: '实际出勤人数',
      dataIndex: 'countValue',
    },
    {
      title: '出勤率',
      dataIndex: 'countValue',
    },
    {
      title: '小组人数',
      dataIndex: 'countValue',
    },
    {
      title: '人均应出勤学院',
      dataIndex: 'countValue',
    },
    {
      title: '足课人数',
      dataIndex: 'countValue',
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
