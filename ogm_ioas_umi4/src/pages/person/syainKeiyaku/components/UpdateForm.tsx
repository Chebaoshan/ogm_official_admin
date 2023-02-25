import React, {ReactNode, useState} from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps, InputNumber } from 'antd';

import type { TableListItem } from '../data.d';
import moment from "moment";
import PropTypes from "prop-types";
import {FormInstance} from "antd/lib/form";
import {keiyakuTypeMap, keiyakuStatusByUpdateMap, selectedSyainKeiyaku} from "../data.d";

const {Option} = Select

const formLayout = {
  labelCol: { span: 5,offset: 4 },
  wrapperCol: { span: 7 },
};

interface defaultProps {
  syainKeiyaku: selectedSyainKeiyaku;
}

interface defaultState {
  keiyakuStatusTips: { validateStatus: string, help: ReactNode },
  keiyakuStatusDisabled: boolean
}


class AddSyainKeiyaku extends React.Component< defaultProps, defaultState >{

  formRef = React.createRef<FormInstance>();

  constructor(props:defaultProps) {
    super(props);
    this.state = {
      keiyakuStatusTips:{validateStatus: "success", help: ""},
      keiyakuStatusDisabled: false
    }
  }





  componentDidMount() {
    const { syainKeiyaku } = this.props
    if (syainKeiyaku) {
      this.formRef.current?.setFieldsValue({
        ...syainKeiyaku,
        keiyakuStartDay:moment(syainKeiyaku.keiyakuStartDay,"YYYY-MM-DD"),
        keiyakuEndDay:moment(syainKeiyaku.keiyakuEndDay,"YYYY-MM-DD")
      })
      this.setState({keiyakuStatusDisabled: syainKeiyaku.keiyakuType + "" === "9"})
    }

  }


  changeKeiyakuStatus = (value:string) => {
    console.log("value",value)

    let keiyakuStatusTips;
    if (value === "9") {
      keiyakuStatusTips = {validateStatus: "warning", help: "協力社員を選んだ場合、他の種類を変更できない。"}
    } else {
      keiyakuStatusTips = {validateStatus: "success", help: ""}
    }
    this.setState({
      keiyakuStatusTips
    })
  }




  render(){
    const {keiyakuStatusTips,keiyakuStatusDisabled} = this.state
    const {syainKeiyaku} = this.props

    return(

      <Form
        ref={this.formRef}
        name="control-hooks"
        {...formLayout}
      >
        <Form.Item
          label="氏名"
          name={"syainName"}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="勤務番号"
          name={"syainCode"}
        >
          <Input
            // defaultValue={"自動生成"}
            // bordered={false}
            // disabled={true}
          />
        </Form.Item>

        {/* 以下写法会报错 */}
        {/*<Form.Item*/}
        {/*  label="契約種類"*/}
        {/*  name="keiyakuStatus"*/}
        {/*  {...keiyakuStatusTips}*/}
        {/*>*/}
        {/*  <Select*/}
        {/*    onChange={this.changeKeiyakuStatus}*/}
        {/*    bordered={!keiyakuStatusDisabled}*/}
        {/*    disabled={keiyakuStatusDisabled}*/}
        {/*  >*/}
        {/*    /!*更新显示keiyakuStatusByUpdate，新增显示更新显示keiyakuStatusByUpdate*!/*/}
        {/*    {!syainKeiyaku && Object.keys(keiyakuStatusMap).map(x =><Option value={x}>{keiyakuStatusMap[x]}</Option>)}*/}
        {/*    {syainKeiyaku && syainKeiyaku.keiyakuStatus + "" === "9" ?*/}
        {/*      Object.keys(keiyakuStatusMap).map(x=><Option value={x}>{keiyakuStatusMap[x]}</Option>) :*/}
        {/*      Object.keys(keiyakuStatusByUpdateMap).map(x=><Option value={x}>{keiyakuStatusByUpdateMap[x]}</Option>)*/}
        {/*    }*/}

        {/*  </Select>*/}
        {/*</Form.Item>*/}

        {keiyakuStatusTips.validateStatus === "warning" ?
          <Form.Item
            label="契約種類"
            name="keiyakuType"
            validateStatus={"warning"}
            help={"BPを選んだ場合、他の種類に変更できない。"}
          >
            <Select
              onChange={this.changeKeiyakuStatus}
              bordered={!keiyakuStatusDisabled}
              disabled={keiyakuStatusDisabled}
            >
              {/*更新显示keiyakuStatusByUpdate，新增显示更新显示keiyakuStatusByUpdate*/}
              {!syainKeiyaku &&
                Object.keys(keiyakuTypeMap).map(x => <Option value={x}>{keiyakuTypeMap[x]}</Option>)
              }
              {syainKeiyaku && (!syainKeiyaku.keiyakuType || syainKeiyaku.keiyakuType + "" === "9") ?
                Object.keys(keiyakuTypeMap).map(x => <Option value={x}>{keiyakuTypeMap[x]}</Option>) :
                Object.keys(keiyakuStatusByUpdateMap).map(x=><Option value={x}>{keiyakuStatusByUpdateMap[x]}</Option>)
              }

            </Select>
          </Form.Item>
          :
          <Form.Item
            label="契約種類"
            name="keiyakuType"
          >
            <Select
              onChange={this.changeKeiyakuStatus}
              bordered={!keiyakuStatusDisabled}
              disabled={keiyakuStatusDisabled}
            >

              {!syainKeiyaku ?
                Object.keys(keiyakuTypeMap).map(x =><Option value={x}>{keiyakuTypeMap[x]}</Option>) :
                (!syainKeiyaku.keiyakuType || syainKeiyaku.keiyakuType + "" === "9") ?
                  Object.keys(keiyakuTypeMap).map(x=><Option value={x}>{keiyakuTypeMap[x]}</Option>) :
                  Object.keys(keiyakuStatusByUpdateMap).map(x=><Option value={x}>{keiyakuStatusByUpdateMap[x]}</Option>)
              }


            </Select>
          </Form.Item>
        }

        <Form.Item
          label="契約開始日"
          name={"keiyakuStartDay"}
        >
          <DatePicker style={{width:"100%"}} />
        </Form.Item>

        <Form.Item
          label="契約終了日"
          name={"keiyakuEndDay"}
        >
          <DatePicker style={{width:"100%"}} />
        </Form.Item>

        <Form.Item
          label="基本給"
          name={"basePay"}
          initialValue={200000}
        >
          <InputNumber
            step={100}
            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/￥\s?|(,*)/g, '')}
            style={{width:"100%"}}
          />
        </Form.Item>
        <Form.Item
          label="提案単価"
          name={"teianTanka"}
          initialValue={200000}
        >
          <InputNumber
            step={100}
            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/￥\s?|(,*)/g, '')}
            style={{width:"100%"}}
          />
        </Form.Item>

      </Form>
      //     </div>
      // </Card>
    )
  }
}
export default AddSyainKeiyaku
