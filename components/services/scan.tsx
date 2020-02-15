import { websocket } from './websocket';
export class ScanService {

    private discovery: any = websocket.getInstance();
    constructor() {
    }

    // scanTable(data) {
    //     return this.websocket.send({
    //         rpc: 'customeredge.scanTable',
    //         data: data
    //     })
    // }
    scanTable(data, cb) {
        this.discovery.request("customeredge", {
            rpc: "customeredge.scanTable",
            data: data
        }, function (res) {
            console.log('fewfwe', res);
            cb(res);
        });
    }
}