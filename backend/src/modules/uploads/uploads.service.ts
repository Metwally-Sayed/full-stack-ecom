import { supabaseAdmin } from '../../config/supabase.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/app-error.js';

export async function uploadProductImage(buffer: Buffer, mimeType: string): Promise<string> {
  const rawExt = mimeType.split('/')[1];
  const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(filename, buffer, { contentType: mimeType, upsert: false });

  if (error) {
    throw new AppError(500, 'Internal Server Error', `Failed to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(filename);

  return publicUrl;
}
