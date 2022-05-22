function getPagination(page, size) {
    const limit = size ? +size : 100;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: result } = data;
    const currentPage = page ? page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, data:result, totalPages, currentPage:parseInt(currentPage) };
};

module.exports = {
    getPagination: getPagination,
    getPagingData: getPagingData
}