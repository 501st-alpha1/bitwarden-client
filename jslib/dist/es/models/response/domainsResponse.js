import { GlobalDomainResponse } from './globalDomainResponse';
class DomainsResponse {
    constructor(response) {
        this.globalEquivalentDomains = [];
        this.equivalentDomains = response.EquivalentDomains;
        this.globalEquivalentDomains = [];
        if (response.GlobalEquivalentDomains) {
            response.GlobalEquivalentDomains.forEach((domain) => {
                this.globalEquivalentDomains.push(new GlobalDomainResponse(domain));
            });
        }
    }
}
export { DomainsResponse };
window.DomainsResponse = DomainsResponse;
//# sourceMappingURL=domainsResponse.js.map