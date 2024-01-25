import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./Pages/Home";
import { NetworkView } from "./Pages/NetworkView";

function App() {
  const [speciesData, setSpeciesData] = useState<Species[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/retrieveDataframe');
        setSpeciesData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

  fetchData();
  }, []);
  

  return (

    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home speciesData={speciesData}/>} />
          <Route path="/generateNetwork/:queriedSpeciesId" element={<NetworkView speciesData={speciesData}/>} />
        </Routes>
      </main>
    </BrowserRouter>

  );
}

export default App;