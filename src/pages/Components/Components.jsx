import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import { theme } from "@/styles/theme";
import React from "react";

const Components = () => {
  return (
    <CardSection title="Button 컴포넌트 예시">
      <Button bgColor={theme.colors.gray.black}>Filled</Button>
      <Button outlined color={theme.colors.primary[500]} radius="half">
        Outlined
      </Button>
      <Button disabled>Filled (Disabled)</Button>
      <Button outlined disabled radius={0}>
        Outlined (Disabled)
      </Button>
    </CardSection>
  );
};

export default Components;
