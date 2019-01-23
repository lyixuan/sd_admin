// 获取table列表头
export function columnsFn() {
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      width: '80px',
    },
    {
      title: '报名日期',
      dataIndex: 'bizDate',
    },
    {
      title: '子订单编号',
      dataIndex: 'ordId',
    },
    {
      title: '组织',
      dataIndex: 'orgName',
    },
    {
      title: '老师姓名',
      dataIndex: 'cpName',
    },
    {
      title: '学员姓名',
      dataIndex: 'stuName',
    },
    {
      title: '推荐等级',
      dataIndex: 'recommendLevel',
    },
    {
      title: 'up值达标',
      dataIndex: 'upFlag',
    },
    {
      title: '分值',
      dataIndex: 'countValue',
    },
  ];
  return columns || [];
}
