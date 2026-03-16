# ConfirmModal 가이드

## 위치

`src/components/Modal/ConfirmModal.jsx`

## 목적

삭제 확인, 입력 확인 같은 액션에 사용하는 `confirmStore` 기반 확인 모달입니다.

## 기본 사용법 (스토어 페이로드)

```jsx
import { useState } from "react";
import { useStore } from "@/store";
import { CONFIRM_PAYLOAD } from "@/constants/modal";
import DeleteConfirmContent from "@/components/Modal/DeleteConfirmContent";

function Example() {
  const { confirmStore } = useStore();
  const [selectedIds, setSelectedIds] = useState([]);

  const openDeleteConfirm = () => {
    confirmStore.openByPayload(
      CONFIRM_PAYLOAD.DELETE_CONFIRM({
        component: DeleteConfirmContent,
        message: "선택한 항목을 삭제할까요?",
        data: { selectedIds },
      }),
    );
  };

  return <button onClick={openDeleteConfirm}>열기</button>;
}
```

## 주요 Props

- `title`: 헤더 제목.
- `message`: 바디 기본 메시지.
- `contentComponent`: 선택적 콘텐츠 컴포넌트.
- `contentProps`: 콘텐츠 컴포넌트에 전달할 props.
- `onConfirm`: 확인 콜백.
- `onCancel`: 취소 콜백(딤 클릭 포함).
- `confirmText`: 확인 라벨(기본값: `"확인"`).
- `cancelText`: 취소 라벨(기본값: `"취소"`).
- `successToastMessage`: 확인 시 노출할 토스트 메시지(기본값: `"확인되었습니다."`).

## 참고

- `Modal`과 달리 `children`을 직접 받지 않습니다.
- `confirmStore.openByPayload`는 확인/취소 결과로 resolve되는 Promise를 반환합니다.
- `Modal`과 달리 `cancelText` 기본값이 `"취소"`라서 취소 버튼이 항상 렌더링됩니다.
- 전역 마운트 위치는 `src/layouts/Root.jsx`입니다.
- 확인 시 토스트는 `src/utils/toast.js`의 `showToast`를 통해 노출됩니다.
- 현재 데모 페이지(`src/pages/Components/ComponentsModal.jsx`)는 `selectedIds` 기본값을 빈 배열로 두고 체크박스로 선택값을 채운 뒤 확인 모달을 엽니다.
