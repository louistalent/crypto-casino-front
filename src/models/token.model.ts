import { Document, model, Schema } from 'mongoose';
import { toJSON } from './plugins';

interface IToken extends Document {
    token: string;
    user: Schema.Types.ObjectId;
    type: string;
    expires?: Date;
    blacklisted: boolean;
}

const tokenSchema = new Schema<IToken>(
    {
        token: {
            type: String,
            required: true,
            index: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        expires: {
            type: Date,
            required: false
        },
        blacklisted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

const Token = model<IToken>('Token', tokenSchema);

export default Token;
