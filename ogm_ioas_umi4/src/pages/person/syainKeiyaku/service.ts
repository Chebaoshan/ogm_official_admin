import request from 'umi-request';
import type { TableListParams } from './data.d';
import {TableListItem,selectedSyainKeiyaku} from "./data.d";
import {string} from "prop-types";


export async function querySyainKeiyakuList(params?: TableListParams) {
  return request('http://localhost:9000/api/syainKeiyaku/searchSyainKeiyaku', {
    method: 'POST',
    data:params
  })
}

export async function addSyainKeiyaku(selectedSyainKeiyaku:selectedSyainKeiyaku ,params: TableListItem) :Promise<string> {
  let url = ""
  if (selectedSyainKeiyaku) {
    url = 'http://localhost:9000/api/syainKeiyaku/updateSyainKeiyaku'
  } else {
    url = 'http://localhost:9000/api/syainKeiyaku/addSyainKeiyaku'
  }
  return request(url,{
    method: 'POST',
    data:params
  })
}

export async function queryRule(params?: TableListParams) {
  return request('/api/requestBook', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/requestBook', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/requestBook', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/requestBook', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
