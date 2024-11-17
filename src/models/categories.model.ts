import { Document, model, Schema } from 'mongoose';

interface ICategory extends Document {
    id: number;
    name: string;
    key: string;
    status: boolean;
}

const categorySchema = new Schema<ICategory>(
    {
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        key: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Category = model<ICategory>('Category', categorySchema);

export default Category;
