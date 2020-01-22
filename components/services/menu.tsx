import { websocket } from './websocket';

export class MenuService {
    private discovery: any = websocket.getInstance();

    constructor() {
    }

    fetchMenu(data, cb) {
        // return this.websocket.send({
        //     rpc: 'customeredge.fetchMenu',
        //     data: data
        // })

        this.discovery.request("customeredge", {
            rpc: "customeredge.fetchMenu",
            data: data
        }, function (res) {
            console.log('fewfwe', res);
            cb(res);
        });
    }

    cancelOrder(data, cb) {
        this.discovery.request("customeredge", {
            rpc: "customeredge.cancelOrder",
            data: data
        }, function (res) {
            console.log('fewfwe', res);
            cb(res);
        });
    }
}