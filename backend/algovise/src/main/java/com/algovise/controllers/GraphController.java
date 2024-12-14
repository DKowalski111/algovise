package com.algovise.controllers;

import com.algovise.dtos.EdgeDto;
import com.algovise.entities.Edge;
import com.algovise.entities.Graph;
import com.algovise.entities.Node;
import com.algovise.services.GraphService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/graphs")
public class GraphController {

    private GraphService graphService;

    @GetMapping
    public List<Graph> getAllGraphs() {
        return graphService.getAllGraphs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Graph> getGraphById(@PathVariable Long id) {
        Graph graph = graphService.getGraphById(id);
        return ResponseEntity.ok(graph);
    }

    @PostMapping
    public ResponseEntity<Graph> createGraph(@RequestBody Graph graph) {
        Graph createdGraph = graphService.createGraph(graph);
        return ResponseEntity.ok(createdGraph);
    }

    @PostMapping("/{graphId}/nodes")
    public ResponseEntity<Node> addNodeToGraph(@PathVariable Long graphId, @RequestBody Node node) {
        Node createdNode = graphService.addNodeToGraph(graphId, node);
        return ResponseEntity.ok(createdNode);
    }

    @PostMapping("/{graphId}/edges")
    public ResponseEntity<Edge> addEdgeToGraph(@PathVariable Long graphId, @RequestBody EdgeDto edgeDto) {
        Edge createdEdge = graphService.addEdgeToGraph(graphId, edgeDto);
        return ResponseEntity.ok(createdEdge);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Graph> updateGraph(@PathVariable Long id, @RequestBody Graph graph) {
        Graph updatedGraph = graphService.updateGraph(id, graph);
        return ResponseEntity.ok(updatedGraph);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGraph(@PathVariable Long id) {
        graphService.deleteGraph(id);
        return ResponseEntity.noContent().build();
    }
}
