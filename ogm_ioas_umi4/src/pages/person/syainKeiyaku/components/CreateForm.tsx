import React from 'react';
import { Modal } from 'antd';
import { Outlet } from 'umi';
// import { useOutletContext } from 'umi';

type CreateFormProps = {
  modalVisible: boolean;
  onCancel: () => void;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
// const CreateForm: React.FC<CreateFormProps> = () => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {/* {props.children} */}
      <Outlet />
    </Modal>
  );
};

export default CreateForm;
