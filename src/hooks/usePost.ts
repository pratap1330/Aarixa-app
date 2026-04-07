import { useState } from "react";
import { postService } from "../api/services/genericService/genericService";

export const usePost = <T = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const postData = async (url: string, body: any) => {
    try {
      setLoading(true);
      setError(null);

      const res = await postService(url, body);
      setData(res);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    postData,
  };
};

