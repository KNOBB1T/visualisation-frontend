self.onmessage = async (event) => {
  try {
    // Uses a specific species id to retrieve the interactomes from the server
    const { parsedSpeciesId } = event.data;
    // Queries the API using the necessary parameters
    const response = await fetch(`http://localhost:8000/api/retrieveTaxonomy/${parsedSpeciesId}`);
    const text = await response.text();
    const parsedData = JSON.parse(text);
    // Send the result back to the main thread
    self.postMessage(parsedData);
  } catch (error) {
    // Handle the error
    console.error('Error retrieving taxonomy:', error);
    // Optionally, send an error message back to the main thread
    self.postMessage('Error retrieving taxonomy');
  }
};