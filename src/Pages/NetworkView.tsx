import { useEffect, useRef, useState} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import visionet from "../visionet.png";
import { Data, Node, Edge} from "../NetworkData";
import * as d3 from 'd3';
import { SpeciesNetwork } from "../components/SpeciesNetwork";
import "./NetworkView.css"

export const NetworkView = ({ speciesData }: { speciesData: Species[]}) => {
    const { queriedSpeciesId } = useParams();
    const parsedSpeciesId = Number(queriedSpeciesId)
    const graphRef = useRef<SVGSVGElement>(null);
    const [data, setData] = useState<Data>({ nodes: [], edges: []});

    const queriedSpecies = speciesData.find(species => species.species_id === parsedSpeciesId);


    useEffect(() => {
        const fetchNetwork = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/generateGraph/${queriedSpeciesId}`);
                
                const parser = new DOMParser();
                const networkData = parser.parseFromString(response.data, 'application/xml');

                const nodes: Node[] = Array.from(networkData.querySelectorAll('node')).map((node) => ({
                    id: node.getAttribute('id')!,
                }));

                const edges: Edge[] = Array.from(networkData.querySelectorAll('edge')).map((edge) => ({
                    id: edge.getAttribute('id')!,
                    source: edge.getAttribute('source')!,
                    target: edge.getAttribute('target')!,
                }));

                 let data = {
                    nodes: nodes,
                    edges: edges
                }

                setData(data);

                console.log(JSON.stringify(data, null, 2));

            } catch (error) {
                console.error('Error fetching graph XML data:', error);
            }    
        };

    fetchNetwork();
}, []);

return (
    <div className="App">
      <div className="main-title">
        <img src={visionet} width={545} height={120} alt="visionet" />
      </div>
    <p>Herro lil neighbour, yo number ist: { queriedSpeciesId }</p>
    {/* <p>{data}</p> */}
    <p>Number of Nodes: {data?.nodes.length}</p>
    <p>Number of Nodes: {data?.edges.length}</p>
    <div className="network">
    <p className="speciesName">{queriedSpecies?.compact_name}</p>
    <SpeciesNetwork width = {1300} height = {700} data = {data} />
    </div>
    </div>
);
}