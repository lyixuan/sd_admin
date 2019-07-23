// 获取table列表头
export function columnsFn() {
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      width: '80px',
    },
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
      title: '学院',
      dataIndex: 'collegeName',
    },
    {
      title: '家族',
      dataIndex: 'familyName',
    },
    {
      title: '小组',
      dataIndex: 'groupName',
    },
    {
      title: '推荐老师',
      dataIndex: 'recommendedTeacher',
    },
    {
      title: '老师ID',
      dataIndex: 'teacherId',
    },
    {
      title: '净流水',
      dataIndex: 'financeNetFlow',
    },
    {
      title: '子订单归属学院',
      dataIndex: 'subOrderOfCollege',
    },
    {
      title: '听课时长',
      dataIndex: 'lecturesTime',
    },
    {
      title: '是否足课',
      dataIndex: 'fullLecturesFlag',
    },
    {
      title: '推荐等级',
      dataIndex: 'recommendLevel',
    },
    {
      title: '成单类型',
      dataIndex: 'orderType',
    },
    {
      title: '折扣(竞合比)',
      dataIndex: 'saleoff',
    },
    {
      title: '竞合后净流水',
      dataIndex: 'financeNetFlowJh',
    },
  ];
  return columns || [];
}
