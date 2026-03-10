import { useRef } from "react";
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Header from "@/components/Header/Header";
import Modal from "@/components/Modal/Modal";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import SideNav from "@/components/SideNav/SideNav";
import Toast from "@/components/Toast/Toast";
import { MainContent, RootContainer } from "./Root.style";
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

function ConfirmTransitionItem({ confirmStore }) {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      in={confirmStore.isOpen}
      timeout={500}
      classNames="confirm-transition"
      unmountOnExit
      onExited={() => confirmStore.reset()}
      nodeRef={nodeRef}>
      <div ref={nodeRef}>
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
  );
}

function Root() {
  const { modalStore, confirmStore } = useStore();

  return (
    <>
      <Header />

      <RootContainer className="layout-container flex-box">
        <SideNav />
        <MainContent className="page-content">
          <Outlet />
        </MainContent>
      </RootContainer>

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

      <ConfirmTransitionItem confirmStore={confirmStore} />

      <Toast />
    </>
  );
}

export default observer(Root);
