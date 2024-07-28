import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";
import { api } from "@/utils/api";

export default function ProfileImage({
  className,
  id,
  nickname,
  src,
  containerSize = 40,
  imageSize = containerSize - 2,
}: {
  className?: string;
  id: string;
  nickname: string | null;
  src: string | null;
  containerSize?: number;
  imageSize?: number;
}) {
  return (
    <div
      className={twMerge(
        "relative flex items-center justify-center overflow-hidden rounded-full",
        className
      )}
      style={{
        width: containerSize,
        height: containerSize,
      }}
    >
      <div className="absolute left-0 top-0 z-0 h-full w-full rounded-full border-2 p-[1px]">
        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
          {nickname?.charAt(0).toUpperCase()}
        </div>
      </div>
      {src && (
        <Image
          className="relative z-[1] rounded-full"
          src={src}
          alt=""
          width={imageSize}
          height={imageSize}
          unoptimized
          // onError={(e) => {
          //   console.error("error loading image", src, nickname);
          //   api.get(`users/refresh_image/${id}.json`).catch((e) => {
          //     console.error(`error refreshing image for user ${id}`, e);
          //   });
          //   (e.target as HTMLImageElement)?.remove?.();
          // }}
        />
      )}
    </div>
  );
}
