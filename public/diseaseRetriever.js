self.onmessage = async (event) => {
  const { visualisedDisease, queriedSpeciesId } = event.data;
  const response = await fetch(`http://localhost:8000/api/retrieveDiseaseData/${visualisedDisease}/${queriedSpeciesId}`);
  
  try {
    const data = await response.json(); // Parse the response body as JSON
    // console.log(data);
    self.postMessage(data);
  } catch (error) {
    console.error('An error occurred while parsing the response:', error);
    self.postMessage({ error: error.message });
  }
};