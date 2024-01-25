export interface Node extends d3.SimulationNodeDatum {
    id: string;
}
  
export interface Edge extends d3.SimulationLinkDatum<Node> {
    id: string;
    source: string;
    target: string;
}

export type Data = {
    nodes: Node[];
    edges: Edge[];
}