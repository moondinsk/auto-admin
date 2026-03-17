# AlertModalContent 가이드

## 위치

`src/components/Modal/AlertModalContent.jsx`

## 목적

알림 모달에서 사용하는 단순 메시지 바디 컴포넌트입니다.

## 기본 사용법

```jsx
import AlertModalContent from "@/components/Modal/AlertModalContent";
import { useStore } from "@/store";
import { MODAL_PAYLOAD } from "@/constants/modal";

function Example() {
  const { modalStore } = useStore();

  const openAlert = () => {
    modalStore.open(
      MODAL_PAYLOAD.ALERT_MODAL({
        component: AlertModalContent,
        props: {
          message: "요청이 정상적으로 처리되었습니다.",
        },
      }),
    );
  };

  return <button onClick={openAlert}>열기</button>;
}
```

## 주요 Props

- `message`: 바디에 렌더링할 텍스트.

## 참고

- 빠른 안내 목적의 최소 콘텐츠 구조로 작성되었습니다.
- 일반적으로 `MODAL_PAYLOAD.ALERT_MODAL`과 `modalStore.open`으로 열어 사용합니다.
