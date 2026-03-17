# 확인형 모달 가이드

## 위치

`src/components/Modal/Modal.jsx`
`src/constants/modal.js`

## 목적

삭제 확인, 입력 확인, 등록 확인처럼 확인/취소가 필요한 모달을 공용 `Modal` 컴포넌트와 `CONFIRM_PAYLOAD`로 여는 패턴을 설명합니다.

## 기본 사용법

```jsx
import { useState } from "react";
import { useStore } from "@/store";
import { CONFIRM_PAYLOAD } from "@/constants/modal";
import DeleteConfirmContent from "@/components/Modal/DeleteConfirmContent";

function Example() {
  const { modalStore } = useStore();
  const [selectedIds] = useState(["b1", "b2"]);

  const openDeleteConfirm = () => {
    modalStore.open(
      CONFIRM_PAYLOAD.DELETE_CONFIRM({
        component: DeleteConfirmContent,
        props: {
          message: "선택한 항목을 삭제할까요?",
          selectedIds,
          onConfirm: () => {
            console.log("삭제 확인");
          },
          onCancel: () => {
            console.log("삭제 취소");
          },
        },
      }),
    );
  };

  return <button onClick={openDeleteConfirm}>열기</button>;
}
```

## 주요 Props

- `type`: `CONFIRM_PAYLOAD`에서 자동으로 `confirm`이 설정됩니다.
- `message`: 바디 기본 메시지.
- `onConfirm`: 확인 버튼 클릭 시 실행됩니다.
- `onCancel`: 취소 버튼 또는 dim 클릭 시 실행됩니다.
- `confirmText`: 확인 버튼 라벨.
- `cancelText`: 취소 버튼 라벨.

## 참고

- 현재 구현은 별도 `confirmStore`를 사용하지 않고 `modalStore` 하나로 관리합니다.
- `CONFIRM_PAYLOAD`는 취소 버튼이 보이는 `confirm` 타입 모달을 열기 위한 헬퍼입니다.
- `onConfirm` 또는 `onCancel`이 `false`를 반환하면 클릭 기반 닫힘은 막을 수 있습니다.
- ESC는 현재 `ModalManager`에서 최상단 모달을 바로 닫습니다.
