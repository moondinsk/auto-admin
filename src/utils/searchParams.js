// 검색 파라미터에서 사용할 타입 상수 정의
const SEARCH_PARAM_TYPE = {
  STRING: "string",
  BOOLEAN: "boolean",
  ARRAY: "array",
};

// fields 설정을 표준 형태로 정규화
// 문자열로 들어오면 기본 옵션을 적용하고,
// 객체로 들어오면 기본값과 병합
const normalizeField = (field) => {
  if (typeof field === "string") {
    return {
      key: field,
      type: SEARCH_PARAM_TYPE.STRING,
      separator: ",",
    };
  }

  return {
    type: SEARCH_PARAM_TYPE.STRING,
    separator: ",",
    ...field,
  };
};

// URLSearchParams → Form 객체로 변환
// 정의된 fields 기준으로 타입에 맞게 파싱
export const parseSearchParamsToForm = ({
  searchParams,
  initialForm = {},
  fields = [],
}) => {
  const parsedForm = { ...initialForm };

  fields.map(normalizeField).forEach(({ key, type, separator }) => {
    const rawValue = searchParams.get(key);
    if (rawValue === null) return;

    // boolean 타입 처리
    if (type === SEARCH_PARAM_TYPE.BOOLEAN) {
      parsedForm[key] =
        rawValue === "true"
          ? true
          : rawValue === "false"
          ? false
          : initialForm[key] ?? "";
      return;
    }

    // array 타입 처리 (구분자로 split)
    if (type === SEARCH_PARAM_TYPE.ARRAY) {
      parsedForm[key] = rawValue.split(separator).filter(Boolean);
      return;
    }

    // 기본 string 처리
    parsedForm[key] = rawValue;
  });

  return parsedForm;
};

// Form 객체 → URLSearchParams 생성
// 타입에 맞게 직렬화하여 쿼리스트링 생성
export const createSearchParamsFromForm = ({
  form,
  fields = [],
}) => {
  const params = new URLSearchParams();

  fields.map(normalizeField).forEach(({ key, type, separator }) => {
    const value = form[key];

    // boolean 타입 처리 (값이 존재할 때만 추가)
    if (type === SEARCH_PARAM_TYPE.BOOLEAN) {
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
      return;
    }

    // array 타입 처리 (비어있지 않을 때만 join)
    if (type === SEARCH_PARAM_TYPE.ARRAY) {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(separator));
      }
      return;
    }

    // 기본 string 처리 (falsy 값 제외)
    if (value) {
      params.set(key, value);
    }
  });

  return params;
};

// 타입 상수 외부 노출
export { SEARCH_PARAM_TYPE };