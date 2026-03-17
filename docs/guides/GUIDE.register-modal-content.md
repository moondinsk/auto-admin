# RegisterModalContent 가이드

## 위치

`src/components/Modal/RegisterModalContent.jsx`

## 목적

등록/수정 모달 바디에 넣어 사용하는 폼 형태 콘텐츠 컴포넌트입니다.

## 기본 사용법

```jsx
import RegisterModalContent from "@/components/Modal/RegisterModalContent";
import { useStore } from "@/store";
import { CONFIRM_PAYLOAD } from "@/constants/modal";
import { validateWithToast } from "@/utils/validation";

function Example() {
  const { modalStore } = useStore();
  const validator = () => true;

  const openRegister = () => {
    modalStore.open(
      CONFIRM_PAYLOAD.REGISTER_MODAL({
        component: RegisterModalContent,
        props: {
          data: {
            groupName: "메인 배너",
            effect: "slide",
            bannerCode: "B0000001",
          },
          onConfirm: (formData) => {
            if (!validateWithToast(formData, validator, setToast)) {
              return false;
            }
            console.log("등록", formData);
          },
          onCancel: (formData) => {
            console.log("등록 취소", formData);
          },
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
- `onActionDataChange`: 현재 폼 데이터를 상위에 전달하기 위한 내부 브리지 props입니다.

## 참고

- 입력값은 `useState` 기반 controlled 방식입니다.
- 효과 선택에는 `react-select`를 사용합니다.
- 입력 변경 시 최신 `formData`가 상위로 전달되며, 확인/취소 콜백에서 `data` 인자로 받을 수 있습니다.
- 초기값을 표시하려면 `data.groupName`, `data.effect`, `data.bannerCode`를 전달하세요.
