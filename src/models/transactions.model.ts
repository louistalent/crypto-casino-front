import mongoose, { Schema } from 'mongoose';

import { getRandomDigit } from '../utils/library';

const TransactionSchema = new Schema({
    id: {
        type: String,
        default: 0
    },
    madeId: {
        type: String,
        default: ''
    },
    from: {
        type: String,
        default: ''
    },
    to: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    inAmount: {
        type: Number,
        default: 0
    },
    outAmount: {
        type: Number,
        default: 0
    },
    date: {
        type: Date
    }
});

TransactionSchema.pre('save', async function (next) {
    const user: any = this;
    user.id = getRandomDigit();
    next();
});

export default mongoose.model('transactions', TransactionSchema);
