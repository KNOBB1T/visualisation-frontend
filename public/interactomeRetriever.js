self.onmessage = async (event) => {
    const { queriedSpeciesId } = event.data;
    const response = await fetch(`http://localhost:8000/api/retrieveInteractomes/${queriedSpeciesId}`);
    const interactomes = await response.text();
    // const parsedData = JSON.parse(interactomes);
    // Send the result back to the main thread
    self.postMessage(interactomes);
  };