'use client'

import { ChangeEvent, useState } from 'react'

export const MediaPicker = () => {
  const [preview, setPreview] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setPreview(previewURL)
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        type="file"
        name="coverUrl"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
      />

      {preview && (
        <img
          src={preview}
          alt="Preview da imagem de capa"
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  )
}