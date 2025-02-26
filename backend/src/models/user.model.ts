import { model, Schema } from 'mongoose';

export interface User {
    id:string;
    email:string;
    password: string;
    name:string;
    address:string;
    isAdmin:boolean;
}

export const UserSchema = new Schema<User>({
    name: {type: String, requires: true},
    email: {type: String, requires: true,unique:true},
    password: {type: String, requires: true},
    address: {type: String, requires: true},
    isAdmin: {type: Boolean, requires: true},
},{
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});


export const UserModel = model<User>('user', UserSchema);