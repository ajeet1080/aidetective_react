import axios, { CanceledError }  from 'axios';

//create params to store base url and api key
export default axios.create({
    baseURL: 'https://sgs-genai-omr-api.azurewebsites.net',
    headers: {
        "x-api-key": "api_key_1",
        "Content-Type": "application/json"
    }
});

export {CanceledError}