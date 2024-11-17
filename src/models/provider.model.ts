import { Document, model, Schema } from 'mongoose';
import { toJSON } from './plugins';

interface IProvider extends Document {
    name: string;
    id: string;
    title: string;
    status: boolean;
    categoryId: Schema.Types.ObjectId;
    service: string;
}

const providerSchema = new Schema<IProvider>(
    {
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        status: {
            type: Boolean,
            required: true,
            default: true
        },
        service: {
            type: String,
            default: ''
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    },
    {
        timestamps: true
    }
);

// add plugin that converts mongoose to json
providerSchema.plugin(toJSON);

const Provider = model<IProvider>('Provider', providerSchema);

export default Provider;
