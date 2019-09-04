// 获取table列表头

export function columnsFn(callback) {
  const columns = [
    {
      title: '编号',
      dataIndex: 'code',
      width: '160px',
    },
    {
      title: '学分日期',
      dataIndex: 'scoreDate',
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
      dataIndex: 'ugcType',
    },
    {
      title: 'KOL学员',
      dataIndex: 'kolFlag',
    },
    {
      title: '学分',
      dataIndex: 'countValue',
    },
    {
      title: '帖子链接',
      dataIndex: 'postUrl',
      render: postUrl => {
        return (
          <div
            style={{
              color: '#52C9C2',
              cursor: 'pointer',
            }}
            onClick={() => callback(postUrl)}
          >
            <span style={{ marginRight: '8px' }}>查看</span>
          </div>
        );
      },
    },
  ];
  return columns || [];
}
