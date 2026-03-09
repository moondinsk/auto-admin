// src/layouts/Root.jsx
import { useRef } from "react";
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Header from "@/components/Header/Header";
import Modal from "@/components/Modal/Modal";
import SideNav from "@/components/SideNav/SideNav";
import Toast from "@/components/Toast/Toast";
import { MainContent, RootContainer } from "./Root.style";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { useStore } from "@/store";

function ModalTransitionItem({ modal, isTop, zIndex, onClose, ...transitionProps }) {
  const nodeRef = useRef(null);

  return (
    <CSSTransition timeout={500} classNames="modal-transition" nodeRef={nodeRef} {...transitionProps}>
      <div ref={nodeRef}>
        <Modal {...modal.props} isTop={isTop} zIndex={zIndex} onClose={onClose}>
          {modal.content}
        </Modal>
      </div>
    </CSSTransition>
  );
}

function Root() {
  const confirmNodeRef = useRef(null);

  const { modalStore, confirmStore } = useStore();

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
      <TransitionGroup component={null}>
        {modalStore.modals.map((modal, index) => {
          const isTop = index === modalStore.modals.length - 1;

          return (
            <ModalTransitionItem
              key={modal.id}
              modal={modal}
              isTop={isTop}
              zIndex={1000 + index * 10}
              onClose={() => modalStore.closeById(modal.id)}
            />
          );
        })}
      </TransitionGroup>

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
