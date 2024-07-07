/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlayerState } from './PlayerState';
import type { QueueItem } from './QueueItem';
import type { RoomMember } from './RoomMember';
export type ServerEvent = ({
    new_state: PlayerState;
    room_id: number;
    type: ServerEvent.type;
} | {
    /**
     * The current position of the player, in seconds.
     */
    position: number;
    room_id: number;
    /**
     * The total position of the player, in seconds.
     */
    total_position: number;
    type: ServerEvent.type;
} | {
    /**
     * The id of the player the queue item's queue belongs to.
     */
    room_id: number;
    /**
     * The id of the new sink created for the queue item.
     */
    track_id: number;
    type: ServerEvent.type;
} | {
    /**
     * The error that happened while activating the queue item.
     */
    error: string;
    /**
     * The id of the player the queue item's queue belongs to.
     */
    room_id: number;
    /**
     * The id of the new sink created for the queue item.
     */
    track_id: number;
    type: ServerEvent.type;
} | {
    new_item?: QueueItem | null;
    room_id: number;
    type: ServerEvent.type;
} | {
    history: Array<QueueItem>;
    items: Array<QueueItem>;
    room_id: number;
    type: ServerEvent.type;
} | {
    new_member: RoomMember;
    room_id: number;
    type: ServerEvent.type;
} | {
    member_id: number;
    room_id: number;
    type: ServerEvent.type;
} | {
    room_id: number;
    source: string;
    type: ServerEvent.type;
    user_id: number;
});
export namespace ServerEvent {
    export enum type {
        PLAYER_STATE_UPDATE = 'player-state-update',
    }
}

