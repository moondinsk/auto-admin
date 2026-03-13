export const toggleAllCheck = (rows, checkedIds) => {
  const allChecked = rows.length > 0 && rows.every((row) => checkedIds.includes(row.id));

  return allChecked ? [] : rows.map((row) => row.id);
};

// 오늘 기준으로 n일 전 ~ 오늘까지의 날짜 범위를 반환
export const getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
};

// 오늘 날짜를 yyyy-mm-dd 형식으로 반환
export const getToday = () => new Date().toISOString().split("T")[0];
