/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class StreamingService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Gets a live audio stream using a stream token.
     * @param token Stream token of a room
     * @param latency Controls the desired latency of the stream, where higher values means more latency. This is clamped to the pipeline's preload cache size.
     * @returns any A live audio stream
     * @throws ApiError
     */
    public streamAudio(
        token: string,
        latency?: number | null,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/streams/{token}',
            path: {
                'token': token,
            },
            query: {
                'latency': latency,
            },
        });
    }
}
