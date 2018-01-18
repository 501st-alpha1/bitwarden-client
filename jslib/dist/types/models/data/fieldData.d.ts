import { FieldType } from '../../enums/fieldType';
declare class FieldData {
    type: FieldType;
    name: string;
    value: string;
    constructor(response: any);
}
export { FieldData };
