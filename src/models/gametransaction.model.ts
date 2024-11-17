import { Document, model, Schema } from 'mongoose';
import { toJSON } from './plugins';

interface IGametransaction extends Document {
    user_id: Schema.Types.ObjectId;
    amount?: number;
    game_id?: Schema.Types.ObjectId;
    provider_id?: Schema.Types.ObjectId;
    after_credit?: number;
    user_credit?: number;
    transactionId?: string;
    currency: string;
    type?: string;
    createdAt?: Date;
    detail?: Object;
}

const gametransactionSchema = new Schema<IGametransaction>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        game_id: {
            type: Schema.Types.ObjectId,
            ref: 'Gamelist',
            required: true
        },
        provider_id: {
            type: Schema.Types.ObjectId,
            ref: 'Provider',
            required: true
        },
        amount: {
            type: Number,
            default: 0
        },

        user_credit: {
            type: Number,
            default: 0
        },
        after_credit: {
            type: Number,
            default: 0
        },
        transactionId: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        detail: {
            type: Object,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

// add plugin that converts mongoose to json
gametransactionSchema.plugin(toJSON);

const Gamelist = model<IGametransaction>('Gametransaction', gametransactionSchema);

export default Gamelist;
