import mongoose from 'mongoose';
import { User } from '../../interfaces/User';

const userModel = new mongoose.Schema<User>({

});

export default mongoose.model<User>('User', userModel);
