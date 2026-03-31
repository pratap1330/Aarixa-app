import { useState, useEffect, useCallback } from "react";
import { getService } from "../api/services/genericService/genericService";

export const useGet = <T = any>(
  url: string,
  params?: any,
  autoFetch: boolean = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getService(url, params);
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(params)]);

//   useEffect(() => {
//     if (autoFetch) fetchData();
//   }, [fetchData, autoFetch]);



 useEffect(() => {
    if (!url) return; 

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getService(url, params);
        setData(res);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};