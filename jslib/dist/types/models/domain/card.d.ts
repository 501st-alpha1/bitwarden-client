import { CardData } from '../data/cardData';
import { CipherString } from './cipherString';
import Domain from './domain';
declare class Card extends Domain {
    cardholderName: CipherString;
    brand: CipherString;
    number: CipherString;
    expMonth: CipherString;
    expYear: CipherString;
    code: CipherString;
    constructor(obj?: CardData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): Promise<any>;
}
export { Card };
