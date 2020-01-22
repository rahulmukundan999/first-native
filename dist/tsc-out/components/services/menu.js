import { websocket } from './websocket';
export class MenuService {
    constructor() {
        this.discovery = websocket.getInstance();
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
}
//# sourceMappingURL=menu.js.map