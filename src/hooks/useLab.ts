import { useState, useEffect } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import axios ,  { AxiosRequestConfig } from "axios";

export interface Lab {
  Lab_ID: number;
  Case_No: string;
  Institution_Code: string;
  Lab_Test_Description: string;
  Patient_ID: string;
  Reference_Ranges: string;
  Result_Value: string;
  Reported_Date: Date;
  Units_of_Measurement: string;
  }

const useLab =  () => {
const [data, setData] = useState<Lab[]>([]);
const [error, setError] = useState([]);

// API call to get game details

useEffect(() => {
   axios.get<Lab[]>("https://sgs-genai-omr-api.azurewebsites.net/lab", {
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

export default useLab;