import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  TimePicker,
} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { useEffect, useState } from 'react';
import { common } from '../common/common';
const Dividebyday = () => {
  const [hasChosen, setHasChosen] = useState<boolean>(true);
  const [stepValue, setSetpValue] = useState<number>();
  const [currentStart, setCurrentStart] = useState<string>(common.BLANK_STRING);
  const [currentEnd, setCurrentEnd] = useState<string>(common.BLANK_STRING);
  const [currentBreak, setCurrentBreak] = useState<string>(common.BLANK_STRING);
  const [form] = Form.useForm();
  const hoursBetween = (time1: string, time2: string, time3: number) => {
    const [hours1, minutes1] = time1.split(':');
    const [hours2, minutes2] = time2.split(':');
    const date1 = new Date(0, 0, 0, Number(hours1), Number(minutes1));
    const date2 = new Date(0, 0, 0, Number(hours2), Number(minutes2));
    const diff = Math.abs(date2.getTime() - date1.getTime());
    return diff / (1000 * 60 * 60) - time3;
  };
  const validateEndTime = (_: any, value: any, callback: any) => {
    const [hours1, minutes1] = currentStart.split(':');
    const [hours2, minutes2] = currentEnd.split(':');
    const date1 = new Date(0, 0, 0, Number(hours1), Number(minutes1));
    const date2 = new Date(0, 0, 0, Number(hours2), Number(minutes2));
    if (date2.getTime() - date1.getTime() < 0 && currentEnd !== common.BLANK_STRING) {
      callback('退勤時刻は出勤時刻より未来時刻にしてください');
    }
  };
  useEffect(() => {
    if (
      currentStart !== common.BLANK_STRING &&
      currentEnd !== common.BLANK_STRING &&
      currentBreak !== common.BLANK_STRING
    ) {
      form.setFieldValue(
        'totalTime',
        String(hoursBetween(currentStart, currentEnd, Number(currentBreak))).concat('時間'),
      );
    }
  }, [currentStart, currentEnd, currentBreak]);
  return (
    <PageContainer
      waterMarkProps={{
        markStyle: { display: 'none' },
      }}
    >
      <Card
        title="業務報告書"
        bordered={true}
        style={{ width: 600, height: 680, margin: 'auto', marginBottom: 10 }}
        headStyle={{ textAlign: 'center' }}
      >
        <Descriptions
          bordered={false}
          size="small"
          style={{ width: '20rem', marginLeft: 65, marginBottom: 20 }}
        >
          <Descriptions.Item label="部署">2部3课</Descriptions.Item>
          <Descriptions.Item label="社員ID">301</Descriptions.Item>
          <Descriptions.Item label="氏名">顾智超</Descriptions.Item>
        </Descriptions>
        <Form
          form={form}
          name="dividedByDay"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="workTime"
            label="勤務日付"
            required={true}
            rules={[{ required: true, message: '勤務日付を選んで下さい' }]}
          >
            <DatePicker
              name="workTime"
              placeholder="请选择日期"
              locale={locale}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item
            name="divideTime"
            label="時刻単位"
            required
            rules={[{ required: true, message: '時刻単位を選んで下さい!' }]}
          >
            <Radio.Group
              onChange={(e: any) => {
                setHasChosen(false);
                setSetpValue(Number(e.target.value));
              }}
            >
              <Radio value="5"> 5分 </Radio>
              <Radio value="10"> 10分 </Radio>
              <Radio value="15"> 15分 </Radio>
              <Radio value="30"> 30分 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="startTime"
            label="出勤時刻"
            required
            rules={[{ required: true, message: '出勤時刻を選んで下さい!' }]}
          >
            <TimePicker
              onChange={(_, dateString) => {
                setCurrentStart(dateString);
              }}
              name="startTime"
              format="HH:mm"
              minuteStep={stepValue}
              locale={locale}
              placeholder="请输入出社时间"
              style={{ width: 160 }}
              disabled={hasChosen}
            />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="退勤時刻"
            required
            rules={[
              { required: true, message: '退勤時刻を選んで下さい!' },
              {
                validator: validateEndTime,
              },
            ]}
          >
            <TimePicker
              onChange={(_, dateString) => {
                setCurrentEnd(dateString);
              }}
              name="endTime"
              format="HH:mm"
              minuteStep={stepValue}
              locale={locale}
              placeholder="请输入退社时间"
              style={{ width: 160 }}
              disabled={hasChosen}
            />
          </Form.Item>
          <Form.Item
            label="休憩時間"
            name="breakTime"
            required
            rules={[{ required: true, message: '休憩時間を選んで下さい!' }]}
          >
            <InputNumber
              step={0.15}
              min={0}
              style={{ width: 70 }}
              disabled={hasChosen}
              onChange={(value) => {
                setCurrentBreak(String(value));
              }}
            />
          </Form.Item>
          <Form.Item label="実働時間" name="totalTime">
            <Input readOnly={true} bordered={false} style={{ width: 'fit-content' }} />
          </Form.Item>

          <Form.Item
            label="作業内容"
            name="workContent"
            required
            rules={[{ required: true, message: '作業内容を選んで下さい!' }]}
          >
            <Input.TextArea
              style={{ height: 80, resize: 'none' }}
              placeholder="请输入今日作业内容"
            />
          </Form.Item>
          <Form.Item label="備考" name="memoContent">
            <Input.TextArea style={{ height: 20, resize: 'none' }} placeholder="请输入備考内容" />
          </Form.Item>
          <Form.Item>
            <Row style={{ justifyContent: 'center' }}>
              <Col span={9} offset={2} push={8}>
                <Button type="primary" htmlType="submit" style={{ width: '6rem' }}>
                  登録
                </Button>
              </Col>{' '}
              <Col span={7} offset={6} push={6}>
                <Button
                  type="dashed"
                  htmlType="reset"
                  onClick={() => {
                    setHasChosen(true);
                  }}
                  style={{ width: '6rem' }}
                >
                  キャンセル
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};
export default Dividebyday;
