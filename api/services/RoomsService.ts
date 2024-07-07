/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InputSchema } from '../models/InputSchema';
import type { JoinWithInviteSchema } from '../models/JoinWithInviteSchema';
import type { NewRoomSchema } from '../models/NewRoomSchema';
import type { NewStreamKeySchema } from '../models/NewStreamKeySchema';
import type { Queue } from '../models/Queue';
import type { Room } from '../models/Room';
import type { RoomActionSchema } from '../models/RoomActionSchema';
import type { RoomInvite } from '../models/RoomInvite';
import type { StreamKey } from '../models/StreamKey';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class RoomsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @returns Room
     * @throws ApiError
     */
    public listRooms(): CancelablePromise<Array<Room>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/rooms',
        });
    }
    /**
     * @param requestBody
     * @returns Room
     * @throws ApiError
     */
    public createRoom(
        requestBody: NewRoomSchema,
    ): CancelablePromise<Room> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/rooms',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param token
     * @returns RoomInvite
     * @throws ApiError
     */
    public inviteByToken(
        token: string,
    ): CancelablePromise<RoomInvite> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/rooms/invites/{token}',
            path: {
                'token': token,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any User was added as member to room, and invite is consumed.
     * @throws ApiError
     */
    public joinWithInvite(
        requestBody: JoinWithInviteSchema,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/rooms/members',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Action was performed.
     * @throws ApiError
     */
    public performRoomAction(
        id: number,
        requestBody: RoomActionSchema,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/rooms/{id}/actions',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns RoomInvite
     * @throws ApiError
     */
    public createInvite(
        id: number,
    ): CancelablePromise<RoomInvite> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/rooms/{id}/invites',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns StreamKey
     * @throws ApiError
     */
    public streamKeys(
        id: number,
    ): CancelablePromise<Array<StreamKey>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/rooms/{id}/keys',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns StreamKey
     * @throws ApiError
     */
    public createStreamKey(
        id: number,
        requestBody: NewStreamKeySchema,
    ): CancelablePromise<StreamKey> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/rooms/{id}/keys',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns Queue
     * @throws ApiError
     */
    public queue(
        id: number,
    ): CancelablePromise<Queue> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/rooms/{id}/queue',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Item(s) were added to the queue
     * @throws ApiError
     */
    public addToQueue(
        id: number,
        requestBody: InputSchema,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/rooms/{id}/queue',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param slug
     * @returns Room
     * @throws ApiError
     */
    public room(
        slug: string,
    ): CancelablePromise<Room> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/rooms/{slug}',
            path: {
                'slug': slug,
            },
        });
    }
}
