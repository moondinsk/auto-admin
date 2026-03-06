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
    { label: "컴포넌트", icon: IoLogoWebComponent, link: `${PATH.HOME}${SEGMENT.COMPONENTS}` },
    { label: "스크립트 설치", icon: IoCodeSlash },
    { label: "매뉴얼 다운로드", icon: FiDownload },
    { label: "사용 FAQ", icon: AiOutlineQuestionCircle },
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
      <Buttons className="flex-box" gap={10}>
        {ACTIONS.map(({ label, icon: Icon }) => (
          <li key={label}>
            <Button
              bgColor={theme.colors.palette.gray800}
              radius="sm"
              gap={6}
              onClick={() => handleButtonClick(label)}>
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
