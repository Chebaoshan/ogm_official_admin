import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, Row, Table } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
const DividebyMonth = () => {
  const dataSource = [
    {
      key: '1',
      start_time: '2023/02/24',
      end_time: new Date('2023/02/24').toString,
      break_time: '12:00',
    },
    {
      key: '2',
      start_time: new Date('2023/02/23'),
      end_time: new Date('2023/02/24'),
      break_time: '12:00',
    },
    {
      key: '3',
      start_time: new Date('2023/02/23'),
      end_time: new Date('2023/02/24'),
      break_time: '12:00',
    },
  ];
  const columns = [
    {
      title: '日期',
      dataIndex: 'current_date',
      key: 'current_date',
    },
    {
      title: '出社时间',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: '退社时间',
      dataIndex: 'end_time',
      key: 'end_time',
    },
    {
      title: '当日工时',
      dataIndex: 'total_time',
      key: 'total_time',
    },
    {
      title: '作业内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '操作',
      alignType: 'center',
      key: 'action',
      render: () => (
        <span>
          <Button type="link">编辑</Button>
          <Button type="link">删除</Button>
        </span>
      ),
    },
  ];
  return (
    <PageContainer
      waterMarkProps={{
        markStyle: { display: 'none' },
      }}
    >
      <Form>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="社员姓名" required>
              <Input.Search
                placeholder="请输入社员姓名"
                style={{ width: 190 }}
                onSearch={() => {
                  alert('guzhichao');
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8} pull={2}>
            <Form.Item label="社员番号" required>
              <Input placeholder="请输入社员番号" style={{ width: 180 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="起始月份" required>
              <DatePicker locale={locale} placeholder="请选择起始月份" style={{ width: 190 }} />
            </Form.Item>
          </Col>
          <Col span={8} pull={2}>
            <Form.Item label="结束月份" required>
              <DatePicker locale={locale} placeholder="请选择结束月份" style={{ width: 180 }} />
            </Form.Item>
          </Col>
          <Col span={8} pull={4}>
            <Button style={{ marginRight: 8 }}>重置</Button>
            <Button type="primary">查询</Button>
          </Col>
        </Row>
      </Form>
      <Row gutter={16}>
        <Table
          dataSource={dataSource}
          columns={columns}
          style={{ width: '-webkit-fill-available' }}
        />
      </Row>
    </PageContainer>
  );
};

export default DividebyMonth;
