import Domain from './domain';
class Card extends Domain {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            cardholderName: null,
            brand: null,
            number: null,
            expMonth: null,
            expYear: null,
            code: null,
        }, alreadyEncrypted, []);
    }
    decrypt(orgId) {
        return this.decryptObj({}, {
            cardholderName: null,
            brand: null,
            number: null,
            expMonth: null,
            expYear: null,
            code: null,
        }, orgId);
    }
}
export { Card };
window.Card = Card;
//# sourceMappingURL=card.js.map