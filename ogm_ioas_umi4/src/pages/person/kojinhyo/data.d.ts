import moment from "moment";
import {TableListItem} from "@/pages/person/syainKeiyaku/data";

export type kojinhyo = {
  syainCode?: string,
  syainNameFurikana?: string,
  syainName?: string,
  sex?: string,
  birthDate?: string | moment | Date,
  passportCode?: string,
  mynumberCode?: string,
  zairyuCard?: string,
  visaValidity?: string | moment | Date,
  postCode?: string,
  nearestStation?: string,
  actualResidence?: string,
  phone?: string,
  emergencyContactName?: string,
  emergencyContactPhone?: string,
  email?: string,
  wechat?: string,
  nativeAddress?: string,
  nativePhone?: string,
  bankCode?: string,
  branchName?: string,
  accountType?: string,
  accountCode?: string,
  accountNameKatakana?: string,
  zairyuCardPhotoObverse?: string,
  zairyuCardPhotoReverse?: string,
  syainKojinhyoStatus?: string,
  isDelete?: string,
  supportFamilyList?: supportFamily[]
}

export type supportFamily = {
  syainCode?: string,
  familyCode?: string,
  familyName?: string,
  kinship?: string,
  familyBirthDate?: string | moment | Date,
  familyAddress?: string
}

export type returnData = {
  kojinhyo: kojinhyo,
  syainKeiyaku: TableListItem
}
