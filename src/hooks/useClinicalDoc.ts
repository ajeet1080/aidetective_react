import { useState, useEffect } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import axios ,  { AxiosRequestConfig } from "axios";

export interface ClinicalDoc {
  URO_ID: number;
  Patient_ID: string;
  Institution_Code: string;
  Case_No: string;
  Document_Name: string;
  Document_Item_Name_Long: string;
  Document_Item_Description: string;
  Left_Label: string;
  Right_Label: string;
  Authored_Date: Date;
  Value_Text: string;
  }




const useClinicalDoc =  () => {
const [details, setDetails] = useState<ClinicalDoc[]>([]);
const [error, setError] = useState([]);

// API call to get game details




useEffect(() => {
   axios.get<ClinicalDoc[]>("https://sgs-genai-omr-api.azurewebsites.net/uro", {
    headers: {
      "x-api-key": "api_key_1",
      "Content-Type": "application/json",
    },
  })
   .then (res => setDetails(res.data))
    .catch((e) => {
        if (e instanceof CanceledError) return;
        setError(e.me);
        });
  }, []);
return {details, error}
};

export default useClinicalDoc;