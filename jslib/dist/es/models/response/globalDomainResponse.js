class GlobalDomainResponse {
    constructor(response) {
        this.type = response.Type;
        this.domains = response.Domains;
        this.excluded = response.Excluded;
    }
}
export { GlobalDomainResponse };
window.GlobalDomainResponse = GlobalDomainResponse;
//# sourceMappingURL=globalDomainResponse.js.map