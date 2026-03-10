import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import { SEGMENT } from "@/routes/paths";
import { theme } from "@/styles/theme";
import { ComponentsLayout, SectionTabs } from "./Components.styles";

const componentPages = [
  { label: "Table", to: SEGMENT.COMPONENTS_TABLE },
  { label: "Modal", to: SEGMENT.COMPONENTS_MODAL },
  { label: "Etc", to: SEGMENT.COMPONENTS_ETC },
];

const Components = () => {
  return (
    <ComponentsLayout className="flex-box col">
      <CardSection title="Component Pages">
        <SectionTabs className="flex-box">
          {componentPages.map(({ label, to }) => (
            <NavLink key={to} to={to}>
              {({ isActive }) => (
                <Button
                  radius="sm"
                  bgColor={isActive ? theme.colors.primary.main : theme.colors.palette.gray800}
                  style={{ opacity: isActive ? 1 : 0.85 }}>
                  {label}
                </Button>
              )}
            </NavLink>
          ))}
        </SectionTabs>
      </CardSection>

      <Outlet />
    </ComponentsLayout>
  );
};

export default Components;
