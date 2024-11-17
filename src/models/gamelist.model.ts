import { Document, model, Schema } from 'mongoose';
import { toJSON } from './plugins';

interface IGamelist extends Document {
    name: string;
    gameid: string;
    image?: string;
    device?: string;
    category?: string;
    status: boolean;
    provider: Schema.Types.ObjectId;
    type: string;
    sevice: string;
}

const gamelistSchema = new Schema<IGamelist>(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ''
        },
        status: {
            type: Boolean,
            required: true
        },
        device: {
            type: String,
            required: true
        },
        category: {
            type: String,
            default: ''
        },
        gameid: {
            type: String,
            required: true
        },
        provider: {
            type: Schema.Types.ObjectId,
            ref: 'Provider',
            required: true
        },
        sevice: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// add plugin that converts mongoose to json
gamelistSchema.plugin(toJSON);

const Gamelist = model<IGamelist>('Gamelist', gamelistSchema);

export default Gamelist;
