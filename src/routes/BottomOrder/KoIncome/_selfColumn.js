// 获取table列表头
export function columnsFn() {
  const columns = [
    {
      title: '报名时间',
      dataIndex: 'registrationDate',
    },
    {
      title: '子订单ID',
      dataIndex: 'ordId',
    },
    {
      title: '学员ID',
      dataIndex: 'stuId',
    },
    {
      title: '零元单_学院',
      dataIndex: 'collegeName',
    },
    {
      title: '零元单_家族',
      dataIndex: 'familyName',
    },
    {
      title: '零元单_小组',
      dataIndex: 'groupName',
    },
    {
      title: '净流水',
      dataIndex: 'financeNetFlow',
    },
    {
      title: '听课时长',
      dataIndex: 'lecturesTime',
    },
    {
      title: '听课时长范围',
      dataIndex: 'fullLecturesFlag',
    },
    {
      title: '单个学院运营转化绩效',
      dataIndex: 'recommendLevel',
    },
  ];
  return columns || [];
}
