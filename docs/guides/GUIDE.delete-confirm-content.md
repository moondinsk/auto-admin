# DeleteConfirmContent 가이드

## 위치
`src/components/Modal/DeleteConfirmContent.jsx`

## 목적
삭제 확인 메시지를 단순 출력하는 최소 확인 바디 컴포넌트입니다.

## 기본 사용법
```jsx
import DeleteConfirmContent from "@/components/Modal/DeleteConfirmContent";
import { confirmStore } from "@/store";
import { CONFIRM_PAYLOAD } from "@/constants/modal";

confirmStore.openByPayload(
  CONFIRM_PAYLOAD.DELETE_CONFIRM({
    component: DeleteConfirmContent,
    message: "선택한 행을 삭제할까요?",
    data: { selectedIds: ["id-1", "id-2"] },
  }),
);
```

## 주요 Props
- `message`: 문단(`p`)으로 표시할 바디 텍스트.

## 참고
- 이 컴포넌트는 `message`만 렌더링하며 `data`는 사용하지 않습니다.
- 실제 확인/취소 처리 로직은 `ConfirmModal`과 `confirmStore`가 담당합니다.
