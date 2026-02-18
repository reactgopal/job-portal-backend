class ApiResponse {
  constructor(statusCode, message = 'Success', data = null, pagination = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (pagination) this.pagination = pagination;
  }
}

module.exports = ApiResponse;
