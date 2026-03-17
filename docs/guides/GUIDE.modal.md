# Modal 가이드

## 위치

`src/components/Modal/Modal.jsx`

## 목적

`modalStore.modals` 스택을 화면에 렌더링할 때 사용하는 공용 모달 UI 컴포넌트입니다.

## 권장 사용법

```jsx
import { useStore } from "@/store";
import { MODAL_PAYLOAD } from "@/constants/modal";
import GuideContent from "@/components/Modal/GuideContent";

function Example() {
  const { modalStore } = useStore();

  const openGuideModal = () => {
    modalStore.open(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: GuideContent,
        props: {
          data: {
            title: "운영 가이드",
            description: "저장 전 설정을 확인하세요.",
          },
          onConfirm: () => {
            console.log("가이드 확인");
          },
          onCancel: () => {
            console.log("가이드 닫기");
          },
        },
      }),
    );
  };

  return <button onClick={openGuideModal}>열기</button>;
}
```

## 주요 Props

- `type`: 모달 타입. `modal` 또는 `confirm`.
- `title`: 헤더 제목 텍스트.
- `message`: 바디 기본 텍스트.
- `children`: 커스텀 바디 콘텐츠.
- `component`: 바디에서 렌더링할 React 컴포넌트.
- `width`: 모달 너비(`number` 또는 CSS 문자열).
- `maxHeight`: 모달 최대 높이(`number` 또는 CSS 문자열).
- `onConfirm`: 확인 버튼 클릭 시 실행할 콜백.
- `onCancel`: 취소 버튼 또는 dim 클릭 시 실행할 콜백.
- `confirmText`: 확인 버튼 라벨.
- `cancelText`: 취소 버튼 라벨.
- `zIndex`: 스택 순서에 따라 전달되는 z-index 값.
- 나머지 props: `component`로 전달됩니다.

## 렌더링 우선순위

1. `children`
2. `component`
3. `message`

## 현재 동작

- `type === "confirm"`일 때만 취소 버튼이 렌더링됩니다.
- dim 클릭은 `onCancel`을 호출합니다.
- 확인/취소 버튼 클릭 후 실제 닫힘은 `ModalItem`이 처리합니다.
- `onConfirm` 또는 `onCancel`이 `false`를 반환하면 클릭 기반 닫힘은 막을 수 있습니다.
- ESC는 `ModalManager`에서 처리하며, 현재 구현에서는 최상단 모달을 바로 닫습니다.

## 참고

- 전역 마운트 위치는 `src/layouts/Root.jsx`입니다.
- 모달 열기는 `modalStore.open(payload)`를 사용합니다.
- payload 기본값은 `src/constants/modal.js`의 `MODAL_PAYLOAD`, `CONFIRM_PAYLOAD`를 사용합니다.
