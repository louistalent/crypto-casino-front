import mongoose, { Schema } from 'mongoose';

const JackpothistorySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user_name: {
        type: String,
        default: ''
    },
    shop_name: {
        type: String,
        default: ''
    },
    jackpot: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        default: 0
    },
    date: {
        type: Date
    }
});

export default mongoose.model('jackpothistory', JackpothistorySchema);
