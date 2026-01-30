import { theme } from "@/styles/theme";
import { StyledButton } from "./Button.styles";

const Button = ({
  children,
  size = "md",
  radius = "md",
  color = theme.colors.primary[500],
  bgColor,
  outlined = false,
  fullWidth = false,
  disabled = false,
  ...props
}) => {
  return (
    <StyledButton
      size={size}
      radius={radius}
      outlined={outlined}
      color={color}
      bgColor={bgColor}
      fullWidth={fullWidth}
      disabled={disabled}
      {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
