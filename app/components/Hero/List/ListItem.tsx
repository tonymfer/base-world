import React from "react";
import Image from "next/image";
import ProfileImage from "@/app/components/ProfileImage";
import Link from "next/link";
import queryString from "query-string";

type ListItemProps = {
  data: {
    id: number;
    createdAt: string;
    castHash: string;
    fid: number;
    username: string;
    pfp_url: string;
    text: string;
    timestamp: string;
    channelUrl: string;
    countryId: number;
  };
  index: number;
  className?: string;
};

export default function ListItem({ data, index, className }: ListItemProps) {
  const { id, username, pfp_url, text, fid, castHash } = data;

  const shareQs = queryString.stringify({
    text: `this cast deserves some 👏`,
    "embeds[]": [
      `https://tip.hunt.town/allowance/${fid}?t=${Date.now()}`,
      `https://warpcast.com/${username}/${castHash}`,
    ],
  });

  const shareLink = `https://warpcast.com/~/compose?${shareQs}`;

  return (
    <Link
      href={`https://warpcast.com/${username}/${castHash}`}
      className={`shadow-lg pointer-events-none mb-3 overscroll-none rounded-md p-4 py-5 ${className}`}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className={`flex w-full items-center justify-between ${className}`}>
        <div>
          <div
            className={`flex w-full items-center justify-start gap-2 ${className}`}
          >
            <ProfileImage
              id={id.toString()}
              nickname={username}
              src={`https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,w_30,h_30/${pfp_url}`}
              containerSize={30}
              imageSize={30}
            />
            <h1
              className={`truncate text-xl font-normal text-black mobile:text-xl ${className}`}
            >
              {username}
            </h1>
          </div>
        </div>
        <Link
          className="text-3xl pointer-events-auto"
          href={shareLink}
          target="_blank"
          rel="noreferrer noopener"
        >
          👏
        </Link>
      </div>
      <div
        className={`mt-2.5 flex w-full justify-start whitespace-pre-wrap text-sm text-grey line-clamp-1 ${className}`}
      >
        {text}
      </div>
    </Link>
  );
}
