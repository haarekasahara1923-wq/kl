import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dummy_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'dummy_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy_secret',
  secure: true,
});

export default cloudinary;

export async function uploadToCloudinary(
  file: Buffer | string,
  options: {
    folder?: string;
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
    public_id?: string;
  } = {}
) {
  return new Promise<{ url: string; public_id: string; secure_url: string }>((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'kl-school',
      resource_type: options.resource_type || 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      ...(options.public_id && { public_id: options.public_id }),
    };

    if (typeof file === 'string') {
      cloudinary.uploader.upload(file, uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve({ url: result!.secure_url, public_id: result!.public_id, secure_url: result!.secure_url });
      });
    } else {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve({ url: result!.secure_url, public_id: result!.public_id, secure_url: result!.secure_url });
        })
        .end(file);
    }
  });
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
