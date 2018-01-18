import { UtilsService as UtilsServiceAbstraction } from '../abstractions/utils.service';
export declare class UtilsService implements UtilsServiceAbstraction {
    static copyToClipboard(text: string, doc?: Document): void;
    static urlBase64Decode(str: string): string;
    static newGuid(): string;
    static secureRandomNumber(min: number, max: number): number;
    static fromB64ToArray(str: string): Uint8Array;
    static fromUtf8ToArray(str: string): Uint8Array;
    static fromBufferToB64(buffer: ArrayBuffer): string;
    static fromBufferToUtf8(buffer: ArrayBuffer): string;
    static getHostname(uriString: string): string;
    getHostname(uriString: string): string;
    copyToClipboard(text: string, doc?: Document): void;
}
