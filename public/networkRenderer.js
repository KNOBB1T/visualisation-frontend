self.onmessage = async (event) => {
  const { queriedSpeciesId } = event.data;
  const response = await fetch(`http://localhost:8000/api/generateGraph/${queriedSpeciesId}`);
  const text = await response.text();
  const parsedData = JSON.parse(text);
  // Send the result back to the main thread
  self.postMessage(parsedData);
};