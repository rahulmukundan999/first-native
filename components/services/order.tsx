import { websocket } from './websocket';

export class OrderService {


    private discovery: any = websocket.getInstance();
    constructor() {
    }

    fetchOrders(data, cb) {
        this.discovery.request("customeredge", {
            rpc: "customeredge.openOrders",
            data: data
        }, function (res) {
            cb(res);
        });
    }

    fetchOrderHistory(data, cb) {
        this.discovery.request("customeredge", {
            rpc: "customeredge.orderHistory",
            data: data
        }, function (res) {
            cb(res);
        });

    }
}