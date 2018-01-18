import { LoginData } from '../data/loginData';
import { CipherString } from './cipherString';
import Domain from './domain';
declare class Login extends Domain {
    uri: CipherString;
    username: CipherString;
    password: CipherString;
    totp: CipherString;
    constructor(obj?: LoginData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): Promise<any>;
}
export { Login };
