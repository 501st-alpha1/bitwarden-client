export default abstract class Domain {
    protected buildDomainModel(model: any, obj: any, map: any, alreadyEncrypted: boolean, notEncList?: any[]): void;
    protected decryptObj(model: any, map: any, orgId: string): Promise<any>;
}
