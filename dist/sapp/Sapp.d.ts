import { ServTerminal, ServTerminalConfig } from '../terminal/ServTerminal';
import { ServServiceServerConfig } from '../service/ServServiceServer';
import { ServServiceClientConfig, ServServiceClient } from '../service/ServServiceClient';
import { ServSessionConfig } from '../session/ServSession';
import { SappShowParams, SappHideParams, SappCloseResult, SappAuthParams } from './service/m/SappLifecycle';
import { SappInfo, SappMGR } from './SappMGR';
import { Deferred } from '../common/Deferred';
import { AsyncMutex } from '../common/AsyncMutex';
import { SappController } from './SappController';
export interface SappStartParams {
}
export interface SappConfig {
    hideOnStart?: boolean;
    beforeStart?(app: Sapp): Promise<void>;
    resolveStartData?(app: Sapp): Promise<any> | any;
    resolveStartShowData?(app: Sapp): Promise<any> | any;
    resolveServiceServerConfig?(app: Sapp): Promise<ServServiceServerConfig> | ServServiceServerConfig;
    resolveServiceClientConfig?(app: Sapp): Promise<ServServiceClientConfig> | ServServiceClientConfig;
    resolveSessionConfig?(sdk: Sapp): Promise<ServSessionConfig> | ServSessionConfig;
    resolveTerminalConfig?(sdk: Sapp, config: ServTerminalConfig): Promise<ServTerminalConfig> | ServTerminalConfig | void;
    afterStart?(sdk: Sapp): Promise<void>;
}
export interface SappStartOptions {
    data?: any | SappConfig['resolveStartData'];
}
export declare class Sapp {
    uuid: string;
    info: SappInfo;
    isStarted: boolean;
    started: Deferred;
    showDone?: Deferred<any>;
    isClosed: boolean;
    closed: Deferred<any>;
    terminal: ServTerminal;
    protected controller?: SappController;
    protected config: SappConfig;
    protected waitOnStart?: Deferred;
    protected waitOnAuth?: Deferred;
    protected mutex: AsyncMutex;
    protected showHideMutex: AsyncMutex;
    protected manager: SappMGR;
    constructor(uuid: string, info: SappInfo, manager: SappMGR);
    attachController(controller: SappController): boolean;
    detachController(): void;
    getController(): SappController | undefined;
    setConfig(config: SappConfig): this;
    getConfig(): SappConfig;
    start: ((options?: SappStartOptions | undefined) => Promise<void>) & {
        deferred: Deferred<void> | undefined;
    };
    show(params?: SappShowParams): Promise<void>;
    hide(params?: SappHideParams): Promise<void>;
    protected _show: ((params?: SappShowParams | undefined, byCreate?: boolean | undefined) => Promise<void>) & {
        deferred: Deferred<void> | undefined;
    };
    protected _hide: ((params?: SappHideParams | undefined, byClose?: boolean | undefined) => Promise<void>) & {
        deferred: Deferred<void> | undefined;
    };
    close: ((result?: SappCloseResult | undefined) => Promise<void>) & {
        deferred: Deferred<void> | undefined;
    };
    getService: ServServiceClient['getService'];
    getServiceUnsafe: ServServiceClient['getServiceUnsafe'];
    service: ServServiceClient['service'];
    serviceExec: ServServiceClient['serviceExec'];
    protected auth(params: SappAuthParams): Promise<void>;
    protected beforeStart(options: SappStartOptions): Promise<void>;
    protected afterStart(): Promise<void>;
    protected onStartFailed(): void;
    protected resolveStartData(options: SappStartOptions): Promise<any>;
    protected beforeInitTerminal(): Promise<void>;
    protected initTerminal(options: SappStartOptions): Promise<void>;
    protected afterInitTerminal(): Promise<void>;
}