import { StreamType } from "../enum/stream-type";

export interface IStream {
    streamType: StreamType;
    remoteUrl?: string;
    client: any;
}