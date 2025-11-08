import { useState, useCallback } from 'react';

// Define the type locally to remove dependency on @garden/types
interface HelloApiResponse {
  message: string;
  timestamp: number;
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
 * @returns {ApiFetchResult} An object containing the response, status, and fetch function.
 */
export const useApiFetch = (): ApiFetchResult => {
  const [apiResponse, setApiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setApiResponse('Fetching data...'); // Temporary loading message
    
    try {
      const response = await fetch('/api/hello');
      
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
  }, []); // Empty dependency array means this function is created once

  return { apiResponse, isLoading, error, fetchData };
};