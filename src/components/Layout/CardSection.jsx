import React from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

const CardSection = ({ title, children }) => {
  return (
    <>
      <Section>
        <Title>{title}</Title>
        <Content>{children}</Content>
      </Section>
    </>
  );
};

export default CardSection;

const Section = styled.section`
  /* border: 1px solid ${theme.colors.gray[100]}; */
`;

const Title = styled.h2`
  color: ${theme.colors.gray.black};
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 700;
`;

const Content = styled.div`
  padding: 32px 40px;
  box-shadow: 0 0 10px 0 rgba(98, 120, 233, 0.1);
  background: ${theme.colors.gray.white};
  border-radius: 10px;
`;
