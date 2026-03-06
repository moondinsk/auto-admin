# Modal 가이드

## 위치
`src/components/Modal/Modal.jsx`

## 목적
`modalStore` 기반 전역 모달 렌더링에 사용하는 공용 모달 컴포넌트입니다.

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
/>
```

## 권장 사용법 (스토어 페이로드)
```jsx
import { modalStore } from "@/store";
import { MODAL_PAYLOAD } from "@/constants/modal";
import GuideContent from "@/components/Modal/GuideContent";

modalStore.openByPayload(
  MODAL_PAYLOAD.GUIDE_MODAL({
    component: GuideContent,
    data: {
      title: "운영 가이드",
      description: "저장 전 설정을 확인하세요.",
    },
  }),
);
```

## 주요 Props
- `title`: 헤더 제목 텍스트.
- `message`: 바디 기본 텍스트.
- `children`: 커스텀 바디 콘텐츠(우선순위 가장 높음).
- `contentComponent`: 바디에서 렌더링할 React 컴포넌트.
- `contentProps`: `contentComponent`로 전달할 props.
- `width`: 모달 너비(`number` 또는 CSS 문자열).
- `height`: 모달 최대 높이(`number` 또는 CSS 문자열).
- `onClose`: 닫힘 흐름에서 호출.
- `onConfirm`: 확인 시 닫기 전에 호출.
- `onCancel`: 취소/배경 클릭 시 닫기 전에 호출.
- `confirmText`: 확인 버튼 라벨(기본값: 로컬라이즈된 확인 라벨).
- `cancelText`: 취소 버튼 라벨(빈 문자열이면 취소 버튼 숨김).
- `successToastMessage`: 확인 후 표시할 토스트 메시지(비어 있지 않을 때).

## 렌더링 우선순위
1. `children`
2. `contentComponent`와 `contentProps`
3. `message`

## 참고
- 배경 클릭 시 취소 흐름(`onCancel` -> `onClose`)이 실행됩니다.
- 확인 흐름은 `onConfirm` 호출 후(필요 시 토스트) `onClose`로 마무리됩니다.
- 전역 마운트 위치는 `src/layouts/Root.jsx`입니다.
