// 获取table列表头
export function columnsFn() {
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: '80px',
    },
    {
      title: '学分日期',
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
      title: '类型',
      dataIndex: 'recommendLevel',
    },
    {
      title: 'KOL学员',
      dataIndex: 'upFlag',
    },
    {
      title: '学分',
      dataIndex: 'countValue',
    },
    {
      title: '帖子链接',
      dataIndex: 'countValue',
    },
  ];
  return columns || [];
}
