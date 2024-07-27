import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "./ui/button";
import { useRandomInterval } from "@uidotdev/usehooks";
import { api } from "../utils/api";

export default function useRealTimePosts() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<any>();

  const clear = useRandomInterval(
    () => {
      async function fetchData() {
        try {
          const response = await api("last-cast", {
            method: "GET",
          });
          const newData = await response.json();
          if (newData !== data) {
            toast.custom((t) => (
              <div>
                <h1>Custom toast</h1>
                <button onClick={() => toast.dismiss(t)}>Dismiss</button>
              </div>
            ));
          }
        } catch (e) {
          setError(e);
        }
      }

      fetchData();
    },
    { minDelay: 3000, maxDelay: 100000 }
  );
}
