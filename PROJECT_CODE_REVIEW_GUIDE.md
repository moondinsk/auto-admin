# Admin Boiler Plate 코드 리뷰 & 사용 가이드

이 문서는 현재 코드베이스를 **영역(Area) / 구간(Section)** 단위로 나눠,
- 무엇을 담당하는지
- 어떻게 사용하는지
- 내부 로직이 어떻게 흐르는지
- 리뷰 관점에서 어떤 점이 좋은지/보완이 필요한지
## 1) 빠른 실행 방법

```bash
yarn
```

### 개발 서버 실행
```bash
yarn dev
```

### 빌드
```bash
yarn build
```

### 린트
```bash
yarn lint
```
---

## 2) 전체 아키텍처 요약

앱의 상위 흐름은 다음과 같습니다.

1. `src/main.jsx`에서 React 앱 마운트
2. `src/App.jsx`에서 전역 Provider, Theme, Router 연결
3. `src/routes/router.jsx`에서 페이지 라우팅 구성
5. 페이지/컴포넌트에서 MobX Store와 API 모듈을 사용해 상태와 비즈니스 로직 처리

---

## 3) 영역별 코드 리뷰 + 사용법 + 로직 설명

- **역할**: 앱 시작점, `#root`에 앱 렌더링.
- **사용법**: 일반적으로 수정할 일은 거의 없고, 글로벌 CSS import 위치를 관리할 때만 수정.
### A-2. `src/App.jsx`
- **역할**: 전역 의존성 결합 레이어.
  - `GlobalStyle`
  - `RouterProvider`


## B. 라우팅/권한 영역

### B-1. `src/routes/paths.js`
- **사용법**: 라우트 추가 시 문자열 하드코딩 대신 상수 확장.

  - 루트 레이아웃은 `Root`
  - `users` 경로는 `PrivateRoute`로 보호

### B-3. `src/routes/PrivateRoute.jsx`
- **로직**:
  1. `userStore.isLogin` false면 `/login` 이동
  3. 둘 다 통과하면 자식 렌더링
  - 보호할 route element를 `<PrivateRoute>...</PrivateRoute>`로 감싸면 됨.
- **리뷰**:
  - 의도가 명확.
  - `console.log`는 배포 전 제거 권장.
### C-1. `src/layouts/Root.jsx`
- **역할**: 공통 쉘(UI 프레임)
- **핵심 로직**:
  - `modalStore.isOpen`, `confirmStore.isOpen`을 기준으로 `CSSTransition` 제어
- **리뷰**:
  - 전역 오버레이 관리 지점이 단일화되어 유지보수에 유리.


### D-1. `src/store/StoreProvider.jsx`
- **역할**: store DI(Dependency Injection) 컨테이너.
- **제공 store**: `modalStore`, `confirmStore`, `toastStore`, `formTableStore`
  - 생성자에서 `localStorage.user` 복구 (새로고침 대응)
  - `login()`/`logout()`으로 상태 + localStorage 동기화
- **사용법**:
  - 로그인 성공 시 `userStore.login(user)`
- **리뷰**:
  - 최소 인증 흐름으로 합리적.

- **역할**: 전역 모달 상태 머신.
- **핵심 로직**:
  - Confirm: `open()`이 Promise를 반환하고 confirm/cancel 결과를 resolve
- **사용법(패턴)**:
  - `payload` 기반으로 콘텐츠 컴포넌트와 props를 주입해 재사용성 확보.
  - 파일명 오타(`Store` 오타)는 가독성/검색성을 떨어뜨려 정리 권장.

### D-4. `src/store/toast/toastStore.js`
- **역할**: 전역 토스트 알림.
  - `show(message, duration)` 호출 시 기존 타이머 정리 후 재설정
  - 자동 hide 처리
- **리뷰**: 안전한 타이머 처리 방식.

- **리뷰**:
  - 방어적 필드 체크가 있어 의도치 않은 key 주입을 막음.

## E. API/통신 영역
### E-1. `src/api/axios.js`
- **역할**: 공통 Axios 인스턴스.
- **핵심 로직**:
  - 요청 인터셉터: `userStore.user?.token`을 Authorization 헤더에 부착
  - 응답 인터셉터: 401 시 `logout()` 후 `/login` 강제 이동
  - 성공 응답은 `response.data`만 반환
  - 중앙집중형 인증 처리로 중복 감소.
  - `window.location.href` 리다이렉션은 명시적이지만 SPA 흐름 측면에서 Router 기반 처리로 개선 여지.

### E-2. `src/api/auth.api.js`, `src/api/users.api.js`, `src/api/index.js`
- **사용법**:
  - `import { loginApi, getUsersApi } from "@/api"`
- **리뷰**: 구조가 간결하고 확장 쉬움.

- **원래 의도 로직**:
  1. `loginApi` 호출
  3. 홈으로 이동
- **리뷰**:
### F-2. `src/pages/Components/Components.jsx`
- **역할**: 디자인 시스템/공용 컴포넌트의 데모 + 패턴 레퍼런스 페이지.
  - 드래그앤드롭 데이터 상태 관리
  - modal/confirm payload를 통한 오버레이 호출
- **사용법**:
  - 새로운 화면 구현 시 이 페이지의 패턴(테이블, 액션 버튼, 모달 트리거)을 복사해 시작하면 생산성이 높음.
- **리뷰**:
### G-1. `src/utils/searchParams.js`
- **역할**: 폼과 URLSearchParams 간 양방향 변환.
  - `string`
  - `boolean`
  - `createSearchParamsFromForm(...)`로 URL 업데이트
- **리뷰**:
### G-2. `src/constants/modal.js`
- **사용법**:
  - 화면에서 필요한 content component와 메시지/data를 전달해 표준화된 payload 생성.
- **리뷰**:
  - 모달 호출 시 중복 파라미터를 줄이는 좋은 패턴.

1. 새 페이지 생성 (`src/pages/...`)
3. 필요 시 API 함수(`src/api`) 추가
4. 페이지에서 store 사용(모달/토스트/폼)
6. 쿼리 동기화가 필요하면 `utils/searchParams` 적용


## 5) 코드 리뷰 요약 (핵심)

- Provider/Router/Store 계층 분리가 명확함
- 전역 오버레이(Modal/Confirm/Toast) 설계가 일관됨
- 데모 페이지가 실사용 레퍼런스로 유용함
### 보완 포인트
- `Login.jsx` 로그인 로직 주석 해제/정상화 필요
- `*Store.js` 파일명 오타 정리 권장
- `PrivateRoute.jsx` 디버그 로그 제거 권장
- 일부 import/에러 페이지 중복 의미 정리 권장

---

## 6) 빠른 참고 코드 패턴
### 6-1. Confirm 모달 사용
```jsx
const ok = await confirmStore.openByPayload(
  CONFIRM_PAYLOAD.DELETE_CONFIRM({
    component: DeleteConfirmContent,
    data: row,
    message: "정말 삭제하시겠습니까?",
  }),
);

if (ok) {
  // 삭제 API 호출
}
```

### 6-2. 일반 모달 사용
```jsx
modalStore.openByPayload(
  MODAL_PAYLOAD.REGISTER_MODAL({
    component: RegisterModalContent,
    data: { id: 1 },
  }),
);
```

### 6-3. 토스트 사용
```jsx
toastStore.show("저장되었습니다.");
```

---

## 7) 결론
현재 구조는 **관리자 어드민 보일러플레이트로서 확장성이 좋은 기반**입니다.
특히 전역 상태/모달/라우팅 설계가 일관적이라, 로그인 로직 정상화와 네이밍 정리만 진행하면 실무 사용성이 더 높아집니다.
