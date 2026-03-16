# Modal 가이드

## 위치

`src/components/Modal/Modal.jsx`

## 목적

`modalStore.modals` 스택 기반 전역 렌더링에 사용하는 공용 모달 컴포넌트입니다.

## 기본 사용법 (직접 렌더링)

```jsx
import Modal from "@/components/Modal/Modal";

<Modal
  title="가이드"
  message="내용을 확인하세요."
  confirmText="확인"
  cancelText="닫기"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  onClose={handleClose}
/>;
```

## 권장 사용법 (스토어 페이로드)

```jsx
import { useStore } from "@/store";
import { MODAL_PAYLOAD } from "@/constants/modal";
import GuideContent from "@/components/Modal/GuideContent";

function Example() {
  const { modalStore } = useStore();

  const openGuideModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: GuideContent,
        data: {
          title: "운영 가이드",
          description: "저장 전 설정을 확인하세요.",
        },
      }),
    );
  };

  return <button onClick={openGuideModal}>열기</button>;
}
```

## 주요 Props

- `title`: 헤더 제목 텍스트.
- `message`: 바디 기본 텍스트.
- `children`: 커스텀 바디 콘텐츠(우선순위 가장 높음).
- `contentComponent`: 바디에서 렌더링할 React 컴포넌트.
- `contentProps`: `contentComponent`로 전달할 props.
- `width`: 모달 너비(`number` 또는 CSS 문자열).
- `maxHeight`: 모달 최대 높이(`number` 또는 CSS 문자열).
- `onClose`: 닫힘 흐름에서 호출.
- `onConfirm`: 확인 시 닫기 전에 호출.
- `onCancel`: 취소/배경 클릭 시 닫기 전에 호출.
- `confirmText`: 확인 버튼 라벨(기본값: `"확인"`).
- `cancelText`: 취소 버튼 라벨(기본값: `""`, 빈 문자열이면 취소 버튼 숨김).
- `successToastMessage`: 확인 후 표시할 토스트 메시지(비어 있지 않을 때).
- `isTop`: 스택에서 최상위 모달인지 여부(기본값: `true`).
- `zIndex`: 모달 dim/panel의 z-index 기준값(기본값: `1000`).

## 렌더링 우선순위

1. `children`
2. `contentComponent`와 `contentProps`
3. `message`

## 참고

- 배경 클릭 시 취소 흐름(`onCancel` -> `onClose`)이 실행됩니다.
- 확인 흐름은 `onConfirm` 호출 후(필요 시 `showToast`) `onClose`로 마무리됩니다.
- `isTop=false`인 모달은 확인/취소/ESC 이벤트를 처리하지 않습니다.
- 직접 렌더링 시 `onClose`를 전달하지 않으면 확인/취소 후 모달이 닫히지 않을 수 있습니다.
- 전역 마운트 위치는 `src/layouts/Root.jsx`입니다.
- 다중 모달(2중/3중/n중)은 `src/store/modal/modalStore.js`의 `modals` 배열로 관리됩니다.
