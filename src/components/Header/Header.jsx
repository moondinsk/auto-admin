import React from "react";
import { Buttons, Logo, StyledHeader } from "./Header.styles";
import LOGO from "@/assets/icons/common/icon-logo.svg";
import Button from "../Button/Button";
import { theme } from "@/styles/theme";
import { IoCodeSlash } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const Header = () => {
  const ACTIONS = [
    { label: "스크립트 설치", icon: IoCodeSlash },
    { label: "매뉴얼 다운로드", icon: FiDownload },
    { label: "사용 FAQ", icon: AiOutlineQuestionCircle },
  ];

  return (
    <StyledHeader className="flex-box jb ac">
      <Logo>
        <img src={LOGO} alt="" />
      </Logo>
      <Buttons className="flex-box" gap={10}>
        {ACTIONS.map(({ label, icon: Icon, onClick }) => (
          <li key={label}>
            <Button bgColor={theme.colors.palette.gray800} radius="sm" gap={6}>
              {Icon && <Icon />}
              {label}
            </Button>
          </li>
        ))}
      </Buttons>
    </StyledHeader>
  );
};

export default Header;
