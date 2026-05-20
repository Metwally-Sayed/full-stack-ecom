import { api } from "@/lib/api"

export async function uploadProductImage(file: File) {
  const formData = new FormData()
  formData.append("image", file)

  const response = await api.post<{ data: { imageUrl: string } }>(
    "/uploads/product-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data.data.imageUrl
}
