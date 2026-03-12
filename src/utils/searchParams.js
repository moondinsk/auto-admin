// searchParams.js
const SEARCH_PARAM_TYPE = {
  STRING: "string",
  BOOLEAN: "boolean",
  ARRAY: "array",
};

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

const parseSearchParamsToForm = ({ searchParams, initialForm = {}, fields = [] }) => {
  const parsedForm = { ...initialForm };

  fields.map(normalizeField).forEach(({ key, type, separator }) => {
    const rawValue = searchParams.get(key);
    if (rawValue === null) return;

    if (type === SEARCH_PARAM_TYPE.BOOLEAN) {
      parsedForm[key] = rawValue === "true" ? true : rawValue === "false" ? false : (initialForm[key] ?? "");
      return;
    }

    if (type === SEARCH_PARAM_TYPE.ARRAY) {
      parsedForm[key] = rawValue.split(separator).filter(Boolean);
      return;
    }

    parsedForm[key] = rawValue;
  });

  return parsedForm;
};

const createSearchParamsFromForm = ({ form, fields = [] }) => {
  const params = new URLSearchParams();

  fields.map(normalizeField).forEach(({ key, type, separator }) => {
    const value = form[key];

    if (type === SEARCH_PARAM_TYPE.BOOLEAN) {
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
      return;
    }

    if (type === SEARCH_PARAM_TYPE.ARRAY) {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(separator));
      }
      return;
    }

    if (value !== "" && value !== null && value !== undefined) {
      params.set(key, String(value));
    }
  });

  return params;
};

// searchParams.js
export { SEARCH_PARAM_TYPE, parseSearchParamsToForm, createSearchParamsFromForm };
