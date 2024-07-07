/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AuthService } from './services/AuthService';
import { EventsService } from './services/EventsService';
import { RoomsService } from './services/RoomsService';
import { StreamingService } from './services/StreamingService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class TurntableApi {
    public readonly auth: AuthService;
    public readonly events: EventsService;
    public readonly rooms: RoomsService;
    public readonly streaming: StreamingService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '0.1.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.auth = new AuthService(this.request);
        this.events = new EventsService(this.request);
        this.rooms = new RoomsService(this.request);
        this.streaming = new StreamingService(this.request);
    }
}

