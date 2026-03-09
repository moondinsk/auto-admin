import React from "react";
import styled from "styled-components";
import { Switch } from "./ToggleSwitch.style";

const ToggleSwitch = ({ checked, onChange, ariaLabel }) => {
  return (
    <Switch className="flex-box jc" $checked={Boolean(checked)}>
      <input type="checkbox" checked={Boolean(checked)} onChange={onChange} aria-label={ariaLabel} />
      <span />
    </Switch>
  );
};

export default ToggleSwitch;
