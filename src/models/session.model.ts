import { Document, model, Schema } from 'mongoose';

interface ISession extends Document {
    user_id: Schema.Types.ObjectId;
    ip?: string;
    country: string;
    city?: string;
    os?: string;
    browser?: string;
    device?: string;
}

const sessionSchema = new Schema<ISession>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        ip: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        os: {
            type: String,
            default: ''
        },
        browser: {
            type: String,
            default: ''
        },
        device: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const Session = model<ISession>('Session', sessionSchema);

export default Session;
