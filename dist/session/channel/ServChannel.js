"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServChannel = exports.EServChannel = void 0;
var common_1 = require("../../common/common");
var ServTerminal_1 = require("../../terminal/ServTerminal");
var EServChannel;
(function (EServChannel) {
    EServChannel[EServChannel["WINDOW"] = 1] = "WINDOW";
    EServChannel[EServChannel["MESSAGE"] = 2] = "MESSAGE";
    EServChannel[EServChannel["EVENT"] = 3] = "EVENT";
    EServChannel[EServChannel["EVENT_LOADER"] = 4] = "EVENT_LOADER";
})(EServChannel = exports.EServChannel || (exports.EServChannel = {}));
var ServChannel = /** @class */ (function () {
    function ServChannel() {
    }
    ServChannel.prototype.init = function (session, config) {
        this.session = session;
        this.config = config || {};
        var sessionMark = "$$" + session.getID() + "$$";
        if (this.config.ignoreSenderType) {
            this.sendMark = '';
            this.recvMark = '';
        }
        else {
            if (session.isMaster()) {
                this.sendMark = "$$" + ServTerminal_1.EServTerminal.MASTER + "$$";
                this.recvMark = "$$" + ServTerminal_1.EServTerminal.SLAVE + "$$";
            }
            else {
                this.sendMark = "$$" + ServTerminal_1.EServTerminal.SLAVE + "$$";
                this.recvMark = "$$" + ServTerminal_1.EServTerminal.MASTER + "$$";
            }
        }
        this.sendStringMark = sessionMark + this.sendMark;
        this.recvStringMark = sessionMark + this.recvMark;
        this.recvable = false;
        this.sendable = false;
    };
    ServChannel.prototype.release = function () {
        this.close();
        this.session = undefined;
        this.config = undefined;
        this.recvable = false;
        this.sendable = false;
    };
    ServChannel.prototype.isRecvable = function () {
        return this.recvable;
    };
    ServChannel.prototype.isSendable = function () {
        return this.sendable;
    };
    ServChannel.prototype.isOpened = function () {
        return this.recvable && this.sendable;
    };
    ServChannel.prototype.send = function (msg) {
        if (!this.sendable) {
            return false;
        }
        var chnMsg = this.toObjectPackage(msg);
        if (!chnMsg) {
            return false;
        }
        try {
            // Try send object message
            if (this.sendChannelPackage(chnMsg)) {
                return true;
            }
        }
        catch (e) {
            common_1.asyncThrow(e);
        }
        // Try send string message
        chnMsg = this.toStringPackage(msg);
        if (chnMsg) {
            try {
                if (this.sendChannelPackage(chnMsg)) {
                    return true;
                }
            }
            catch (e) {
                common_1.asyncThrow(e);
            }
        }
        return false;
    };
    ServChannel.prototype.toObjectPackage = function (data) {
        return {
            __mark__: this.sendStringMark,
            data: data,
        };
    };
    ServChannel.prototype.toStringPackage = function (data) {
        try {
            var rawData = JSON.stringify(data);
            return this.sendStringMark + rawData;
        }
        catch (e) {
            return '';
        }
    };
    ServChannel.prototype.frObjectPackage = function (data) {
        if (data.__mark__ !== this.recvStringMark) {
            return;
        }
        return data.data;
    };
    ServChannel.prototype.frStringPackage = function (data) {
        if (!data.startsWith(this.recvStringMark)) {
            return;
        }
        data = data.substr(this.recvStringMark.length);
        return data ? JSON.parse(data) : data;
    };
    ServChannel.prototype.frChannelPackage = function (rawData) {
        try {
            if (rawData === undefined || rawData === null) {
                return;
            }
            var type = typeof rawData;
            if (type === 'object') {
                return this.frObjectPackage(rawData);
            }
            else if (type === 'string') {
                return this.frStringPackage(rawData);
            }
        }
        catch (e) {
            common_1.asyncThrow(e);
        }
    };
    ServChannel.prototype.canRecvChannelPackage = function (msg) {
        return true;
    };
    ServChannel.prototype.recvChannelPackage = function (msg) {
        if (!this.recvable) {
            return;
        }
        if (!this.canRecvChannelPackage(msg)) {
            return;
        }
        var data = this.frChannelPackage(msg);
        if (data === undefined) {
            return;
        }
        this.session.recvPackage(data);
    };
    return ServChannel;
}());
exports.ServChannel = ServChannel;
//# sourceMappingURL=ServChannel.js.map