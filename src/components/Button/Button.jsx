import { StyledButton } from "./Button.styles";

const Button = ({
  children,
  size = "md",
  radius = "md",
  variant = "solid",
  color = "#111",
  fullWidth = false,
  ...props
}) => {
  return (
    <StyledButton size={size} radius={radius} variant={variant} color={color} fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
