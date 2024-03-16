self.onmessage = async (event) => {
  try {
    // uses a specific disease and species id to retrieve the disease data from the server
    const { visualisedDisease, queriedSpeciesId } = event.data;
    // Queries the API using the necessary parameters
    const response = await fetch(`http://localhost:8000/api/retrieveDiseaseData/${visualisedDisease}/${queriedSpeciesId}`);
    const data = await response.json();
    // sends the result back to the main thread
    self.postMessage(data);
  } catch (error) {
    // Handle the error
    console.error('An error occurred while parsing the response:', error);
    // Optionally, send an error message back to the main thread
    self.postMessage({ error: error.message });
  }
};