self.onmessage = async (event) => {
  try {
    // Uses a specific species id to retrieve the interactomes from the server
    const { queriedSpeciesId } = event.data;
    // Queries the API using the necessary parameters
    const response = await fetch(`http://localhost:8000/api/retrieveInteractomes/${queriedSpeciesId}`);
    const interactomes = await response.text();
    // Send the result back to the main thread
    self.postMessage(interactomes);
  } catch (error) {
    // Handle the error
    console.error('Error retrieving interactomes:', error);
    // Optionally, send an error message back to the main thread
    self.postMessage('Error retrieving interactomes');
  }
  };