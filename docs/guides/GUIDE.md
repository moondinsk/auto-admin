# Button 가이드

## 위치
`src/components/Button/Button.jsx`

## 목적
props로 스타일을 제어할 수 있는 공통 버튼 컴포넌트입니다.

## 기본 사용법
```jsx
import Button from "@/components/Button/Button";

<Button onClick={handleClick}>저장</Button>
<Button outlined color="#333">취소</Button>
```

## 주요 Props
- `children`: 버튼 라벨 또는 JSX 콘텐츠.
- `size`: `"xsm" | "sm" | "md" | "lg"` (기본값: `"md"`).
- `radius`: `"sm" | "md" | "lg" | "half" | "pill" | number` (기본값: `"md"`).
- `color`: 아웃라인 버튼의 텍스트/보더 색상 (기본값: `theme.colors.primary.main`).
- `bgColor`: 채움 버튼 배경색 (기본값: `theme.colors.primary.main`).
- `outlined`: `true`이면 아웃라인 스타일 사용.
- `fullWidth`: `true`이면 너비를 `100%`로 설정.
- `disabled`: 버튼 비활성화.
- `gap`: 내부 요소 간 간격 (기본값: `10`).
- 기타 props는 네이티브 `button` 요소로 전달됩니다.

## 참고
- 컴포넌트 내부에서 `type`은 `"button"`으로 고정됩니다.
- 아이콘 + 라벨 버튼은 `children`에 함께 넣고 필요 시 `gap`을 조정하세요.
- hover 스타일은 채움/아웃라인 모두 자동 적용됩니다.
