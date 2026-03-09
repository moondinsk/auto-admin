# GuideContent 가이드

## 위치

`src/components/Modal/GuideContent.jsx`

## 목적

가이드형 모달에서 사용하는 간단한 안내 콘텐츠 컴포넌트입니다.

## 기본 사용법

```jsx
import GuideContent from "@/components/Modal/GuideContent";
import { useStore } from "@/store";
import { MODAL_PAYLOAD } from "@/constants/modal";

function Example() {
  const { modalStore } = useStore();

  const openGuide = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: GuideContent,
        data: {
          title: "배너 가이드",
          description: "저장 전 노출 기간과 상태를 확인하세요.",
        },
      }),
    );
  };

  return <button onClick={openGuide}>열기</button>;
}
```

## 주요 Props

- `data.title`: 제목 텍스트 (기본값: 로컬라이즈된 가이드 제목).
- `data.description`: 설명 텍스트 (기본값: 로컬라이즈된 가이드 설명).

## 참고

- `MODAL_PAYLOAD.GUIDE_MODAL`의 `component`로 전달해 사용하는 것을 권장합니다.
- 내부 상태 없이 최소 구조로 동작합니다.
