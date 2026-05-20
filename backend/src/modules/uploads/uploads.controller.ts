import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../../utils/app-error.js';
import { singleResponse } from '../../utils/response.js';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from './uploads.schemas.js';
import { uploadProductImage } from './uploads.service.js';

export async function uploadImage(request: FastifyRequest, reply: FastifyReply) {
  const part = await request.file();

  if (!part) {
    throw new AppError(400, 'Bad Request', 'No file uploaded');
  }

  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(part.mimetype)) {
    throw new AppError(
      400,
      'Bad Request',
      `File type not allowed. Accepted types: ${ALLOWED_MIME_TYPES.join(', ')}`,
    );
  }

  const buffer = await part.toBuffer();

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new AppError(400, 'Bad Request', 'File size exceeds 5 MB limit');
  }

  const imageUrl = await uploadProductImage(buffer, part.mimetype);

  return reply.status(200).send(singleResponse({ imageUrl }));
}
