import { websocket } from './websocket';

export class LoginService {


    private discovery: any = websocket.getInstance();
    constructor() {
    }

    // scanTable(data) {
    //     return this.websocket.send({
    //         rpc: 'customeredge.scanTable',
    //         data: data
    //     })
    // }
    getDetails(data, cb) {
        this.discovery.request("customeredge", {
            rpc: "registration.getDetails",
            data: data
        }, function (res) {
            console.log('fewfwe', res);
            cb(res);
        });
    }

    updateDeviceToken(data, cb) {
        this.discovery.request("customeredge", {
            rpc: "registration.updateDeviceToken",
            data: data
        }, function (res) {
            console.log('fewfwe', res);
            cb(res);
        });
    }

    // private websocket: websocket = new websocket();
    // constructor() {
    // }

    // getDetails(data) {
    //     return this.websocket.send({
    //         rpc: 'registration.getDetails',
    //         data: data
    //     })
    // }
}