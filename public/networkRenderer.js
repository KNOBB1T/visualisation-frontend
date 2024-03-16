self.onmessage = async (event) => {
  try {
    // Uses a specific species id to retrieve the interactomes from the server
    const { parsedSpeciesId } = event.data;
    console.log("Parsed Species Id: " + parsedSpeciesId);
    // Queries the API using the necessary parameters
    const response = await fetch(`http://localhost:8000/api/generateGraph/${parsedSpeciesId}`);
    const text = await response.text();
    const parsedData = JSON.parse(text);
    // Send the result back to the main thread
    console.log("Parsed Data: " + parsedData);
    self.postMessage(parsedData);
  } catch (error) {
    // Handle the error
    console.error('Error generating graph:', error);
    // Optionally, send an error message back to the main thread
    self.postMessage('Error generating graph');
  }
};