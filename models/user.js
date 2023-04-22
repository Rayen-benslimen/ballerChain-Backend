import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        birthday: {
            type: String,
            required: false,
            default: "aaa"
        },
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        coins: {
            type: Number,
            required: false,
            default: 0
        },
        balance: {
            type: Number,
            required: false,
            default: 0
        },
        address:{
            type: String,
            required: false
        },
        privatekey:{
            type: String,
            required: false
        },
        steps: {
            type: Number,
            required: false
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },

        /* experiences:[{
             type:mongoose.Types.ObjectId,
             ref:"Experience"
         }]*/




    },

);

export default model('User', userSchema);