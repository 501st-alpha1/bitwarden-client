class AttachmentResponse {
    constructor(response) {
        this.id = response.Id;
        this.url = response.Url;
        this.fileName = response.FileName;
        this.size = response.Size;
        this.sizeName = response.SizeName;
    }
}
export { AttachmentResponse };
window.AttachmentResponse = AttachmentResponse;
//# sourceMappingURL=attachmentResponse.js.map