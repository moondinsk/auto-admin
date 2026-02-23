// src/layouts/Root.jsx
import { useRef } from "react";
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { CSSTransition } from "react-transition-group";

import { modalStore, confirmStore } from "../store";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Modal from "@/components/Modal/Modal";
import SideNav from "@/components/SideNav/SideNav";
import Toast from "@/components/Toast/Toast";
import { MainContent, RootContainer } from "./Root.style";
import ConfirmModal from "@/components/Modal/ConfirmModal";

function Root() {
  const modalNodeRef = useRef(null);
  const confirmNodeRef = useRef(null);

  return (
    <>
      {/* 공통 헤더 */}
      <Header />

      <RootContainer className="layout-container flex-box">
        {/* 사이드 네비게이션 */}
        <SideNav />
        {/* 페이지 영역 */}
        <MainContent className="page-content">
          <Outlet />
        </MainContent>
      </RootContainer>

      {/* 전역 Modal */}
      <CSSTransition
        in={modalStore.isOpen}
        timeout={500}
        classNames="modal-transition"
        unmountOnExit
        onExited={() => modalStore.reset()}
        nodeRef={modalNodeRef}>
        <div ref={modalNodeRef}>
          <Modal onClose={() => modalStore.close()} {...modalStore.props}>
            {modalStore.content}
          </Modal>
        </div>
      </CSSTransition>

      {/* 전역 Confirm Modal */}
      <CSSTransition
        in={confirmStore.isOpen}
        timeout={500}
        classNames="confirm-transition"
        unmountOnExit
        onExited={() => confirmStore.reset()}
        nodeRef={confirmNodeRef}>
        <div ref={confirmNodeRef}>
          <ConfirmModal
            title={confirmStore.title}
            message={confirmStore.message}
            confirmText={confirmStore.confirmText}
            cancelText={confirmStore.cancelText}
            successToastMessage={confirmStore.successToastMessage}
            contentComponent={confirmStore.contentComponent}
            contentProps={confirmStore.contentProps}
            onConfirm={() => confirmStore.confirm()}
            onCancel={() => confirmStore.cancel()}
          />
        </div>
      </CSSTransition>

      <Toast />
    </>
  );
}

const ObservedRoot = observer(Root);

export default ObservedRoot;
