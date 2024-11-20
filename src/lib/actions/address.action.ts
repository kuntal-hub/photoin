'use server';
import { Address } from '@/lib/database/models/address.model';
import mongoose from 'mongoose';
import { auth } from '@clerk/nextjs/server';
import { User } from '../database/models/user.model';
import dbConnect from '../database/connectDB';


export async function createAddress(address: AddressActionParams) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const user = await User.findOne({clerkId: userId}).select('_id');
        if (!user) {
            throw new Error("User not found");
        }
        const newAddress = await Address.create({...address, user: user._id});
        if (!newAddress) {
            throw new Error("Error creating address");
        }
        return JSON.parse(JSON.stringify(newAddress));
    } catch (error) {
        console.log("Error creating address", error);
        return null;
    }
}

export async function updateAddress(address: AddressActionParams, addressId: string) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const user = await User.findOne({clerkId:userId}).select('_id');
        if (!user) {
            throw new Error("User not found");
        }
        const updatedAddress = await Address.findOneAndUpdate({_id: new mongoose.Types.ObjectId(addressId), user: user._id}, address, {new: true});
        if (!updatedAddress) {
            throw new Error("Error updating address");
        }
        return JSON.parse(JSON.stringify(updatedAddress)); 
    } catch (error) {
        console.log("Error updating address", error);
        return null;
    }
}

export async function deleteAddress(addressId:string) {
    try {
        await dbConnect();
        const { userId } = auth()
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const user = await User.findOne({clerkId: userId}).select('_id');
        if (!user) {
            throw new Error("User not found");
        } 
        const deletedAddress = await Address.findOneAndDelete({_id: new mongoose.Types.ObjectId(addressId), user: user._id});
        if (!deletedAddress) {
            throw new Error("Error deleting address");
        }
        return JSON.parse(JSON.stringify(deletedAddress));
    } catch (error) {
        console.log("Error deleting address", error);
        return null;
    }
}

export async function getAddressesByUserId() {
    try {
        const { userId } = auth()
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const user = await User.findOne({clerkId: userId});
        if (!user) {
            throw new Error("User not found");
        }
        const AllAddress = await Address.find({user: user._id});
        if (!AllAddress) {
            throw new Error("something went wrong while fetching address");
        }
        return JSON.parse(JSON.stringify(AllAddress));
    } catch (error) {
        console.log("Error getting address by usrtId", error);
        return null;
    }
}