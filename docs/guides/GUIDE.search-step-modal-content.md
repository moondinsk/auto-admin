# SearchStepModalContent 가이드

## 위치

`src/components/Modal/SearchStepModalContent.jsx`

## 목적

2단계 입력 플로우에서 1단계 역할을 담당하는 모달 콘텐츠 컴포넌트입니다.

## 기본 사용법

```jsx
import SearchStepModalContent from "@/components/Modal/SearchStepModalContent";
import { useStore } from "@/store";
import { MODAL_PAYLOAD } from "@/constants/modal";

function Example() {
  const { modalStore } = useStore();

  const openInputStepModal = () => {
    modalStore.open(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: SearchStepModalContent,
        props: {
          data: { itemName: "초기값" },
        },
      }),
    );
  };

  return <button onClick={openInputStepModal}>열기</button>;
}
```

## 주요 Props

- `data.itemName`: 1단계에 표시할 초기 값.

## 동작

- 로컬 상태 `searchedItem.itemName`를 유지합니다.
- "2차 입력 모달 열기" 버튼 클릭 시 `SearchResultFormContent`를 포함한 확인 모달이 열립니다.
- 2단계에서 변경된 값은 콜백(`onSync`)으로 다시 동기화됩니다.

## 참고

- 모달 단계 간 부모-자식 값 동기화 패턴을 보여주는 예시입니다.
- 2차 모달은 `modalStore.open` + `CONFIRM_PAYLOAD.INPUT_CONFIRM` 조합으로 열립니다.
