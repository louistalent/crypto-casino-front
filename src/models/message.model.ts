import { Document, model, Schema } from 'mongoose';

interface IMessage extends Document {
    from_id: Schema.Types.ObjectId;
    to_id: Schema.Types.ObjectId;
    title?: string;
    content: string;
    detail?: Object;
    isUnRead?: boolean;
}

const messageSchema = new Schema<IMessage>(
    {
        from_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        to_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        detail: {
            type: Object,
            default: {}
        },
        isUnRead: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Message = model<IMessage>('Message', messageSchema);

export default Message;
