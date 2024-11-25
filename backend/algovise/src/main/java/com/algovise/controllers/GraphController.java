package com.algovise.controllers;

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

    @PostMapping("/{id}/nodes")
    public ResponseEntity<Graph> addNodeToGraph(@PathVariable Long id, @RequestBody Node node) {
        Graph updatedGraph = graphService.addNodeToGraph(id, node);
        return ResponseEntity.ok(updatedGraph);
    }

    @PostMapping("/{id}/edges")
    public ResponseEntity<Graph> addEdgeToGraph(@PathVariable Long id, @RequestBody Edge edge) {
        Graph updatedGraph = graphService.addEdgeToGraph(id, edge);
        return ResponseEntity.ok(updatedGraph);
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
