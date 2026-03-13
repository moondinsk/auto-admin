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
