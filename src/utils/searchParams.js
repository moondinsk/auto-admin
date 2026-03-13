export const SEARCH_PARAM_TYPE = {
  STRING: "string",
  BOOLEAN: "boolean",
  ARRAY: "array",
};

export const getKeywordLabel = (value, labelMap) => {
  return labelMap?.[value] ?? value;
};

// formData 객체
// 빈 값 제거 / 필요한 값만 필터
// setSearchParams() 에 넣을 query object 반환
export const buildSearchParams = (params) => {
  const result = {};

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length) result[key] = value.join(",");
      return;
    }

    if (value !== "" && value !== null && value !== undefined) {
      result[key] = value;
    }
  });

  return result;
};

// URL query(searchParams)를 formData 형태로 변환
// ?page=1&limit=10&bannerGroupName=메인배너
//  formData
//  {
//    bannerGroupName: "메인배너",
//    bannerGroupDesc: "",
//    searchKeyword: ""
//  }

export const parseSearchParams = (searchParams) => {
  const params = Object.fromEntries(searchParams);

  Object.keys(params).forEach((key) => {
    if (typeof params[key] === "string" && params[key].includes(",")) {
      params[key] = params[key].split(",");
    }
  });

  return params;
};

// formData 업데이트 함수
export const updateFormData = (name, value, type, checked) => {
  if (type === "checkbox") {
    return (prev) => {
      const list = prev[name] || [];

      return {
        ...prev,
        [name]: checked ? [...list, value] : list.filter((v) => v !== value),
      };
    };
  }

  return (prev) => ({
    ...prev,
    [name]: value,
  });
};

// formData의 특정 필드 업데이트 함수
export const setFormField = (name, value) => {
  return (prev) => ({
    ...prev,
    [name]: value,
  });
};

// URLSearchParams는 set() 메서드로 기존 키의 값을 업데이트할 수 있지만, 객체 형태로 업데이트할 필드를 받아서 새로운 URLSearchParams 객체를 반환하는 함수
export const updateSearchParams = (searchParams, updates) => {
  const next = new URLSearchParams(searchParams);

  Object.entries(updates).forEach(([k, v]) => {
    next.set(k, v);
  });

  return next;
};
