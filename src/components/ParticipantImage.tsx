import type { ImgHTMLAttributes } from 'react'

export const DEFAULT_IMAGE = `${import.meta.env.BASE_URL}default_participant.svg`

// Фото участника; если ссылки нет или файл не загрузился — изображение по умолчанию
export default function ParticipantImage({ src, ...rest }: { src: string | null } & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>) {
  return (
    <img
      {...rest}
      src={src || DEFAULT_IMAGE}
      onError={(e) => {
        if (e.currentTarget.src !== DEFAULT_IMAGE) e.currentTarget.src = DEFAULT_IMAGE
      }}
    />
  )
}
