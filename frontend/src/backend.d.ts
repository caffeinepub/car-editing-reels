import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Reel {
    id: bigint;
    title: string;
    thumbnailUrl: string;
    tags: Array<string>;
    description: string;
    viewCount: bigint;
    uploader: string;
    videoUrl: string;
}
export interface ViewRange {
    end: bigint;
    start: bigint;
}
export interface NewReel {
    title: string;
    thumbnailUrl: string;
    tags: Array<string>;
    description: string;
    uploader: string;
    videoUrl: string;
}
export interface backendInterface {
    filterByTag(search: string, range: ViewRange): Promise<Array<Reel>>;
    getAllReels(): Promise<Array<Reel>>;
    getFeaturedReels(range: ViewRange): Promise<Array<Reel>>;
    getReel(id: bigint): Promise<Reel>;
    incrementViewCount(id: bigint): Promise<boolean>;
    submitReel(newReel: NewReel): Promise<bigint>;
}
