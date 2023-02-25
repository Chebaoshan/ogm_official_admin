import moment from "moment";

export type TableListItem = {
  syainCode: string,
  syainName: string,
  // keiyakuStartDay: string,
  // keiyakuEndDay: string,
  keiyakuStartDay: Date | moment | string | undefined,
  keiyakuEndDay: Date | moment | string | undefined,
  keiyakuType: keiyakuTypeMap[string],
  basePay: number,
  teianTanka: number,
  syainKojinhyoStatus: string
}

export type selectedSyainKeiyaku = TableListItem | null

export enum keiyakuTypeMap {
  "1" = "正社員",
  "2" = "契約社員",
  "3" = "個人事業主",
  "9" = "BP",
}

export enum kadouStatusMap {
  "0" = "未稼働",
  "1" = "営業中",
  "2" = "案件決定",
  "3" = "稼働中",
}

export enum keiyakuStatusByUpdateMap {
  "1" = "正社員",
  "2" = "契約社員",
  "3" = "個人事業主",
}


export enum syainKojinhyoStatus {
  "1" = "未審査",
  "2" = "ロック",
  "3" = "ロック解除",

}

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type searchData = {
  [any:string]:any;
}

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
  pageNum?: number;
  [key: string]: any
};
