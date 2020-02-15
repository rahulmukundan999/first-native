import io from "socket.io-client";
import Constants from 'expo-constants';
import * as async from 'async';
import { AsyncStorage } from 'react-native';
// import crypto from 'crypto';
// let algorithm = 'aes-128-ecb';
// let password = '1234';
const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transports: ['websocket'],
};
export class websocket {
    constructor() {
        this.componentStatus = 'dev';
        this.details = {};
        this.connections = {};
        this.callbackMapper = {};
        this.initDetails();
    }
    // public componentStatus: any = 'active';
    static getInstance() {
        if (!websocket.instance) {
            websocket.instance = new websocket();
        }
        websocket.instance.initDetails();
        return websocket.instance;
    }
    async initDetails() {
        console.log('init');
        try {
            let details = await AsyncStorage.getItem('customer');
            if (details) {
                details = JSON.parse(details);
                this.details = {
                    versionNumber: Constants.systemVersion,
                    appBuildNumber: Constants.expoVersion,
                    deviceType: 'android',
                    language: "en",
                    manufacturer: Constants.deviceName,
                    deviceModel: Constants.deviceName,
                    osVersion: '28',
                    deviceId: Constants.deviceId,
                    "isDevComponent": true,
                    "isoCountryCode": "IN",
                    "customerId": details.customerId
                };
            }
            else {
                this.details = {
                    versionNumber: Constants.systemVersion,
                    appBuildNumber: Constants.expoVersion,
                    deviceType: 'android',
                    language: "en",
                    manufacturer: Constants.deviceName,
                    deviceModel: Constants.deviceName,
                    osVersion: '28',
                    deviceId: Constants.deviceId,
                    "isDevComponent": true,
                    "isoCountryCode": "IN",
                };
            }
        }
        catch (error) {
            alert(error);
        }
    }
    getSocketInfo(component, callback) {
        let reqid = Math.random().toString();
        if (this.connections['ds'] && this.connections['ds'].connected) {
            this.callbackMapper[reqid] = callback;
            // let data = this.encryptData({
            //     componentName: component,
            //     componentStatus: this.componentStatus
            // });
            this.connections['ds'].emit('req', {
                // hasSalt: true,
                reqid: reqid,
                "data": {
                    componentName: component,
                    componentStatus: this.componentStatus
                },
                "rpc": "servicedirectory.getComponent"
            });
        }
        else {
            this.connect('ds', 'http://yds.vimolive.com:3010');
            this.callbackMapper[reqid] = callback;
            // let data = this.encryptData({
            //     componentName: component,
            //     componentStatus: this.componentStatus
            // });
            this.connections['ds'].emit('req', {
                // hasSalt: true,
                reqid: reqid,
                "data": {
                    componentName: component,
                    componentStatus: this.componentStatus
                },
                "rpc": "servicedirectory.getComponent"
            });
        }
    }
    connect(comp, IP) {
        const socket = io(IP, connectionConfig);
        this.connections[comp] = socket;
        this.connections[comp].on('res', (response) => {
            console.log('fewfwe', response);
            // response.response = this.decryptData(response.response);
            if (this.callbackMapper[response.reqid]) {
                this.callbackMapper[response.reqid](response.response);
                delete this.callbackMapper[response.reqid];
            }
            else {
                console.log("not found");
            }
        });
        this.connections[comp].on('error', function (error) {
            console.log('scoket error', error);
        });
    }
    request(comp, data, callback) {
        // alert('vrgverg');
        let sharedData = {
            compInfo: undefined
        };
        let reqid = Math.random().toString();
        data['reqid'] = reqid;
        this.callbackMapper[reqid] = callback;
        async.waterfall([
            checkConnection.bind(this),
            getComponentInfo.bind(this),
            createConnection.bind(this)
        ], (error, response) => {
            // alert(JSON.stringify(error));
            console.log(comp);
            console.log(data);
            console.log('send request');
            this.sendRequest(data, comp);
        });
        function checkConnection(callback) {
            console.log('wegweg');
            if (this.connections[comp] && this.connections[comp].isConnected) {
                callback({
                    status: 200
                });
            }
            else {
                callback();
            }
        }
        function getComponentInfo(callback) {
            console.log('5235235wegweg');
            this.getSocketInfo(comp, function (response) {
                console.log(response);
                if (response.status == 200) {
                    sharedData.compInfo = response;
                    // alert(JSON.stringify(sharedData));
                    callback();
                }
                else {
                    callback({
                        status: 500,
                        msg: "network error"
                    });
                }
            });
        }
        function createConnection(callback) {
            // console.log('process', process.env.NODE_ENV);
            // console.log('temp', "http://" + temp.config.serverUrl + ":" + temp.config.port);
            // console.log('tempV2', "http://" + sharedData.compInfo.publicIp + ":" + sharedData.compInfo.nport);
            this.connect(comp, "http://" + sharedData.compInfo.publicIp + ":" + sharedData.compInfo.nport);
            callback();
        }
    }
    sendRequest(data, comp) {
        // data.hasSalt = true;
        // data.saltType = 'web';
        // data.data = this.encryptData(data.data)
        let temp = {
            rpc: data.rpc,
            reqid: data.reqid,
            data: {
                ...data.data,
                ...this.details
            }
        };
        console.log('tewtwet', temp);
        this.connections[comp].emit("req", temp);
    }
}
//# sourceMappingURL=websocket.js.map