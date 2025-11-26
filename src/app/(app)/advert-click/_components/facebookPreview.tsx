"use client"

import React from "react"

type FacebookPreviewProps = {
  primaryText: string
  headline: string
  description: string
  url: string
  mediaUrl: string
  mediaType: string
  className?: string
}

export default function FacebookPreview({
  primaryText,
  headline,
  description,
  url,
  mediaUrl,
  mediaType,
  className
}: FacebookPreviewProps) {

  const caption = primaryText || description || ""

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "")
    } catch {
      return ""
    }
  }

  return (
    <div className={className}>
      <div className="w-[360px] bg-white rounded-lg shadow border text-sm overflow-hidden">

        <div className="flex items-center gap-2 p-3">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <div>
            <p className="font-semibold">{headline}</p>

            {description && (
              <p className="text-gray-600 text-sm">{description}</p>
            )}

            <p className="text-sm text-blue-600">{url}</p>
          </div>
        </div>

        <div className="px-3 pb-2 text-[13px]">
          {caption}
        </div>

        {mediaUrl ? (
          mediaType === "video" ? (
            <video
              src={mediaUrl}
              controls
              className="w-full h-auto max-h-[300px] object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt="media"
              className="w-full h-auto max-h-[300px] object-cover"
            />
          )
        ) : (
          <div className="w-full h-40 bg-gray-200" />
        )}

        <div className="border-t px-3 py-3">
          <p className="text-[11px] text-gray-500">{getHostname(url)}</p>
          <p className="font-semibold text-[13px]">{headline}</p>
        </div>

        <div className="border-t flex justify-around py-2 text-xs text-gray-600">
          <button className="py-1 px-2">Like</button>
          <button className="py-1 px-2">Comment</button>
          <button className="py-1 px-2">Share</button>
        </div>

      </div>
    </div>
  )
}
