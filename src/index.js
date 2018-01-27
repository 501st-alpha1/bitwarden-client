import 'babel-polyfill'
import * as cryptoservice from '../jslib/dist/es/services/crypto.service'

class BitwardenClient{
    static request(method, url, params){
        return new Promise((resolve, reject)=>{
            url = this.settings.identityBaseUrl + url

            const _request = new Request(url, {
                ...this.options,
                method
            })
            fetch(_request, {
                body: JSON.stringify(params)
            }).then((response)=>{
                resolve(response)
            })
        })
    }

    static get(url){
        return this.request('GET', url)
    }
    static put(url, params){
        return this.request('PUT', url, params)
    }
    static post(url, params){
        return this.request('POST', url, params)
    }
    static delete(url){
        return this.request('DELETE', url)
    }

    static login(email, password){
        // Login to your Bitwarden Account
    }

    static signup(email, password, passwordConfirmation){
        // Sign up for a Bitwarden Account
    }

    static logout(){
        // Log Out of your Bitwarden Account
    }

    static getPassword(id){
        // Get a password within Bitwarden
    }

    static setPassword(id, value){
        // Set a password within Bitwarden
    }

    static passwordReset(email){
        // Reset your master Bitwarden password
    }
}
BitwardenClient.settings = {
    baseUrl: 'https://api.bitwarden.com',
    identityBaseUrl: 'https://identity.bitwarden.com'
}
BitwardenClient.options = {
    cache: 'no-cache',
    headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Accept': 'application/json',
        'Device-Type': 'web',
    })
}

window.cryptoservices = cryptoservice
window.BitwardenClient = BitwardenClient
