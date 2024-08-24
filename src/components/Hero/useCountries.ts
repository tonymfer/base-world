import { useState, useEffect } from 'react';
import { singletonHook } from 'react-singleton-hook';
import useApi from '@/hooks/useApi';
export type GlobeDataType = {
  casts: number;
  countryCode: string;
  countryName: string;
  createdAt: string;
  id: number;
  latitude: number;
  longitude: number;
  channelId: string;
  followers: number;
  channelUrl: string;
};

const useFixedGlobeDataImpl = () => {
  const [fixedData, setFixedData] = useState<GlobeDataType[] | null>(null);
  const { data } = useApi({
    url: 'countries',
    method: 'GET',
  }) as {
    data: GlobeDataType[];
  };

  useEffect(() => {
    if (data) {
      const tempFixedData = data.reduce((acc: GlobeDataType[], cur) => {
        if (cur.channelId === 'base-arabic') {
          return [
            ...acc,
            {
              ...cur,
              longitude: 33.8547,
              latitude: 35.8623,
              countryCode: 'LB',
              countryName: 'Lebanon',
            },
          ];
        } else {
          return [...acc, cur];
        }
      }, []);
      setFixedData(tempFixedData);
    }
  }, [data]);

  return fixedData;
};

export const useFixedGlobeData = singletonHook(null, useFixedGlobeDataImpl);