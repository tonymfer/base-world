import { useState, useEffect } from 'react';
import { singletonHook } from 'react-singleton-hook';
import useApi from '@/hooks/useApi';
import { GlobeDataType } from '@/components/Hero'; // Adjust the import path as necessary

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
              longitude: 55.296249,
              latitude: 25.276987,
              countryName: 'UAE',
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
