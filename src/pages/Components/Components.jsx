import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import { theme } from "@/styles/theme";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

const Components = () => {
  return (
    <CardSection title="Button 컴포넌트 예시">
      <Button bgColor={theme.colors.gray.black}>Filled</Button>
      <Button outlined color={theme.colors.primary.main} radius="half">
        Outlined
        <IoIosArrowForward size={14} />
      </Button>
      <Button disabled>Filled (Disabled)</Button>
      <Button outlined disabled radius={0}>
        Outlined (Disabled)
      </Button>
      <Button size="sm">수정</Button>
      <Button size="xsm" radius={3}>
        삭제
      </Button>
      <Button fullWidth>Full Width</Button>
    </CardSection>
  );
};

export default Components;
