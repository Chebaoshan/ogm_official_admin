import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Modal } from 'antd';
import React, { Component, MutableRefObject } from 'react';
// import type { FormValueType } from './components/UpdateForm';
import AddSyainKeiyaku from './components/UpdateForm';
import type { TableListItem } from './data.d';
import { addSyainKeiyaku, querySyainKeiyakuList } from './service';
// import {queryRule} from "@/pages/test/RequestBook/service";
import KojinhyoReadOnly from '@/pages/person/kojinhyo/kojinhyoReadOnly';
import moment from 'moment';
import { Link } from 'umi';
import { keiyakuTypeMap, searchData, selectedSyainKeiyaku, syainKojinhyoStatus } from './data.d';
import './style.less';

class SyainKeiyaku extends Component {
  addSyainKeiyaku = React.createRef<AddSyainKeiyaku>();
  kojinhyoReadOnly = React.createRef<KojinhyoReadOnly>();
  ref = React.createRef<ActionType>() as MutableRefObject<ActionType>;

  state = {
    syainKeiyakuList: [],
    modalVisible: false,
    selectedSyainKeiyaku: null,
    kojinhyoViewVisible: false,
    timer: 0,
  };

  //react生命周期函数，页面初始化
  componentDidMount() {
    // (this.props.customer.items.length == 0 || this.props.location.state) && this.go()
    this.go();
  }

  //页面跳转
  go = (pageNum = 1, pageSize = 10) => {
    this.search([], pageNum, pageSize);
  };

  //检索页面信息
  search = async (searchHistory = [], pageNum = 1, pageSize = 10) => {
    let temp: searchData = { pageNum: pageNum, pageSize: pageSize };
    searchHistory.length > 0 &&
      searchHistory.map((x) => {
        temp[x['type']] = x['value'];
      });
    await querySyainKeiyakuList(temp).then((data) => {
      console.log('后台返回', data);
      this.setState({ syainKeiyakuList: data });
    });
  };

  //显示隐藏modal:  type:modal开关，value：选中的社员契约对象
  toggleVisible = (type: boolean, value: selectedSyainKeiyaku) => {
    this.setState({
      modalVisible: type,
      selectedSyainKeiyaku: value,
    });
  };

  // //显示隐藏KojinhyoView:  type:modal开关，value：选中的社员契约对象
  // toggleKojinhyoView(type:boolean, value:selectedSyainKeiyaku){
  //   const { kojinhyoViewVisible } = this.state
  //   if (type && kojinhyoViewVisible) {
  //     console.log("this.props",this.props)
  //     queryKojinhyo({syainCode: value!.syainCode}) // 未处理返回值
  //   }
  //   this.setState({
  //     kojinhyoViewVisible: type,
  //     selectedSyainKeiyaku: value
  //   })
  // }

  //显示隐藏KojinhyoView:  type:modal开关，value：选中的社员契约对象
  toggleKojinhyoView(type: boolean, value: selectedSyainKeiyaku) {
    const { kojinhyoViewVisible } = this.state;
    this.setState({
      kojinhyoViewVisible: type,
      selectedSyainKeiyaku: value,
    });
    if (type && kojinhyoViewVisible) {
      // queryKojinhyo({syainCode: value!.syainCode}) // 未处理返回值
      this.kojinhyoReadOnly.current?.go(value!.syainCode);
    }
  }

  //提交信息提醒框
  submitConfirm = () => {
    console.log('this.addSyainKeiyaku', this.addSyainKeiyaku);
    this.addSyainKeiyaku.current?.formRef?.current
      ?.validateFields()
      .then((payload) => {
        Modal.confirm({
          title: '确认提交吗?',
          // content: `确认提交吗?`,
          onOk: () => {
            this.submit(payload);
          },
        });
      })
      .catch((errorInfo) => console.log(errorInfo));
    return;
  };

  submit = (value: TableListItem) => {
    const { selectedSyainKeiyaku, modalVisible } = this.state;
    let sendData = value;
    sendData.keiyakuStartDay = modalVisible ? moment(value.keiyakuStartDay).format() : undefined;
    sendData.keiyakuEndDay = modalVisible ? moment(value.keiyakuEndDay).format() : undefined;
    console.log('sendData', sendData);
    addSyainKeiyaku(selectedSyainKeiyaku, sendData).then((resp: string) => {
      resp + '' === '1'
        ? Modal.success({
            title: '登録成功',
            onOk: () => {
              // this.go()
              this.ref.current.reload();
              this.toggleVisible(false, null);
            },
          })
        : Modal.error({ title: '登録失敗' });
    });
  };

  viewKojinhyoMouseEnter = (x: TableListItem) => {
    console.log(`我进入${x}`);
    const timer = setTimeout(() => {
      this.toggleKojinhyoView(true, x);
    }, 1000);
    this.setState({ timer });
  };

  viewKojinhyoMouseLeave = (x: TableListItem) => {
    const { timer } = this.state;
    console.log(`我退出${x}`);
    timer && clearTimeout(timer);
    console.log(`计时取消`);
  };

  render() {
    const { kojinhyoViewVisible, selectedSyainKeiyaku, modalVisible } = this.state;

    const columns: ProColumns<TableListItem>[] = [
      {
        title: '勤務番号',
        dataIndex: 'syainCode',
        align: 'center',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '勤務番号',
            },
          ],
        },
        render: (dom, record) => (
          <a
            onMouseEnter={() => this.viewKojinhyoMouseEnter(record)}
            onMouseLeave={() => this.viewKojinhyoMouseLeave(record)}
            onClick={() => this.toggleKojinhyoView(true, record)}
          >
            {dom}
          </a>
        ),
      },
      {
        title: '氏名',
        dataIndex: 'syainName',
        key: 'syainName',
        align: 'center',
        render: (dom, record) => (
          <a
            onMouseEnter={() => this.viewKojinhyoMouseEnter(record)}
            onMouseLeave={() => this.viewKojinhyoMouseLeave(record)}
            onClick={() => this.toggleKojinhyoView(true, record)}
          >
            {dom}
          </a>
        ),
      },

      {
        title: `契約種類`,
        dataIndex: 'keiyakuType',
        key: 'keiyakuType',
        ellipsis: true,
        align: 'center',
        render: (x, record) => {
          return keiyakuTypeMap[record?.keiyakuType];
        },
      },

      {
        title: `契約開始日`,
        dataIndex: 'keiyakuStartDay',
        key: 'keiyakuStartDay',
        ellipsis: true,
        align: 'center',
        valueType: 'date',
      },

      {
        title: `契約終了日`,
        dataIndex: 'keiyakuEndDay',
        key: 'keiyakuEndDay',
        ellipsis: true,
        align: 'center',
        valueType: 'date',
      },

      {
        title: `基本給`,
        dataIndex: 'basePay',
        key: 'basePay',
        ellipsis: true,
        align: 'center',
        render: (x, record) =>
          (record?.basePay || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'),
      },

      {
        title: `提案単価`,
        dataIndex: '提案単価',
        key: 'teianTanka',
        ellipsis: true,
        align: 'center',
        render: (x, record) =>
          (record?.teianTanka || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'),
      },

      {
        title: `個人票状態`,
        dataIndex: 'syainKojinhyoStatus',
        key: 'syainKojinhyoStatus',
        ellipsis: true,
        align: 'center',
        render: (x, record) => syainKojinhyoStatus[record!.syainKojinhyoStatus],
      },

      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        align: 'center',
        render: (_, record) => [
          <a onClick={() => this.toggleVisible(true, record)}>更新</a>,
          <Link to={{ pathname: '/person/kojinhyo', state: record }}>個人票</Link>,
        ],
      },
    ];

    return (
      <PageContainer>
        {/*<div style={{width:"100%", height:"100%", background:"red"}}>*/}

        {/*表格*/}
        <ProTable<TableListItem>
          headerTitle="查询表格"
          columns={columns}
          //数据源
          request={(params, sorter, filter) =>
            querySyainKeiyakuList({ pageNum: params.current, pageSize: params.pageSize })
          }
          actionRef={this.ref}
          //顶部操作栏
          toolBarRender={() => [
            <Button type="primary" onClick={() => this.toggleVisible(true, null)}>
              <PlusOutlined /> 新建
            </Button>,
          ]}
        />
        {/*</div>*/}

        {/* 抽屉 社员契约更新/新规 */}
        <Drawer
          title={selectedSyainKeiyaku ? '更新' : '新規'}
          visible={modalVisible}
          onClose={() => this.toggleVisible(false, null)}
          height={'100%'}
          placement={'top'}
          mask={false}
          destroyOnClose
          // getContainer={document.getElementsByClassName("ant-pro-grid-content")[0] as HTMLElement}
          getContainer={document.getElementsByTagName('main')[0]?.parentElement as HTMLElement}
          className={'syainKeiyakuDrawer'}
          footer={
            <div style={{ textAlign: 'center' }}>
              <Button onClick={() => this.toggleVisible(false, null)}>キャンセル</Button>
              <span style={{ marginLeft: '10%' }} />
              <Button type="primary" onClick={this.submitConfirm}>
                提出
              </Button>
            </div>
          }
        >
          <AddSyainKeiyaku
            // ref={a=>{this.addSyainKeiyaku = a}}
            ref={this.addSyainKeiyaku}
            syainKeiyaku={selectedSyainKeiyaku}
          />
        </Drawer>

        {/* 抽屉 个人票预览 */}
        <Drawer
          title={
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Link
                to={{ pathname: '/person/kojinhyo', state: selectedSyainKeiyaku }}
                style={{ position: 'absolute', left: 0 }}
              >
                Open New Window
              </Link>
              <span>個人票</span>
            </div>
          }
          placement={'right'}
          visible={kojinhyoViewVisible}
          onClose={() => this.toggleKojinhyoView(false, null)}
          width={'50%'}
          mask={false}
          destroyOnClose
        >
          <KojinhyoReadOnly syainKeiyaku={selectedSyainKeiyaku} ref={this.kojinhyoReadOnly} />
        </Drawer>
      </PageContainer>
    );
  }
}

export default SyainKeiyaku;
