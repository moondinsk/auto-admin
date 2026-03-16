import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";
import SideNav from "@/components/SideNav/SideNav";
import Toast from "@/components/Toast/Toast";
import ModalManager from "@/components/Modal/ModalManager";
import { MainContent, RootContainer } from "./Root.style";

const Root = () => {
  return (
    <>
      <Header />

      <RootContainer className="layout-container flex-box">
        <SideNav />
        <MainContent className="page-content">
          <Outlet />
        </MainContent>
      </RootContainer>

      <ModalManager />

      <Toast />
    </>
  );
};

export default Root;
