// src/layouts/Root.jsx
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { modalStore, confirmStore } from "../store";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import Modal from "@/components/Modal/Modal";
import SideNav from "@/components/SideNav/SideNav";
import Toast from "@/components/Toast/Toast";
import { MainContent, RootContainer } from "./Root.style";

function Root() {
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
      {modalStore.isOpen && (
        <Modal onClose={() => modalStore.close()} {...modalStore.props}>
          {modalStore.content}
        </Modal>
      )}
      {/* 전역 Confirm Modal */}
      {confirmStore.isOpen && (
        <ConfirmModal
          title={confirmStore.title}
          message={confirmStore.message}
          onConfirm={() => confirmStore.confirm()}
          onCancel={() => confirmStore.cancel()}
        />
      )}

      <Toast />
    </>
  );
}

const ObservedRoot = observer(Root);

export default ObservedRoot;
