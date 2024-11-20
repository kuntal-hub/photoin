'use server';

import { v2 as cloudinary } from 'cloudinary';


export async function deleteAsset(public_id: string) {
  try {
    // Delete image from cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    })
    const responce = await cloudinary.uploader.destroy(public_id);
    return responce;
  } catch (error) {
    return null;
  }
}

export async function deleteAssets(public_id: string[]) {
  try {
    // Delete image from cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    })
    const responce = await cloudinary.api.delete_resources(public_id)
    return responce;
  } catch (error) {
    return null;
  }
}