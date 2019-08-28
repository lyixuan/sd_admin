// 获取table列表头
export function columnsFn() {
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 60,
      fixed: 'left',
    },
    {
      title: '报名时间',
      dataIndex: 'registrationDate',
      width: 120,
      fixed: 'left',
    },
    {
      title: '子订单ID',
      dataIndex: 'subOrderId',
      width: 100,
      fixed: 'left',
    },
    {
      title: '学员ID',
      dataIndex: 'studentId',
      width: 105,
      fixed: 'left',
    },
    {
      title: '学院',
      dataIndex: 'college',
      width: 120,
      fixed: 'left',
    },
    {
      title: '家族',
      dataIndex: 'family',
      width: 150,
    },
    {
      title: '小组',
      dataIndex: 'team',
      width: 110,
    },
    {
      title: '推荐老师',
      dataIndex: 'recommendedTeacher',
      width: 80,
    },
    {
      title: '推荐老师邮箱',
      dataIndex: 'teacherName',
      width: 110,
    },
    {
      title: '净流水',
      dataIndex: 'financeNetFlow',
      width: 90,
    },
    {
      title: '子订单归属学院',
      dataIndex: 'subOrderOfCollege',
      width: 120,
    },
    {
      title: '听课时长',
      dataIndex: 'lecturesTime',
      width: 90,
    },
    {
      title: '是否足课',
      dataIndex: 'fullLecturesFlag',
      width: 90,
    },
    {
      title: '成单类型',
      dataIndex: 'orderType',
      width: 100,
    },
    {
      title: '折扣(竞合比)',
      dataIndex: 'saleoffJh',
      width: 110,
    },
    {
      title: '竞合后净流水',
      dataIndex: 'financeNetFlowJh',
      width: 110,
    },
    {
      title: '',
      dataIndex: 'duoyukuandu',
    },
  ];
  return columns || [];
}
