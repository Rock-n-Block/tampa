import React from 'react';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { modalActions } from '../../redux/actions';

import MetamaskImg from '../../assets/img/metamask.svg';

import './Modal.scss'

const ModalComponent = () => {
    const dispatch = useDispatch();

    const { isOpen, errorMsg, isDarkTheme } = useSelector((state) => {
        return {
            isOpen: state.modal.isOpen,
            errorMsg: state.user.errorMsg,
            isDarkTheme: state.theme.isDarkTheme
        }
    })

    const handleOk = () => {
        dispatch(modalActions.toggleModal(false))
    }

    return (
        <Modal
            visible={isOpen}
            onOk={handleOk}
            centered={true}
            onCancel={handleOk}
            className={isDarkTheme && 'darktheme'}
            footer={[
                <button key="submit" type="primary" className="btn" onClick={handleOk}>
                    Ok
            </button>,
            ]}
        >
            <img src={MetamaskImg} alt="" />
            <p dangerouslySetInnerHTML={{ __html: errorMsg }}></p>
        </Modal>
    );
}

export default ModalComponent;
