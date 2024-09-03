/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Player } from './Player';
import type { RoomConnection } from './RoomConnection';
import type { RoomMember } from './RoomMember';
export type Room = {
    connections: Array<RoomConnection>;
    description?: string | null;
    id: number;
    members: Array<RoomMember>;
    player?: Player | null;
    slug: string;
    title: string;
};

