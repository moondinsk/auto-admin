/**
 * 규칙 기반 폼 검증기 생성
 * @param {Array} rules - 검증 규칙 배열
 * @returns {Function} 검증을 수행하는 함수
 *
 * @example
 * const validator = createValidator([
 *   {
 *     validate: (data) => ({ valid: !!data.name?.trim() }),
 *     message: "이름은 필수입니다.",
 *   },
 *   {
 *     validate: (data) => ({ valid: !!data.email }),
 *     message: "이메일은 필수입니다.",
 *   },
 * ]);
 *
 * const result = validator(formData);
 * if (!result.valid) {
 *   console.log(result.message);
 * }
 */
export const createValidator = (rules) => {
  return (data) => {
    for (const rule of rules) {
      const result = rule.validate(data);
      if (!result.valid) {
        return { valid: false, message: rule.message };
      }
    }
    return { valid: true, message: "" };
  };
};

/**
 * 폼 데이터를 검증하고 실패 시 toast 표시
 * @param {Object} data - 검증할 폼 데이터
 * @param {Function} validator - createValidator로 생성한 검증 함수
 * @param {Function} setToast - toast 표시 함수
 * @returns {boolean} 검증 성공 여부
 * @throws {Error} 검증 실패 시 에러 발생
 */
export const validateWithToast = (data, validator, setToast) => {
  const result = validator(data);
  if (!result.valid) {
    setToast("error", result.message);
    throw new Error(result.message);
  }
  return true;
};
