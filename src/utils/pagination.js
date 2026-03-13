export const createPaginationHandlers = (updateParams) => {
  const handleLimitChange = (option) => {
    updateParams({ page: 1, limit: option.value });
  };

  const handlePageChange = (page) => {
    updateParams({ page });
  };

  return { handleLimitChange, handlePageChange };
};
