/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginResult } from '../models/LoginResult';
import type { LoginSchema } from '../models/LoginSchema';
import type { RegisterSchema } from '../models/RegisterSchema';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param requestBody
     * @returns LoginResult
     * @throws ApiError
     */
    public login(
        requestBody: LoginSchema,
    ): CancelablePromise<LoginResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public logout(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/auth/logout',
        });
    }
    /**
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public register(
        requestBody: RegisterSchema,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/v1/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns User
     * @throws ApiError
     */
    public user(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/auth/user',
        });
    }
}
