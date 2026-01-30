import { theme } from "@/styles/theme";
import { StyledButton } from "./Button.styles";

const Button = ({
  children,
  size = "md",
  radius = "md",
  color = theme.colors.primary.main,
  bgColor = theme.colors.primary.main,
  outlined = false,
  fullWidth = false,
  disabled = false,
  gap = 10,
  ...props
}) => {
  return (
    <StyledButton
      type="button"
      $size={size}
      $radius={radius}
      $outlined={outlined}
      $color={color}
      $bgColor={bgColor}
      $fullWidth={fullWidth}
      $gap={gap}
      disabled={disabled}
      {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
