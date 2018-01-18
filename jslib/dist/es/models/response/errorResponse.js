class ErrorResponse {
    constructor(response, status, identityResponse) {
        let errorModel = null;
        if (identityResponse && response && response.ErrorModel) {
            errorModel = response.ErrorModel;
        }
        else if (response) {
            errorModel = response;
        }
        if (errorModel) {
            this.message = errorModel.Message;
            this.validationErrors = errorModel.ValidationErrors;
        }
        this.statusCode = status;
    }
    getSingleMessage() {
        if (this.validationErrors) {
            for (const key in this.validationErrors) {
                if (!this.validationErrors.hasOwnProperty(key)) {
                    continue;
                }
                if (this.validationErrors[key].length) {
                    return this.validationErrors[key][0];
                }
            }
        }
        return this.message;
    }
}
export { ErrorResponse };
window.ErrorResponse = ErrorResponse;
//# sourceMappingURL=errorResponse.js.map