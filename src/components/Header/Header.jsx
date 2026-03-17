import React from "react";
import { Buttons, Logo, StyledHeader } from "./Header.styles";
import LOGO from "@/assets/icons/common/icon-logo.svg";
import Button from "../Button/Button";
import { theme } from "@/styles/theme";
import { IoCodeSlash, IoLogoWebComponent } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { PATH, SEGMENT } from "@/routes/paths";
const Header = () => {
  const navigate = useNavigate();
  const ACTIONS = [
    {
      label: "컴포넌트-Table",
      icon: IoLogoWebComponent,
      link: `${PATH.HOME}${SEGMENT.COMPONENTS}/${SEGMENT.COMPONENTS_TABLE}`,
    },
    {
      label: "컴포넌트-Modal",
      icon: IoLogoWebComponent,
      link: `${PATH.HOME}${SEGMENT.COMPONENTS}/${SEGMENT.COMPONENTS_MODAL}`,
    },
    {
      label: "컴포넌트-Etc",
      icon: IoLogoWebComponent,
      link: `${PATH.HOME}${SEGMENT.COMPONENTS}/${SEGMENT.COMPONENTS_ETC}`,
    },
  ];

  // 클릭 이벤트 핸들러 예시
  const handleButtonClick = (label) => {
    const action = ACTIONS.find((action) => action.label === label);
    if (action && action.link) {
      navigate(action.link);
    }
  };

  return (
    <StyledHeader className="flex-box jb ac">
      <Logo>
        <img src={LOGO} alt="" />
      </Logo>
      <Buttons className="flex-box gap-10">
        {ACTIONS.map(({ label, icon: Icon }) => (
          <li key={label}>
            <Button bgColor={theme.colors.palette.gray800} radius="sm" gap={6} onClick={() => handleButtonClick(label)}>
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
