# TripleNestedModalContent 가이드

## 위치

`src/components/Modal/TripleNestedModalContent.jsx`

## 목적

1차 모달에서 2차 모달, 다시 3차 모달까지 여는 3중 모달 흐름 예시 컴포넌트입니다.

## 기본 사용법

```jsx
import TripleNestedModalContent from "@/components/Modal/TripleNestedModalContent";
import { MODAL_PAYLOAD } from "@/constants/modal";
import { useStore } from "@/store";

function Example() {
  const { modalStore } = useStore();

  const openTripleNestedModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: TripleNestedModalContent,
        data: {
          description: "1차 모달에서 2차, 3차까지 순차적으로 열 수 있습니다.",
        },
      }),
    );
  };

  return <button onClick={openTripleNestedModal}>열기</button>;
}
```

## 주요 Props

- `data.description`: 1차 모달에서 보여줄 안내 문구.

## 동작

- 1차 모달에서 `2차 모달 열기` 클릭.
- 2차 모달(파일 내부 컴포넌트 `TripleNestedSecondModalContent`)에서 `3차 모달 열기` 클릭.
- 3차 모달은 `GuideContent`로 렌더링됩니다.

## 참고

- 다중 모달 렌더링은 `modalStore.modals` 스택과 `Root.jsx`의 `TransitionGroup` 렌더링에 의존합니다.
- 동작 로그는 개발 환경에서 `modalStore.debugStack` 콘솔 출력으로 확인할 수 있습니다.
- `TripleNestedSecondModalContent`는 같은 파일 내부에 정의되어 있으며 별도 export되지 않습니다.
