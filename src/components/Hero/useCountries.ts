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
        if (cur.countryName === 'India') {
          return [];
        }
        if (cur.channelId === 'base-arabic') {
          return [
            ...acc,
            {
              ...cur,
              longitude: 55.296249,
              latitude: 25.276987,
              countryCode: 'AE',
              countryName: 'UAE',
            },
          ];
        }
        if (cur.countryName === 'Thailand') {
          return [
            ...acc,
            {
              ...cur,
              longitude: 100.523186,
              latitude: 13.736717,
            },
          ];
        }
        if (cur.countryName === 'Philippines') {
          return [
            ...acc,
            {
              ...cur,
              longitude: 120.984219,
              latitude: 14.599512,
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
