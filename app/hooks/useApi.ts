import { useEffect, useState } from "react";
import { api, ApiError } from "@/app/utils/api";

interface ApiRequest {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
}

export default function useApi(request: ApiRequest) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await api(request.url, {
          method: request.method,
          json: request.data,
        });
        setData(await response.json());
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }

    if (request.url) fetchData();
  }, [request.url]);

  return { isLoading, data, error };
}
