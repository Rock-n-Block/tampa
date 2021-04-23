import React from 'react';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { dialogActions } from '../../redux/actions';

import MetamaskImg from '../../assets/img/metamask.svg';

import './ModalDialog.scss'

const ModalDialog = () => {
    const dispatch = useDispatch();

    const { open, content, footer, isDarkTheme } = useSelector((state) => {
        return {
            open: state.dialog?.open,
            content: state.dialog?.content,
            footer: state.dialog?.footer,
            isDarkTheme: state.theme?.isDarkTheme
        }
    })

    const handleOk = () => {
        dispatch(dialogActions.toggleDialog({open:false}))
    }

    return (
    <Modal
    visible={open}
    onOk={handleOk}
    centered={true}
    onCancel={handleOk}
    className={isDarkTheme && 'darktheme'}
    footer={footer.length>0 && footer}
    >
        {content}
    </Modal>
    );
}

export default ModalDialog;