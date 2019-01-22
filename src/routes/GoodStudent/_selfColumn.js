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
      dataIndex: 'collegeName',
    },
    {
      title: '子订单编号',
      dataIndex: 'familyName',
    },
    {
      title: '组织',
      dataIndex: 'groupName',
    },
    {
      title: '老师姓名',
      dataIndex: 'teaName',
    },
    {
      title: '学员姓名',
      dataIndex: 'stuName',
    },
    {
      title: '推荐等级',
      dataIndex: 'qualityTypeName',
    },
    {
      title: 'up值达标',
      dataIndex: 'countValue',
    },
    {
      title: '分值',
      dataIndex: 'qualityNum',
    },
  ];
  return columns || [];
}
