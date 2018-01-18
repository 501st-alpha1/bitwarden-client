import { CollectionResponse } from '../response/collectionResponse';
declare class CollectionData {
    id: string;
    organizationId: string;
    name: string;
    constructor(response: CollectionResponse);
}
export { CollectionData };
