/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServerEvent } from '../models/ServerEvent';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class EventsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @returns ServerEvent A stream of events from turntable
     * @throws ApiError
     */
    public eventStream(): CancelablePromise<ServerEvent> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/events',
        });
    }
}
