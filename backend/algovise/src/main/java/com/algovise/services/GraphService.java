package com.algovise.services;

import com.algovise.dtos.EdgeDto;
import com.algovise.entities.Edge;
import com.algovise.entities.Graph;
import com.algovise.entities.Node;
import com.algovise.repositories.EdgeRepository;
import com.algovise.repositories.GraphRepository;
import com.algovise.repositories.NodeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@AllArgsConstructor
public class GraphService {

    private GraphRepository graphRepository;

    private NodeRepository nodeRepository;

    private EdgeRepository edgeRepository;

    public List<Graph> getAllGraphs() {
        return graphRepository.findAll();
    }

    public Graph getGraphById(Long id) {
        return graphRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Graph not found with id: " + id));
    }

    public Graph createGraph(Graph graph) {
        graph.setNodes(new HashSet<>()); // Initialize empty node and edge sets
        graph.setEdges(new HashSet<>());
        return graphRepository.save(graph); // Save the graph without nodes or edges
    }

    public Node addNodeToGraph(Long graphId, Node node) {
        Graph graph = getGraphById(graphId); // Fetch the graph
        node.setGraph(graph);               // Assign the graph to the node

        // Save the node explicitly to generate its ID
        Node savedNode = nodeRepository.save(node);

        // Add the saved node to the graph's node set
        graph.getNodes().add(savedNode);

        // Save the graph to update its relationship (optional)
        graphRepository.save(graph);

        return savedNode; // Return the node with its ID
    }



    public Edge addEdgeToGraph(Long graphId, EdgeDto edgeDto) {
        Graph graph = getGraphById(graphId);
        Edge edge = new Edge();
        edge.setGraph(graph);               // Assign the graph to the edge
        edge.setSource(getNodeById(edgeDto.getSourceId()));
        edge.setTarget(getNodeById(edgeDto.getTargetId()));
        edge.setWeight(edgeDto.getWeight());

        // Ensure the source and target nodes exist and are linked to the graph
        Edge savedEdge = edgeRepository.save(edge);
        Node sourceNode = getNodeById(savedEdge.getSource().getId());
        Node targetNode = getNodeById(savedEdge.getTarget().getId());

        if (!sourceNode.getGraph().getId().equals(graphId) || !targetNode.getGraph().getId().equals(graphId)) {
            throw new IllegalArgumentException("Source or Target nodes do not belong to the specified graph");
        }

        graph.getEdges().add(savedEdge);         // Add the edge to the graph's edge set
        graphRepository.save(graph);        // Persist the changes
        return savedEdge;                        // Return the created edge
    }

    private Node getNodeById(Long nodeId) {
        // Method to fetch a node by ID
        return nodeRepository.findById(nodeId)
                .orElseThrow(() -> new RuntimeException("Node not found with id: " + nodeId));
    }

    public Graph updateGraph(Long id, Graph updatedGraph) {
        Graph graph = getGraphById(id);
        graph.setDirected(updatedGraph.isDirected());
        graph.setWeighted(updatedGraph.isWeighted());
        graph.setNodes(updatedGraph.getNodes());
        graph.setEdges(updatedGraph.getEdges());
        return graphRepository.save(graph);
    }

    public void deleteGraph(Long id) {
        graphRepository.deleteById(id);
    }
}
