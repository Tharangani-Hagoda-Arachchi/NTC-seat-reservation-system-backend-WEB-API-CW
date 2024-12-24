import axios from "axios";


// Function to fetch Swagger JSON from a URL
export async function fetchSwaggerJson(url) {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (error) {
        console.error('Error fetching Swagger JSON:', error.message);
        throw new Error('Failed to fetch Swagger JSON');
    }
}

// Function to filter routes in the Swagger JSON based on a keyword
export function filterRoutes(swaggerJson, keyword) {
    const filteredPaths = {};
    for (const [path, methods] of Object.entries(swaggerJson.paths)) {
        if (path.includes(keyword)) {
            filteredPaths[path] = methods;
        }
    }
    return {
        ...swaggerJson,
        paths: filteredPaths,
    };
}