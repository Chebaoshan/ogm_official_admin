import React, {Component} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {UploadChangeParam} from "antd/es/upload";
import {
  Card, Form, Upload, Collapse,
  Input, Select, DatePicker, Tooltip, Modal, Button
} from 'antd';
import {FormInstance} from "antd/lib/form";
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {queryKojinhyo, updateKojinhyo} from "./service"
import {kojinhyo, returnData} from "@/pages/person/kojinhyo/data";
import './style.less';
import {keiyakuTypeMap, selectedSyainKeiyaku} from "@/pages/person/syainKeiyaku/data.d";
import moment from "moment";

const { Panel } = Collapse
const { Option } = Select


interface defaultProps {
  syainKeiyaku: selectedSyainKeiyaku;
}

class KojinhyoReadOnly extends Component<defaultProps> {

  formRef = React.createRef<FormInstance>();

  state = {
    returnData: null as null | returnData,
    supportFamilyCount: 0,
    obverse:[],
    reverse:[],
  }

  componentDidMount() {
    const { syainKeiyaku } = this.props
    this.go(syainKeiyaku!.syainCode)
  }

  go = (syainCode:string) => {
    queryKojinhyo({syainCode:syainCode})
      .then(resp => {
        console.log("resp",resp)
        const {kojinhyo} = resp
        this.setState({returnData : resp})
        this.formRef.current?.setFieldsValue(kojinhyo)
      })
  }

  /** 上传图片 **/
  moduleUrlChange = (imgObj:UploadChangeParam, type:string) => {
    console.log("moduleUrlChange***", imgObj);
    if (type === "obverse") {
      this.setState({ obverse: imgObj.fileList })
    } else {
      this.setState({ reverse: imgObj.fileList })
    }
  }

  /** 统计抚养家族人数及监控上限 **/
  supportFamilyCount = (type:string, fun:(defaultValue?:any,insertIndex?:(number|undefined))=>void, name?:number) => {
    const {supportFamilyCount} = this.state
    switch (type) {
      case "add":
        if (supportFamilyCount <= 9) {
          this.setState({supportFamilyCount: supportFamilyCount+1})
          fun()
        } else {
          Modal.error({
            title: '追加失敗',
            content: '扶養家族人数上限(10人)を超える',
          })
        }
        break
      case "remove":
        this.setState({supportFamilyCount: supportFamilyCount-1})
        fun(name)
        break
    }
  }

  submit = () => {
    this.formRef.current?.validateFields().then((value:kojinhyo)=>{
      const { returnData } = this.state
      const kojinhyo = returnData?.kojinhyo
      const syainKeiyaku = returnData?.syainKeiyaku
      let sendData = {}
      console.log("value",value)
      // debugger
      value.birthDate = moment(value.birthDate).format()
      value.visaValidity = moment(value.visaValidity).format()
      value.supportFamilyList?.map(x=> {
        // debugger
        x.familyBirthDate = x.familyBirthDate !== undefined && x.familyBirthDate ? moment(x.familyBirthDate).format() : null
      })
      Object.keys(value).forEach(x=>{
        if (value[x] !== kojinhyo?.[x] || x === "supportFamilyList") {
          sendData[x] = value[x]
        }
      })
      sendData["syainCode"] = syainKeiyaku?.["syainCode"]

      console.log("sendData", sendData)
      console.log("kojinhyo", kojinhyo)

      updateKojinhyo(sendData)
        .then(resp => {
          resp + "" === "1" ?
            Modal.success({title:'登録成功',
              onOk:()=>{
                // this.props.action.queryKojinhyo({syainCode: this.props.location.state.syainCode})
                // this.props.history.push({ pathname: "/syainKeiyaku", state: {syainCode: this.props.location.state.syainCode} })
              }
            }):
            Modal.error({title:'登録失败',
              onOk:()=>{
                // this.go()
              }
            })
        })
    })
  }

  render() {
    const { returnData, obverse, reverse, supportFamilyCount } = this.state
    const kojinhyo = returnData?.kojinhyo
    const syainKeiyaku = returnData?.syainKeiyaku


    return (
        <div>
          <Form
            ref={this.formRef}
          >

            <table className={"kojinhyo_table"} >
              <tr>
                <th style={{border:"none"}}>
                  勤務番号
                </th>
                <td style={{border:"none"}}>
                  {syainKeiyaku?syainKeiyaku.syainCode:"事務担当が別途入力"}
                </td>
                <td rowSpan={4} style={{padding:0}}>
                  {/*<Upload*/}
                  {/*  name ='file'*/}
                  {/*  action=""*/}
                  {/*  beforeUpload = {()=>false}*/}
                  {/*  listType="picture-card"*/}
                  {/*  fileList={obverse}*/}
                  {/*  onChange={(e)=>this.moduleUrlChange(e,"obverse")}*/}
                  {/*  headers={{ authorization: 'authorization-text', }}*/}
                  {/*>*/}
                  {/*  {obverse.length >= 1 ? null :*/}
                  {/*    <div>*/}
                  {/*      <PlusOutlined />*/}
                  {/*      <div style={{ marginTop: 8 }}>在留カード（正面）</div>*/}
                  {/*    </div>}*/}
                  {/*</Upload>*/}
                  <div>
                    <div style={{ marginTop: 8 }}>在留カード（正面）</div>
                  </div>
                </td>
                <td rowSpan={4} style={{padding:0}}>
                  {/*<Upload*/}
                  {/*  name ='file'*/}
                  {/*  action=""*/}
                  {/*  beforeUpload = {()=>false}*/}
                  {/*  listType="picture-card"*/}
                  {/*  fileList={reverse}*/}
                  {/*  onChange={(e)=>this.moduleUrlChange(e,"reverse")}*/}
                  {/*  headers={{ authorization: 'authorization-text', }}*/}
                  {/*>*/}
                  {/*  {reverse.length >= 1 ? null :*/}
                  {/*    <div>*/}
                  {/*      <PlusOutlined />*/}
                  {/*      <div style={{ marginTop: 8 }}>在留カード（裏面）</div>*/}
                  {/*    </div>}*/}
                  {/*</Upload>*/}
                  <div>
                    <div style={{ marginTop: 8 }}>在留カード（裏面）</div>
                  </div>
                </td>
              </tr>

              <tr>
                <th style={{border:"none"}}>
                  {/*{intl.get("keiyakuStartDay")}*/}
                  契約開始日
                </th>
                <td style={{border:"none"}}>
                  {syainKeiyaku?syainKeiyaku.keiyakuStartDay:"事務担当が別途入力"}
                </td>
              </tr>

              <tr>
                <th style={{border:"none"}}>
                  {/*{intl.get("keiyakuEndDay")}*/}
                  契約終了日
                </th>
                <td style={{border:"none"}}>
                  {syainKeiyaku?syainKeiyaku.keiyakuEndDay:"事務担当が別途入力"}
                </td>
              </tr>

              <tr>
                <th style={{border:"none"}}>
                  {/*{intl.get("keiyakuStatus")}*/}
                  契約種類
                </th>
                <td style={{border:"none"}}>
                  {syainKeiyaku?keiyakuTypeMap[syainKeiyaku.keiyakuStatus]:"事務担当が別途入力"}
                </td>
              </tr>

            </table>

            <Collapse defaultActiveKey={["1", "2", "3", "4"]} className={"kojinhyo_collapse"}>
              <Panel header="個人情報" key="1">
                <table className={"kojinhyo_table"}>
                  <tr>
                    <th>
                      {/*{intl.get('syainNameFurikana')}*/}
                      フリカナ
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"syainNameFurikana"}*/}
                      {/*  rules={[{required:true, validateTrigger:"onBlur"}]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={15}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.syainNameFurikana}
                    </td>
                    <th>
                      {/*{intl.get('sex')}*/}
                      性別
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"sex"}*/}
                      {/*  rules={[{ required: true, validateTrigger:"onBlur"}]}*/}
                      {/*>*/}
                      {/*  <Select bordered={false}>*/}
                      {/*    <Option value="1">男</Option>*/}
                      {/*    <Option value="2">女</Option>*/}
                      {/*  </Select>*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.sex+""==="1"?"男":"女"}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {/*{intl.get('syainName')}*/}
                      氏名
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"syainName"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={10}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.syainName}
                    </td>
                    <th>
                      {/*{intl.get('birthDate')}*/}
                      生年月日（西暦）
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"birthDate"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true,type:"object", validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <DatePicker bordered={false}/>*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.birthDate&&kojinhyo.birthDate._i}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {/*{intl.get('passportCode')}　(9桁)*/}
                      パスポート番号 (9桁)
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"passportCode"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*    {len:9, message:"長度不足", validateTrigger:"onBlur"}*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={9}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.passportCode}
                    </td>
                    <th>
                      {/*{intl.get('mynumberCode')}　(12桁)*/}
                      マイナンバー番号 (12桁)
                    </th>
                    <td>
                      {/*<Tooltip overlayStyle={{display:(kojinhyo&&kojinhyo.mynumberCode)?"":"none"}} title={"修正したい場合、事務とご連絡ください。"}>*/}
                      {/*  <Form.Item*/}
                      {/*    name={"mynumberCode"}*/}
                      {/*    rules={[*/}
                      {/*      {required: true, validateTrigger:"onBlur"},*/}
                      {/*      {len:12, message:"長度不足", validateTrigger:"onBlur"}*/}
                      {/*    ]}*/}
                      {/*  >*/}
                      {/*    <Input*/}
                      {/*      bordered={false}*/}
                      {/*      maxLength={12}*/}
                      {/*      // autocomplete={"off"}*/}
                      {/*      disabled={!!(kojinhyo&&kojinhyo.mynumberCode)}*/}
                      {/*    />*/}
                      {/*  </Form.Item>*/}
                      {/*</Tooltip>*/}
                      {kojinhyo?.mynumberCode}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {/*{intl.get('zairyuCard')}　(12桁)*/}
                      在留カード (12桁)
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"zairyuCard"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*    {len:12, message:"長度不足", validateTrigger:"onBlur"}*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={12}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.zairyuCard}
                    </td>
                    <th>
                      {/*{intl.get('visaValidity')}*/}
                      ビザ有効期限
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"visaValidity"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, type:"object", validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <DatePicker bordered={false}/>*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.visaValidity&&kojinhyo.visaValidity._i}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {/*{intl.get('postCode')}　(7桁)*/}
                      郵便番号 (7桁)
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"postCode"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*    {len:7, message:"長度不足", validateTrigger:"onBlur"}*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={7}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*    placeholder={"数字のみ"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.postCode}
                    </td>
                    <th>
                      {/*{intl.get('nearestStation')}*/}
                      最 　寄 　駅
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"nearestStation"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={10}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.nearestStation}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {/*{intl.get('actualResidence')}*/}
                      現 住 所（詳細）
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"actualResidence"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={25}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.actualResidence}
                    </td>
                    <th>
                      {/*{intl.get('phone')}　(11桁)*/}
                      携帯番号
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"phone"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*    {len:11, message:"長度不足", validateTrigger:"onBlur"}*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={11}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*    placeholder={"数字のみ"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.phone}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {/*{intl.get('emergencyContactName')}*/}
                      緊急連絡氏名
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"emergencyContactName"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={10}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.emergencyContactName}
                    </td>
                    <th>
                      {/*{intl.get('emergencyContactPhone')}　(11桁)*/}
                      緊急連絡先携帯番号 (11桁)
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"emergencyContactPhone"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*    {len:11, message:"長度不足", validateTrigger:"onBlur"}*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={11}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*    placeholder={"数字のみ"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.emergencyContactPhone}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {/*{intl.get('email')}*/}
                      E-mail アドレス
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"email"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={30}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.email}
                    </td>
                    <th>
                      {/*{intl.get('wechat')}*/}
                      WeChat
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"wechat"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={30}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.wechat}
                    </td>
                  </tr>
                </table>
              </Panel>

              <Panel key={"2"} header={"母国連絡先（一時帰国時連絡用）"}>
                <table className={"kojinhyo_table"}>
                  <tr>
                    <th>
                      {/*{intl.get('nativeAddress')}*/}
                      住　  所 (母国）
                    </th>
                    <td colSpan={3}>
                      {/*<Form.Item*/}
                      {/*  name={"nativeAddress"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={50}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.nativeAddress}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {/*{intl.get('nativePhone')}　(11桁)*/}
                      電話番号（母国） (11桁)
                    </th>
                    <td colSpan={3}>
                      {/*<Form.Item*/}
                      {/*  name={"nativePhone"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*    {len:11, message:"長度不足", validateTrigger:"onBlur"}*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={11}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*    placeholder={"数字のみ"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.nativePhone}
                    </td>
                  </tr>
                </table>
              </Panel>

              <Panel key={"3"} header={"銀行口座"}>
                <table className={"kojinhyo_table"}>
                  <tr>
                    <th>
                      {/*{intl.get('kojinBankCode')}*/}
                      銀行名
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"bankCode"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={25}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.bankCode}
                    </td>
                    <th>
                      {/*{intl.get('kojinBranchName')}*/}
                      支店名
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"branchName"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={32}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.branchName}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {/*{intl.get('kojinAccountType')}*/}
                      口座種類
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"accountType"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.accountType}
                    </td>
                    <th>
                      {/*{intl.get('kojinAccountCode')}*/}
                      口座番号
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"accountCode"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={8}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.accountCode}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {/*{intl.get('accountNameKatakana')}*/}
                      名義人（カタカナ）
                    </th>
                    <td>
                      {/*<Form.Item*/}
                      {/*  name={"accountNameKatakana"}*/}
                      {/*  rules={[*/}
                      {/*    {required: true, validateTrigger:"onBlur"},*/}
                      {/*  ]}*/}
                      {/*>*/}
                      {/*  <Input*/}
                      {/*    bordered={false}*/}
                      {/*    maxLength={15}*/}
                      {/*    // autocomplete={"off"}*/}
                      {/*  />*/}
                      {/*</Form.Item>*/}
                      {kojinhyo?.accountNameKatakana}
                    </td>
                    <td>
                      <br/>
                    </td>
                    <td>
                      <br/>
                    </td>
                  </tr>
                </table>
              </Panel>

              <Panel key={"4"} header={`扶養家族  ${kojinhyo?.supportFamilyList?.length} /10人`}>
                <table className={"kojinhyo_table"}>
                  <tr>
                    <th>
                      {/*{intl.get('supportFamilyName')}*/}
                      家族氏名
                    </th>
                    <th>
                      {/*{intl.get('kinship')}*/}
                      続柄
                    </th>
                    <th>
                      {/*{intl.get('supportFamilyBirthDate')}*/}
                      家族生年月日
                    </th>
                    <th>
                      {/*{intl.get('supportFamilyAddress')}*/}
                      家族住所
                    </th>
                  </tr>
                  {kojinhyo?.supportFamilyList?.map((x,index)=>(
                    <tr>
                      <td>
                        {x.familyName}
                      </td>
                      <td>
                        {x.kinship}
                      </td>
                      <td>
                        {x.familyBirthDate&&x.familyBirthDate._i}
                      </td>
                      <td>
                        {x.familyAddress}
                      </td>
                    </tr>
                  ))}
                </table>
              </Panel>

            </Collapse>

          </Form>
        </div>
  )}
}

export default KojinhyoReadOnly
