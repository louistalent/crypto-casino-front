import { Document, model, Schema } from 'mongoose';

interface ISpinhistory extends Document {
    user_id: Schema.Types.ObjectId;
    value?: number;
}

const spinhistorySchema = new Schema<ISpinhistory>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        value: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Spinhistory = model<ISpinhistory>('Spinshistory', spinhistorySchema);

export default Spinhistory;
