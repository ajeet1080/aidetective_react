import { useState, useEffect } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import axios ,  { AxiosRequestConfig } from "axios";

export interface Drug {
  Drug_ID: number;
  Case_No: string;
  Institution_Code: string;
  Case_Type_Description: string;
  Drug_Form: string;
  Drug_Name: string;
  Instructions_from_Dispensed: string;
  Drug_Dispensed_Date_To: Date;
  }

const useDrug =  () => {
const [data, setData] = useState<Drug[]>([]);
const [error, setError] = useState([]);

// API call to get game details

useEffect(() => {
   axios.get<Drug[]>("https://sgs-genai-omr-api.azurewebsites.net/drugs", {
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

export default useDrug;