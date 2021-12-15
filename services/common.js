module.exports = {
  codeList: { SUCCESS: 200, RECORD_CREATED: 201, BAD_REQUEST: 400, AUTH_ERROR: 401, FORBIDDEN: 403, NOT_FOUND: 404, INVALID_REQUEST: 405, BLOCKED_CONTENT: 410, RECORD_ALREADY_EXISTS: 409, SERVER_ERROR: 500 },
  sendCustomResult: (req, res, status_code, message, data) => {
    var result = {
      status: {
        code: module.exports.codeList[status_code],
        message: message
      }
    };
    if (typeof data !== 'undefined') {
      result.data = data;
    } else {
      result.data = {};
    }
    return res.json(result);
  },
  paginateData: (data) => {
    var result = {
      records: data.docs,
      page: data.page,
      total_pages: data.totalPages,
      page_records: (data.docs).length,
      total_records: data.totalDocs,
    }
    return result;
  }
}