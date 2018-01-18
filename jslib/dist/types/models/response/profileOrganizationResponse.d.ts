declare class ProfileOrganizationResponse {
    id: string;
    name: string;
    useGroups: boolean;
    useDirectory: boolean;
    useTotp: boolean;
    seats: number;
    maxCollections: number;
    maxStorageGb?: number;
    key: string;
    status: number;
    type: number;
    constructor(response: any);
}
export { ProfileOrganizationResponse };
