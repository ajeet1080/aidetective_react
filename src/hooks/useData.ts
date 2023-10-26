import React, { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import  { AxiosRequestConfig } from "axios";



interface FetchResponse <T> {
  count: number;
  results: T[];
}

const useData= <T>(endpoint: string, requestConfig?: AxiosRequestConfig ) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get<FetchResponse<T>>(endpoint, {signal: controller.signal})
      .then((res) => setData(res.data.results))
      .catch((e) => {
        if (e instanceof CanceledError) return;
        setError(e.message);
      });

    return () => controller.abort();
  }, []);

  return { data, error };
}

export default useData;
