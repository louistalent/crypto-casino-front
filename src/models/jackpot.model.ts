import { Document, model, Schema } from 'mongoose';

interface IJackpotSetting extends Document {
    silver?: object;
    gold?: object;
    platinum?: object;
    fee: number;
    silverValue?: number;
    goldValue?: number;
    platinumValue?: number;
}

const jackpotSchema = new Schema<IJackpotSetting>(
    {
        silver: {
            type: Object,
            default: {}
        },
        gold: {
            type: Object,
            default: {}
        },
        platinum: {
            type: Object,
            default: {}
        },
        fee: {
            type: Number,
            default: 0
        },
        silverValue: {
            type: Number,
            default: 0
        },
        goldValue: {
            type: Number,
            default: 0
        },
        platinumValue: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Provider = model<IJackpotSetting>('Jackpot', jackpotSchema);

export default Provider;
