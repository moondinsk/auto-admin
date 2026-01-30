import React from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

const CardSection = ({ title, children }) => {
  return (
    <Section>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Section>
  );
};

export default CardSection;

const Section = styled.section`
  border: 1px solid ${theme.colors.gray[100]};
  padding: 32px 40px;
  box-shadow: 0 0 10px 0 rgba(98, 120, 233, 0.1);
  background: ${theme.colors.gray.white};
  border-radius: 10px;
`;

const Title = styled.h2`
  color: var(--black-282-b-39, #282b39);

  font-family: "Noto Sans KR";
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px; /* 140% */
  letter-spacing: -0.2px;
  margin-bottom: 20px;
  font-weight: 700;
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
