export interface Node {
  id: number;
  label: string;
}

export interface Edge {
  source_id: number;
  target_id: number;
  weight: number;
}

export interface Graph {
  id: number;
  name: string;
  directed: boolean;
  weighted: boolean;
  nodes: Node[];
  edges: Edge[];
  userId: number;
}
