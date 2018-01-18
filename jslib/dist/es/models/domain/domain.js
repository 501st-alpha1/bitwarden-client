var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CipherString } from '../domain/cipherString';
export default class Domain {
    buildDomainModel(model, obj, map, alreadyEncrypted, notEncList = []) {
        for (const prop in map) {
            if (!map.hasOwnProperty(prop)) {
                continue;
            }
            const objProp = obj[(map[prop] || prop)];
            if (alreadyEncrypted === true || notEncList.indexOf(prop) > -1) {
                model[prop] = objProp ? objProp : null;
            }
            else {
                model[prop] = objProp ? new CipherString(objProp) : null;
            }
        }
    }
    decryptObj(model, map, orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            const self = this;
            for (const prop in map) {
                if (!map.hasOwnProperty(prop)) {
                    continue;
                }
                // tslint:disable-next-line
                (function (theProp) {
                    const p = Promise.resolve().then(() => {
                        const mapProp = map[theProp] || theProp;
                        if (self[mapProp]) {
                            return self[mapProp].decrypt(orgId);
                        }
                        return null;
                    }).then((val) => {
                        model[theProp] = val;
                    });
                    promises.push(p);
                })(prop);
            }
            yield Promise.all(promises);
            return model;
        });
    }
}
//# sourceMappingURL=domain.js.map