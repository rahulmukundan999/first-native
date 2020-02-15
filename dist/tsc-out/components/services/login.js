import { websocket } from './websocket';
export class LoginService {
    constructor() {
        this.discovery = websocket.getInstance();
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
}
//# sourceMappingURL=login.js.map