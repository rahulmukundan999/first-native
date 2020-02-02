import { websocket } from './websocket';

export class CheckoutService {


    private discovery: any = websocket.getInstance();
    constructor() {
    }


    checkOut(data, cb) {
        this.discovery.request("customeredge", {
            rpc: "customeredge.makePayment",
            data: data
        }, function (res) {
            cb(res);
        });

    }
}