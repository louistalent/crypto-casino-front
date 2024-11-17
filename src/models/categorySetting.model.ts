import { Document, model, Schema } from 'mongoose';

interface ICategorySelect extends Document {
    user_id: Schema.Types.ObjectId;
    sport?: boolean;
    casino?: boolean;
    livecasino?: boolean;
    virtual?: boolean;
    minigames?: boolean;
    esport?: boolean;
    casinovip?: boolean;
    chicken?: boolean;
    aviator?: boolean;
    turbogames?: boolean;
    italianlottery?: boolean;
    tournaments?: boolean;
}

const categorySelectSchema = new Schema<ICategorySelect>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sport: {
            type: Boolean,
            default: true
        },
        casino: {
            type: Boolean,
            default: true
        },
        livecasino: {
            type: Boolean,
            default: true
        },
        virtual: {
            type: Boolean,
            default: true
        },
        esport: {
            type: Boolean,
            default: true
        },
        casinovip: {
            type: Boolean,
            default: true
        },
        chicken: {
            type: Boolean,
            default: true
        },
        aviator: {
            type: Boolean,
            default: true
        },
        turbogames: {
            type: Boolean,
            default: true
        },
        italianlottery: {
            type: Boolean,
            default: true
        },
        tournaments: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const CategorySelect = model<ICategorySelect>('CategorySelect', categorySelectSchema);

export default CategorySelect;
