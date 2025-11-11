import { useState, useCallback } from 'react';

// Define the structure expected from the API for clarity
interface HelloApiResponse {
    message: string;
    timestamp: string; 
    status: 'ok' | 'error';
}

// Define the shape of the data returned by the hook
interface ApiFetchResult {
  apiResponse: string;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

/**
 * Custom React hook for fetching data from the /api/hello endpoint.
 * This abstracts away the fetch logic, loading, and error states.
 * It uses the VITE_API_BASE_URL environment variable for cross-origin requests.
 * @returns {ApiFetchResult} An object containing the response, status, and fetch function.
 */
export const useApiFetch = (): ApiFetchResult => {
  const [apiResponse, setApiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/hello`;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setApiResponse('Fetching data...'); // Temporary loading message
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
      const response = await fetch(`${API_BASE_URL}/temp-api/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data: HelloApiResponse = await response.json(); 
      
      const message = `API Message: "${data.message}" | Status: ${data.status} | Timestamp: ${data.timestamp}`;
      setApiResponse(message);

      console.log('API Data:', data);

    } catch (err) {
      // Ensure error is treated as a string for display
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setApiResponse(`Error fetching data: ${errorMessage}`);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]); 

  return { apiResponse, isLoading, error, fetchData };
};