import {model, Schema} from "mongoose";

export type RequestLogType = {
    ip: string;
    url: string;
    date: Date;
};

const RequestLogSchema = new Schema<RequestLogType>({
    ip: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: Date, required: true, index: true },
});

export const RequestLogModel = model<RequestLogType>('RequestLog', RequestLogSchema);
