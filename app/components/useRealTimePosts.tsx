import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "./ui/button";
import { api } from "../utils/api";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import isMobile from "@/app/utils/device";
import Link from "next/link";

export default function useRealTimePosts() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [seenIds, setSeenIds] = useState<Set<number>>(new Set());

  const fetchData = async () => {
    try {
      const response = await api(`last-cast?t=${Date.now()}`, {
        method: "GET",
      });
      let newData = (await response.json()) as {
        castHash: string;
        channelUrl: string;
        countryId: number;
        createdAt: string;
        fid: number;
        id: number;
        pfp_url: string;
        text: string;
        timestamp: string;
        username: string;
      }[];
      console.log(newData);

      setData((prevData) => {
        const updatedData = newData.filter(
          (item) => !prevData.some((prevItem) => prevItem.id === item.id)
        );
        return [...prevData, ...updatedData].slice(-20); // 최신 20개의 데이터만 유지
      });
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMobile()) return;
    fetchData();
    const intervalId = setInterval(fetchData, 30000); // 1분마다 fetchData 호출
    return () => clearInterval(intervalId);
  }, []);

  useRandomInterval(
    () => {
      const unseenData = data.filter((item) => !seenIds.has(item.id));
      console.log(data);
      if (unseenData.length > 0) {
        const randomIndex = Math.floor(Math.random() * unseenData.length);
        const newData = unseenData[randomIndex];
        setSeenIds((prevSeenIds) => new Set(prevSeenIds.add(newData.id)));
        toast.custom(
          (t) => (
            <div className="flex items-center p-4 bg-white w-[350px] shadow rounded-md pointer-events-auto">
              <div className="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 text-white text-md rounded-full bg-blue-500">
                <img
                  src={newData.pfp_url}
                  alt="Profile"
                  className="rounded-full aspect-square"
                />
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {newData.username}{" "}
                  <span className="mt-1 text-sm text-gray-500">
                    /
                    {newData.channelUrl === "https://onchainsummer.xyz"
                      ? "base"
                      : newData.channelUrl.substring(
                          newData.channelUrl.lastIndexOf("/") + 1
                        )}
                  </span>
                </p>
                <p className="mt-1 text-sm line-clamp-1 text-gray-500">
                  {newData.text}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <Link
                  href={`https://warpcast.com/${newData.username}/${newData.castHash}`}
                  passHref
                  target="_blank"
                  className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="rounded-lg"
                    >
                      <clipPath id="a">
                        <path d="m0 0h24v24h-24z" />
                      </clipPath>
                      <g clipPath="url(#a)">
                        <path d="m0 0h24v24h-24z" fill="#fff" />
                        <path
                          d="m0 12v12h12 12v-12-12.00000105h-12-12zm8.32174-4.21044c.02087.0887.18783.73044.37565 1.41914.18261.68869.41739 1.5704.51652 1.9565s.19305.7409.21392.7826c.01565.0418.25565-.7774.53739-1.8261.27648-1.04866.54778-2.03996.59478-2.20692l.0887-.29739h1.3722 1.3721l.5635 2.12348c.3078 1.17393.5739 2.14953.5896 2.17563.0156.0261.2869-.9339.6052-2.12867l.5791-2.17566 1.5392.00522c.84 0 1.5443.01044 1.5547.02087.0157.02087-.1043.44348-.8556 2.99474-.2191.7357-.4644 1.5757-.5478 1.8627-.0835.2869-.4435 1.5078-.7931 2.713l-.6417 2.1913-1.3565.0157-1.3513.0104-.6261-2.2174c-.3392-1.2209-.6365-2.2174-.6522-2.2174-.0209 0-.313.9965-.6522 2.2174l-.6208 2.2174h-1.34613-1.34087l-.15652-.5113c-.08348-.2765-.23478-.7878-.33913-1.1322-.09913-.3443-.67305-2.3061-1.27826-4.3617-.60522-2.05568-1.10087-3.75134-1.10087-3.76699 0-.0313 3.01043-.07826 3.08869-.04695.01566.00521.05218.08869.06783.1826z"
                          fill="#4A2B98"
                        />
                      </g>
                    </svg>
                  </motion.div>
                </Link>
              </div>
            </div>
          ),
          {
            duration: 10000,
          }
        );
      }
    },
    { minDelay: 3000, maxDelay: 10000 }
  );

  return { data, isLoading, error };
}

interface UseRandomIntervalOptions {
  minDelay: number;
  maxDelay: number;
}

export function useRandomInterval(
  callback: () => void,
  { minDelay, maxDelay }: UseRandomIntervalOptions
) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let id: NodeJS.Timeout;

    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      id = setTimeout(tick, delay);
    }

    if (minDelay !== null && maxDelay !== null) {
      tick();
      return () => clearTimeout(id);
    }
  }, [minDelay, maxDelay]);
}
