import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';

export interface Prompt {
  content: string;
  role: string;
  }

  const usePrompt = async (prompt: string) => {
 
    const response = await fetch('https://sgs-genai-omr-api.azurewebsites.net/generate', {
      method: 'POST',
      headers: {
        "x-api-key": "api_key_1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        // Add other parameters as needed
      })
    });
  
    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  };
  

export default usePrompt;