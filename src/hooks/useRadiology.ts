import { useState, useEffect } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import axios ,  { AxiosRequestConfig } from "axios";

export interface Radiology {
    Rad_ID: number;
  Case_No: string;
  Institution_Code: string;
  Order_Name: string;
  Procedure_Name: string;
  Report_cleaned: string;
  Exam_Start_Date: Date;
  }

const useRadiology =  () => {
const [data, setData] = useState<Radiology[]>([]);
const [error, setError] = useState([]);

// API call to get game details

useEffect(() => {
   axios.get<Radiology[]>("https://sgs-genai-omr-api.azurewebsites.net/radiology", {
    headers: {
      "x-api-key": "api_key_1",
      "Content-Type": "application/json",
    },
  })
   .then (res => setData(res.data))
    .catch((e) => {
        if (e instanceof CanceledError) return;
        setError(e.me);
        });
  }, []);
return {data, error}
};

export default useRadiology;