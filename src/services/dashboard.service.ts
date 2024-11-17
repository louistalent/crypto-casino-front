import CategorySetting from '../models/categorySetting.model';
import User from '../models/user.model';
import SpinModel from '../models/spinhistory.model';

const selectCategory = async (user: any) => {
    const result = await CategorySetting.findOne({ user_id: user._id });
    return result;
};

const setFreeBonus = async (user: any, value: any) => {
    console.log(value);
    const spinData: any = {
        user_id: user._id,
        value: value.value
    };

    await SpinModel.create(spinData);
    await User.updateOne(
        { _id: user._id },
        { spinbonus: user?.spinbonus + value.value, balance: user?.balance + value.value }
    );
    return value;
};

const getFreeBonus = async (user: any) => {
    const transactions: any = await SpinModel.findOne({ user_id: user._id }).sort({ createdAt: -1 });

    let diffTime = { hour: 24, minute: 0, second: 0 };
    if (transactions) {
        const t1 = new Date(transactions.createdAt);
        const t2 = new Date();
        const diff = t2.getTime() - t1.getTime();
        diffTime = {
            hour: Math.floor(diff / 3600000),
            minute: Math.floor((diff % 3600000) / 60000),
            second: Math.floor((diff % 60000) / 1000)
        };
    }

    const result = await SpinModel.find({ user_id: user._id }).sort({ createdAt: -1 });
    return { result, diffTime };
};

export default {
    selectCategory,
    setFreeBonus,
    getFreeBonus
};
