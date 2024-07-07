/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class StreamingService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param token
     * @returns any A live audio stream
     * @throws ApiError
     */
    public streamAudio(
        token: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/streams/{token}',
            path: {
                'token': token,
            },
        });
    }
}
