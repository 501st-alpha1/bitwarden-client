import { FolderResponse } from '../response/folderResponse';
declare class FolderData {
    id: string;
    userId: string;
    name: string;
    revisionDate: string;
    constructor(response: FolderResponse, userId: string);
}
export { FolderData };
