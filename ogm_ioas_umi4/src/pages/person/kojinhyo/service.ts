import request from 'umi-request';
import moment from "moment";
import {kojinhyo, supportFamily, returnData} from "@/pages/person/kojinhyo/data";


export async function queryKojinhyo(params?: kojinhyo) :Promise<returnData> {
  return request('http://localhost:9000/api/person/searchKojinhyo', {
    method: 'POST',
    data:params
  }).then(data => {
    let {kojinhyo} = data
    kojinhyo.birthDate = kojinhyo.birthDate!==undefined?moment(kojinhyo.birthDate, "YYYY-MM-DD"):null
    kojinhyo.visaValidity = kojinhyo.visaValidity!==undefined?moment(kojinhyo.visaValidity, "YYYY-MM-DD"):null
    kojinhyo.supportFamilyList.map((x:supportFamily)=> {
      x.familyBirthDate = x.familyBirthDate !== undefined ? moment(x.familyBirthDate, "YYYY-MM-DD") : null
    })
    return data
  })
}

export async function updateKojinhyo(params?: kojinhyo) :Promise<string> {
  return request('http://localhost:9000/api/person/updateKojinhyo', {
    method: 'POST',
    data:params
  })
}


