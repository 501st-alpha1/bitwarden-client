import { DeviceType } from '../../enums/deviceType';
declare class DeviceResponse {
    id: string;
    name: number;
    identifier: string;
    type: DeviceType;
    creationDate: string;
    constructor(response: any);
}
export { DeviceResponse };
