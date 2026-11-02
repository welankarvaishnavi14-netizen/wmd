
const API_URL = "http://localhost:8080";

export async function checkBackend() {
    const response = await fetch(`${API_URL}/api/health`);
    return response.json();
}
