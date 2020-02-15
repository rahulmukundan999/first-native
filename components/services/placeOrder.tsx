import { websocket } from './websocket';

export class PlaceOrder {


    private discovery: any = websocket.getInstance();
    constructor() {
    }


    createOrder(data, cb) {
        this.discovery.request("customeredge", {
            rpc: "customeredge.createOrder",
            data: data
        }, function (res) {
            cb(res);
        });

    }
}