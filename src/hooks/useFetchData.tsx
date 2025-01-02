import { getData, getDatById } from "@/backend/Services/firestore";
import { useEffect, useState } from "react";

export function useFetchData(Title: string) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getData(Title);
        setData(data || []);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [Title]);

  return {
    data,
    loading
  };
}

export function useFetchDataById(Title: string, id: any) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getDatById(Title, id);
        setData(data || []);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [Title, id]);

  return {
    data,
    loading
  };
}
