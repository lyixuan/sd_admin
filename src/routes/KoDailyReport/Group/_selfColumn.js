// 获取table列表头
export function columnsFn() {
  const columns = [
    {
      title: '学院',
      dataIndex: 'collegeName',
      width: '80px',
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
      title: '运营长',
      dataIndex: 'teamLeader',
    },
    {
      title: '运营长ID',
      dataIndex: 'teamLeaderId',
    },
    {
      title: '累计选课人数',
      dataIndex: 'totalStudentCount',
    },
    {
      title: '当前在服人数',
      dataIndex: 'currentStudentCount',
    },
    {
      title: '应出勤人数',
      dataIndex: 'attendanceCountShoulebe',
    },
    {
      title: '实际出勤人数',
      dataIndex: 'attendanceCountActual',
    },
    {
      title: '出勤率',
      dataIndex: 'attendanceRate',
    },
    {
      title: '小组人数',
      dataIndex: 'teamPersonCount',
    },
    {
      title: '人均应出勤学院',
      dataIndex: 'personalAvgAttendanceShouldebe',
    },
    {
      title: '足课人数',
      dataIndex: 'fullLecturesCount',
    },
    {
      title: '足课率',
      dataIndex: 'fullLecturesRate',
    },
    {
      title: '足课转化人数',
      dataIndex: 'fullLecturesTransCount',
    },
    {
      title: '足课转化率',
      dataIndex: 'fullLecturesTransRate',
    },
  ];
  return columns || [];
}
