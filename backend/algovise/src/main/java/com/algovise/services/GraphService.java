package com.algovise.services;

import com.algovise.entities.Edge;
import com.algovise.entities.Graph;
import com.algovise.entities.Node;
import com.algovise.repositories.GraphRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class GraphService {

    private GraphRepository graphRepository;

    public List<Graph> getAllGraphs() {
        return graphRepository.findAll();
    }

    public Graph getGraphById(Long id) {
        return graphRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Graph not found with id: " + id));
    }

    public Graph createGraph(Graph graph) {
        return graphRepository.save(graph);
    }

    public Graph addNodeToGraph(Long graphId, Node node) {
        Graph graph = getGraphById(graphId);
        graph.getNodes().add(node);
        return graphRepository.save(graph);
    }

    public Graph addEdgeToGraph(Long graphId, Edge edge) {
        Graph graph = getGraphById(graphId);
        graph.getEdges().add(edge);
        return graphRepository.save(graph);
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
