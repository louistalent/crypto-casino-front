import mongoose, { Document, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { toJSON, paginate } from './plugins';
import { getRandomDigit } from '../utils/library';
import { statusoptions } from '../config';

export interface IUser extends Document {
    id: Number;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    avatar?: string;
    status: string;
    roleId: string;
    parent_id: string;
    birthday?: string;
    bonusbalnace: Number;
    bonus?: string;
    balance: Number;
    currency: string;
    country?: string;
    phonenumber?: string;
    address?: string;
    city?: string;
    state?: string;
    fido_amount?: Number;
    timezone?: string;
    createdAt?: Date;
    updatedAt?: Date;
    ip?: string;
    isPasswordMatch: (password: string) => Promise<boolean>;
    spinbonus: Number;
}

interface PlayerModel extends Model<IUser> {
    isEmailTaken: (email: string, excludeUserId?: string) => Promise<boolean>;
    isUsernameTaken: (username: string, excludeUserId?: string) => Promise<boolean>;
    paginate: (filter: Object, options?: Object) => Promise<boolean>;
}

const playerSchema = new mongoose.Schema<IUser, PlayerModel>(
    {
        id: {
            type: Number,
            default: 0
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        firstname: {
            type: String,
            required: true,
            trim: true
        },
        lastname: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
            private: true // used by the toJSON plugin
        },
        phonenumber: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: statusoptions,
            default: statusoptions[0]
        },
        avatar: {
            type: String,
            default: ''
        },
        balance: {
            type: Number,
            default: 0
        },
        bonusbalnace: {
            type: Number,
            default: 0
        },
        bonus: {
            type: String,
            default: '5%'
        },
        country: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        state: {
            type: String,
            default: ''
        },
        currency: {
            type: String,
            required: true
        },
        timezone: {
            type: String,
            default: ''
        },
        birthday: {
            type: String,
            default: ''
        },
        parent_id: {
            type: String,
            default: ''
        },
        roleId: {
            type: String,
            default: ''
        },
        fido_amount: {
            type: Number,
            default: 0
        },
        ip: {
            type: String,
            default: ''
        },
        spinbonus: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// add plugin that converts mongoose to json
playerSchema.plugin(toJSON);
playerSchema.plugin(paginate);
playerSchema.index({ username: 1, email: 1 });

playerSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: string) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

playerSchema.statics.isUsernameTaken = async function (username: string, excludeUserId?: string) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    return !!user;
};

playerSchema.methods.isPasswordMatch = async function (password: string) {
    const user = this as IUser;
    return bcrypt.compare(password, user.password);
};

playerSchema.pre<IUser>('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    user.id = getRandomDigit();
    next();
});

const Player = mongoose.model<IUser, PlayerModel>('User', playerSchema);

export default Player;
