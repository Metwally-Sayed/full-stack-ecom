export function listResponse<T>(data: T[], meta: object) {
  return { data, meta };
}

export function singleResponse<T>(data: T) {
  return { data };
}

export function messageResponse(message: string) {
  return { message };
}
