import { GlobalDomainResponse } from './globalDomainResponse';
declare class DomainsResponse {
    equivalentDomains: string[][];
    globalEquivalentDomains: GlobalDomainResponse[];
    constructor(response: any);
}
export { DomainsResponse };
