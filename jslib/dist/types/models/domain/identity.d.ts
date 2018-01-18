import { IdentityData } from '../data/identityData';
import { CipherString } from './cipherString';
import Domain from './domain';
declare class Identity extends Domain {
    title: CipherString;
    firstName: CipherString;
    middleName: CipherString;
    lastName: CipherString;
    address1: CipherString;
    address2: CipherString;
    address3: CipherString;
    city: CipherString;
    state: CipherString;
    postalCode: CipherString;
    country: CipherString;
    company: CipherString;
    email: CipherString;
    phone: CipherString;
    ssn: CipherString;
    username: CipherString;
    passportNumber: CipherString;
    licenseNumber: CipherString;
    constructor(obj?: IdentityData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): Promise<any>;
}
export { Identity };
