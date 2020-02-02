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

    checkOrder(data, cb) {
        this.discovery.request("customeredge", {
            rpc: "customeredge.checkOrder",
            data: data
        }, function (res) {
            cb(res);
        });

    }

    checkOut(data, cb) {
        this.discovery.request("customeredge", {
            rpc: "customeredge.checkOut",
            data: data
        }, function (res) {
            cb(res);
        });

    }
}