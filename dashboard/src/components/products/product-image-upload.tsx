import { ImagePlus, Loader2, X } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/utils"
import { uploadProductImage } from "@/services/uploads.service"

type ProductImageUploadProps = {
  value: string | null
  onChange: (url: string | null) => void
}

export function ProductImageUpload({ value, onChange }: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFileChange(file: File | undefined) {
    if (!file) {
      return
    }

    setIsUploading(true)

    try {
      const imageUrl = await uploadProductImage(file)
      onChange(imageUrl)
      toast.success("Image uploaded")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  return (
    <div className="grid gap-3">
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(event) => void handleFileChange(event.target.files?.[0])}
      />
      {value ? (
        <div className="relative h-52 overflow-hidden rounded-lg border bg-muted">
          <img src={value} alt="Product preview" className="h-full w-full object-cover" />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute right-3 top-3"
            onClick={() => onChange(null)}
          >
            <X className="size-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
      ) : (
        <button
          type="button"
          className="flex h-52 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 text-sm text-muted-foreground transition-colors hover:bg-muted/40"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mb-3 size-6 animate-spin" />
          ) : (
            <ImagePlus className="mb-3 size-6" />
          )}
          {isUploading ? "Uploading image" : "Upload product image"}
        </button>
      )}
      {value ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Replace image"}
        </Button>
      ) : null}
    </div>
  )
}
