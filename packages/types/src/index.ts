// packages/types/src/index.ts

// Define a type for the data you expect from the /api/hello endpoint
export type HelloApiResponse = {
    message: string;
    timestamp: string;
    // We can add a simple status field here
    status: 'ok' | 'error'; 
};

// Define a type for your main data entity, e.g., a Garden Plant
export type Plant = {
    id: string;
    name: string;
    species: string;
    plantedDate: string;
    health: 'Excellent' | 'Good' | 'Fair' | 'Poor';
};