# DeleteConfirmContent 가이드

## 위치

`src/components/Modal/DeleteConfirmContent.jsx`

## 목적

삭제 확인 메시지를 단순 출력하는 최소 확인 바디 컴포넌트입니다.

## 기본 사용법

```jsx
import { useState } from "react";
import DeleteConfirmContent from "@/components/Modal/DeleteConfirmContent";
import { useStore } from "@/store";
import { CONFIRM_PAYLOAD } from "@/constants/modal";

function Example() {
  const { modalStore } = useStore();
  const [selectedIds, setSelectedIds] = useState([]);

  const openDeleteConfirm = () => {
    modalStore.open(
      CONFIRM_PAYLOAD.DELETE_CONFIRM({
        component: DeleteConfirmContent,
        props: {
          message: "선택한 행을 삭제할까요?",
          selectedIds,
          onConfirm: () => {
            console.log("삭제 확인", selectedIds);
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

- `message`: 문단(`p`)으로 표시할 바디 텍스트.

## 참고

- 이 컴포넌트는 `message`만 렌더링하며 `selectedIds`는 직접 사용하지 않습니다.
- 실제 확인/취소 처리 로직은 `ModalItem`과 상위 `onConfirm`, `onCancel`이 담당합니다.
- `selectedIds`가 빈 배열이어도 컴포넌트 렌더링에는 영향이 없고, 삭제 가능 여부 판단은 상위 로직에서 처리합니다.
