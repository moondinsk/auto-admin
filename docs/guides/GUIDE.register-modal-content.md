# RegisterModalContent 가이드

## 위치

`src/components/Modal/RegisterModalContent.jsx`

## 목적

등록/수정 모달 바디에 넣어 사용하는 폼 형태 콘텐츠 컴포넌트입니다.

## 기본 사용법

```jsx
import RegisterModalContent from "@/components/Modal/RegisterModalContent";
import { useStore } from "@/store";
import { MODAL_PAYLOAD } from "@/constants/modal";

function Example() {
  const { modalStore } = useStore();

  const openRegister = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.REGISTER_MODAL({
        component: RegisterModalContent,
        data: {
          groupName: "메인 배너",
          effect: "slide",
          bannerCode: "B0000001",
        },
      }),
    );
  };

  return <button onClick={openRegister}>열기</button>;
}
```

## 주요 Props

- `data.groupName`: 배너명 입력의 초기 텍스트.
- `data.effect`: 셀렉트 초기값(`slide` 또는 `fade`).
- `data.bannerCode`: 메모 필드 초기 텍스트.

## 참고

- 입력값은 `defaultValue` 기반이라 uncontrolled 방식입니다.
- 효과 선택에는 `react-select`를 사용합니다.
- 실제 값 수집/저장은 외부 로직에서 처리합니다.
- 현재 데모 페이지(`src/pages/Components/ComponentsModal.jsx`)의 `openRegisterModal`은 `data.title`, `data.description`를 전달하지만, `RegisterModalContent`는 해당 값을 사용하지 않습니다.
- 초기값을 표시하려면 `data.groupName`, `data.effect`, `data.bannerCode`를 전달하세요.
