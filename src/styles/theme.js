// theme.js
const TEXT_BASE = "#282B39";

const palette = {
  blue500: "#7386E8",
  gray900: "#282B39",
  gray800: "#44475C",
  gray700: "#434659",
  gray400: "#9B9FAF",
  gray100: "#EFF1FA",
  white: "#FFFFFF",
  red500: "#FF0038",

  // layout
  layoutDark: "#2c2f42",
  layoutBody: "#f9f9fa",
};

export const theme = {
  colors: {
    palette,

    primary: {
      main: palette.blue500,
    },

    gray: {
      white: palette.white,
      main: palette.gray400,
      black: palette.gray900,
    },

    error: {
      main: palette.red500,
    },

    layout: {
      headerBG: palette.layoutDark,
      sidebarBG: palette.layoutDark,
      bodyBG: palette.layoutBody,
    },

    // 의미 기반 컬러(여기저기 재사용하기 )
    text: {
      primary: palette.gray900,
      secondary: palette.gray700,
      muted: palette.gray400,
      inverse: palette.white,
    },

    bg: {
      default: palette.layoutBody,
      subtle: palette.gray100,
      dark: palette.gray900,
    },

    action: {
      primary: palette.blue500,
      danger: palette.red500,
      disabled: palette.gray100,
    },

    border: {
      default: palette.gray100,
      strong: palette.gray700,
    },
  },

  fonts: {
    family: `"Pretendard", "Noto Sans KR", sans-serif`,
    size: "14px",
    color: TEXT_BASE,
  },

  size: {
    headerHeight: "80px",
    sidebarWidth: "250px",
  },
};
