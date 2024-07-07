/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlayerState } from './PlayerState';
import type { QueueItem } from './QueueItem';
export type Player = {
    currentItem?: QueueItem | null;
    currentTime: number;
    state: PlayerState;
    totalTime: number;
};

