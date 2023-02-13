<template>
   <div class="app-container">
      <el-row :gutter="20">
         <!--部门数据-->
         <el-col :span="4" :xs="24">
            <div class="head-container">
               <el-input v-model="deptName" placeholder="请输入部门名称" clearable prefix-icon="Search"
                  style="margin-bottom: 20px" />
            </div>
            <div class="head-container">
               <el-tree :data="deptOptions" :props="{ label: 'label', children: 'children' }"
                  :expand-on-click-node="false" :filter-node-method="filterNode" ref="deptTreeRef" node-key="id"
                  highlight-current default-expand-all @node-click="handleNodeClick" />
            </div>
         </el-col>
         <!--用户数据-->
         <el-col :span="20" :xs="24">
            <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
               <el-form-item label="社员姓名" prop="userName">
                  <el-input v-model="queryParams.userName" placeholder="请输入社员姓名" clearable style="width: 240px"
                     @keyup.enter="handleQuery" />
               </el-form-item>
               <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="queryParams.sex" class="ml-4" style="width: 240px">
                     <el-radio label="1" style="padding-bottom:8px" size="large">男</el-radio>
                     <el-radio label="2" style="padding-bottom:8px" size="large">女</el-radio>
                  </el-radio-group>
               </el-form-item>
               <el-form-item label="所属部门" prop="deptName">
                  <el-select v-model="value" class="m-2" placeholder="请选择所属部门" size="large" style="width: 240px">
                     <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
               </el-form-item>
               <el-form-item label="营业" prop="salesman">
                  <el-select v-model="value" class="m-2" placeholder="请选择所属营业" size="large" style="width: 240px">
                     <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
               </el-form-item>
               <el-form-item label="退社状況" prop="status">
                  <el-radio-group v-model="queryParams.status" class="ml-4" style="width: 240px">
                     <el-radio label="1" style="padding-bottom:8px" size="large">在職</el-radio>
                     <el-radio label="2" style="padding-bottom:8px" size="large">退社</el-radio>
                  </el-radio-group>

               </el-form-item>
               <el-form-item>
                  <el-button style="margin-left:20px" type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                  <el-button icon="Refresh" @click="resetQuery">重置</el-button>
               </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
               <el-col :span="1.5">
                  <el-button type="primary" plain icon="Plus" @click="handleAdd"
                     v-hasPermi="['system:user:add']">新规</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
                     v-hasPermi="['system:user:edit']">修正</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
                     v-hasPermi="['system:user:remove']">削除</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button type="info" plain icon="Upload" @click="handleImport"
                     v-hasPermi="['system:user:import']">导入</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button type="warning" plain icon="Download" @click="handleExport"
                     v-hasPermi="['system:user:export']">导出</el-button>
               </el-col>
               <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="userList" @row-click="clickCurrentRow"
               @selection-change="handleSelectionChange">
               <el-table-column type="selection" width="50" align="center" />
               <el-table-column label="社员ID" align="center" key="userName" prop="userName" />
               <el-table-column label="氏名(漢字)" align="center" key="nickName" prop="nickName"
                  :show-overflow-tooltip="true" />
               <el-table-column label="電話番号" align="center" key="phonenumber" prop="phonenumber" width="120" />
               <el-table-column label="性别" align="center" key="sex" prop="sex" :show-overflow-tooltip="true" />
               <el-table-column label="生年月日" align="center" key="birthday" prop="birthday"
                  :show-overflow-tooltip="true" />
               <el-table-column label="住所" align="center" key="adress" prop="adress" :show-overflow-tooltip="true" />
               <el-table-column label="最寄り駅" align="center" key="moyorieki" prop="moyorieki"
                  :show-overflow-tooltip="true" />
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
               v-model:limit="queryParams.pageSize" @pagination="getList" />
         </el-col>
      </el-row>

      <!-- 添加修改查询用户配置对话框 -->
      <el-dialog :title="title" v-model="open" width="650px" append-to-body>
         <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
            <el-row style="align-items: end">
               <el-col :span="12">
                  <el-form-item label="氏名漢字" prop="nickName">
                     <el-input v-model="form.nickName" placeholder="请输入氏名漢字" maxlength="30" style="width:190px" />
                  </el-form-item>
                  <el-form-item label="振り仮名" prop="">
                     <el-input v-model="form.nickName" placeholder="请输入振り仮名" maxlength="30" style="width:190px" />
                  </el-form-item>
                  <el-form-item label="生年月日" prop="">
                     <el-input v-model="form.nickName" placeholder="请输入振り仮名" maxlength="30" style="width:190px" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <userAvatar style="margin-left:100px;margin-bottom: 20px;" />
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item label="電話番号" prop="phonenumber">
                     <el-input style="width:190px" v-model="form.phonenumber" placeholder="请输入電話番号" maxlength="11" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="个人邮箱" prop="email">
                     <el-input v-model="form.email" placeholder="请输入个人邮箱" maxlength="50" style="width:200px" />
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item v-if="form.userId == undefined" label="社員番号" prop="userName">
                     <el-input v-model="form.userName" placeholder="请输入社員番号" maxlength="30" style="width:190px" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item v-if="form.userId == undefined" label="登陆密码" prop="password">
                     <el-input v-model="form.password" placeholder="请输入登录密码" type="password" maxlength="20"
                        style="width:200px" show-password />
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item label="用户性别">
                     <el-select v-model="form.sex" placeholder="请选择">
                        <el-option v-for="dict in sys_user_sex" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="在职状态">
                     <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{
                           dict.label
                        }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item label="社内职级">
                     <el-select v-model="form.postIds" multiple placeholder="请选择">
                        <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName"
                           :value="item.postId" :disabled="item.status == 1"></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="归属部门" prop="deptId">
                     <el-tree-select v-model="form.deptId" :data="deptOptions" style="width:200px"
                        :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id"
                        placeholder="请选择归属部门" check-strictly />
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="23">
                  <el-form-item label="备注">
                     <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                  </el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <template #footer>
            <div class="dialog-footer" v-show="footDis">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>

      <!-- 用户导入对话框 -->
      <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
         <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
            :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
               <div class="el-upload__tip text-center">
                  <div class="el-upload__tip">
                     <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                  </div>
                  <span>仅允许导入xls、xlsx格式文件。</span>
                  <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate">下载模板</el-link>
               </div>
            </template>
         </el-upload>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitFileForm">确 定</el-button>
               <el-button @click="upload.open = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="User">
import userAvatar from "./profile/userAvatar";
import { getToken } from "@/utils/auth";
import { changeUserStatus, listUser, resetUserPwd, delUser, getUser, updateUser, addUser, deptTreeSelect } from "@/api/system/user";
import { ref } from "vue";

const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_user_sex } = proxy.useDict("sys_normal_disable", "sys_user_sex");
const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref(undefined);
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
const footDis = ref(true);
/*** 用户导入参数 */
const upload = reactive({
   // 是否显示弹出层（用户导入）
   open: false,
   // 弹出层标题（用户导入）
   title: "",
   // 是否禁用上传
   isUploading: false,
   // 是否更新已经存在的用户数据
   updateSupport: 0,
   // 设置上传的请求头部
   headers: { Authorization: "Bearer " + getToken() },
   // 上传的地址
   url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
});

const data = reactive({
   form: {},
   queryParams: {
      pageNum: 1,
      pageSize: 10,
      userName: undefined,
      sex: undefined,
      status: undefined,
      salesman: undefined,
      deptName: undefined
   },
   rules: {
      userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
      nickName: [{ required: true, message: "氏名漢字不能为空", trigger: "blur" }],
      password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }],
      email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
      phonenumber: [{ pattern: /^0[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的電話番号", trigger: "blur" }]
   }
});

const { queryParams, form, rules } = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
   if (!value) return true;
   return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
   proxy.$refs["deptTreeRef"].filter(val);
});
/** 查询部门下拉树结构 */
function getDeptTree() {
   deptTreeSelect().then(response => {
      deptOptions.value = response.data;
   });
};
//点击当前行后的个人信息展示
function clickCurrentRow(row) {
   reset();
   const userId = row.userId || ids.value;
   getUser(userId).then(response => {
      form.value = response.data;
      postOptions.value = response.posts;
      roleOptions.value = response.roles;
      form.value.postIds = response.postIds;
      form.value.roleIds = response.roleIds;
      open.value = true;
      title.value = "社員情報照会";
      form.password = "";
      footDis.value = false
   });
}
/** 查询用户列表 */
function getList() {
   loading.value = true;
   listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {

      loading.value = false;
      userList.value = res.rows.map((item) => {
         item.sex === '0' ? item.sex = '男' : item.sex = '女';
         return item
      });
      total.value = res.total;
   });
};
/** 节点单击事件 */
function handleNodeClick(data) {
   queryParams.value.deptId = data.id;
   handleQuery();
};
/** 搜索按钮操作 */
function handleQuery() {
   queryParams.value.pageNum = 1;
   getList();
};
/** 重置按钮操作 */
function resetQuery() {
   dateRange.value = [];
   proxy.resetForm("queryRef");
   queryParams.value.deptId = undefined;
   proxy.$refs.deptTreeRef.setCurrentKey(null);
   handleQuery();
};
/** 删除按钮操作 */
function handleDelete(row) {
   const userIds = row.userId || ids.value;
   proxy.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function () {
      return delUser(userIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
};
/** 导出按钮操作 */
function handleExport() {
   proxy.download("system/user/export", {
      ...queryParams.value,
   }, `user_${new Date().getTime()}.xlsx`);
};
/** 用户状态修改  */
function handleStatusChange(row) {
   let text = row.status === "0" ? "启用" : "停用";
   proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(function () {
      return changeUserStatus(row.userId, row.status);
   }).then(() => {
      proxy.$modal.msgSuccess(text + "成功");
   }).catch(function () {
      row.status = row.status === "0" ? "1" : "0";
   });
};
/** 更多操作 */
function handleCommand(command, row) {
   switch (command) {
      case "handleResetPwd":
         handleResetPwd(row);
         break;
      case "handleAuthRole":
         handleAuthRole(row);
         break;
      default:
         break;
   }
};
/** 跳转角色分配 */
function handleAuthRole(row) {
   const userId = row.userId;
   router.push("/system/user-auth/role/" + userId);
};
/** 重置密码按钮操作 */
function handleResetPwd(row) {
   proxy.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      closeOnClickModal: false,
      inputPattern: /^.{5,20}$/,
      inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
   }).then(({ value }) => {
      resetUserPwd(row.userId, value).then(response => {
         proxy.$modal.msgSuccess("修改成功，新密码是：" + value);
      });
   }).catch(() => { });
};
/** 选择条数  */
function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.userId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
};
/** 导入按钮操作 */
function handleImport() {
   upload.title = "用户导入";
   upload.open = true;
};
/** 下载模板操作 */
function importTemplate() {
   proxy.download("system/user/importTemplate", {
   }, `user_template_${new Date().getTime()}.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
   upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
   upload.open = false;
   upload.isUploading = false;
   proxy.$refs["uploadRef"].handleRemove(file);
   proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
   getList();
};
/** 提交上传文件 */
function submitFileForm() {
   proxy.$refs["uploadRef"].submit();
};
/** 重置操作表单 */
function reset() {
   form.value = {
      userId: undefined,
      deptId: undefined,
      userName: undefined,
      nickName: undefined,
      password: undefined,
      phonenumber: undefined,
      email: undefined,
      sex: undefined,
      status: "0",
      remark: undefined,
      postIds: [],
      roleIds: []
   };
   proxy.resetForm("userRef");
};
/** 取消按钮 */
function cancel() {
   open.value = false;
   reset();
};
/** 新增按钮操作 */
function handleAdd() {
   reset();
   getUser().then(response => {
      postOptions.value = response.posts;
      roleOptions.value = response.roles;
      open.value = true;
      title.value = "社員新規登録";
      form.value.password = initPassword.value;
      footDis.value = true;
      console.log(footDis.value)
   });
};
/** 修改按钮操作 */
function handleUpdate(row) {
   reset();
   const userId = row.userId || ids.value;
   getUser(userId).then(response => {
      form.value = response.data;
      postOptions.value = response.posts;
      roleOptions.value = response.roles;
      form.value.postIds = response.postIds;
      form.value.roleIds = response.roleIds;
      open.value = true;
      title.value = "社員情報修正";
      form.password = "";
      footDis.value = true;
      console.log(footDis.value)
   });
};


/** 提交按钮 */
function submitForm() {
   proxy.$refs["userRef"].validate(valid => {
      if (valid) {
         if (form.value.userId != undefined) {
            updateUser(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               getList();
            });
         } else {
            addUser(form.value).then(response => {
               proxy.$modal.msgSuccess("新增成功");
               open.value = false;
               getList();
            });
         }
      }
   });
};
getDeptTree();
getList();
</script>
