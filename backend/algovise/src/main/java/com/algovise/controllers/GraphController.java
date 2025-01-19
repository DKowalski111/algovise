package com.algovise.controllers;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.dtos.EdgeDto;
import com.algovise.entities.Edge;
import com.algovise.entities.Graph;
import com.algovise.entities.Node;
import com.algovise.services.GraphService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.IntStream;

@RestController
@AllArgsConstructor
@RequestMapping("/graphs")
public class GraphController {

    private final GraphService graphService;
    private final UserAuthenticationProvider userAuthenticationProvider;

    @GetMapping
    public List<Graph> getAllGraphs(@RequestHeader("Authorization") String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        return graphService.getAllGraphs(token);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Graph> getGraphById(@PathVariable Long id) {
        Graph graph = graphService.getGraphById(id);
        return ResponseEntity.ok(graph);
    }

    @PostMapping
    public ResponseEntity<Graph> createGraph(@RequestBody Graph graph, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = extractToken(authorizationHeader);
            Graph createdGraph = graphService.createGraph(graph, token);
            return ResponseEntity.ok(createdGraph);
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @PostMapping("/{graphId}/nodes")
    public ResponseEntity<List<Node>> addNodeToGraph(@PathVariable Long graphId, @RequestBody Node[] nodes, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = extractToken(authorizationHeader);
            List<Node> createdNodes = new ArrayList<>();
            for (Node node : nodes) {
                createdNodes.add(graphService.addNodeToGraph(graphId, node, token));
            }
            return ResponseEntity.ok(createdNodes);
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @PostMapping("/{graphId}/edges")
    public ResponseEntity<List<Edge>> addEdgeToGraph(@PathVariable Long graphId, @RequestBody EdgeDto[] edgeDtos, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = extractToken(authorizationHeader);
            removeNotExistingNodes(graphId, edgeDtos, token);
            List<Edge> createdEdges = new ArrayList<>();
            for (EdgeDto edgeDto : edgeDtos) {
                createdEdges.add(graphService.addEdgeToGraph(graphId, edgeDto));
            }
            return ResponseEntity.ok(createdEdges);
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Graph> updateGraph(@PathVariable Long id, @RequestBody Graph graph, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = extractToken(authorizationHeader);
            Graph updatedGraph = graphService.updateGraph(id, graph, token);
            return ResponseEntity.ok(updatedGraph);
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGraph(@PathVariable Long id, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = extractToken(authorizationHeader);
            graphService.deleteGraph(id, token);
            return ResponseEntity.noContent().build();
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    private void removeNotExistingNodes(final Long graphId, final EdgeDto[] edges, String token) throws IllegalAccessException {
        Long userId = userAuthenticationProvider.getUserIdByToken(token);
        Graph graph = graphService.findGraphById(graphId).orElseThrow();

        if (!graph.getUser().getId().equals(userId)) {
            throw new IllegalAccessException("Trying to modify graph of someone else!");
        }

        Set<Long> idsOfExistingEdges = new HashSet<>();
        for (EdgeDto edgeDto : edges) {
            idsOfExistingEdges.add(edgeDto.getId());
        }

        Set<Long> idsOfExistingNodes = new HashSet<>();

        for (EdgeDto edgeDto : edges) {
            idsOfExistingNodes.add(edgeDto.getSourceId());
            idsOfExistingNodes.add(edgeDto.getTargetId());
        }

        for (Node node : graph.getNodes()) {
            final Long nodeId = node.getId();
            if (!idsOfExistingNodes.contains(nodeId)) {
                Set<Long> idsOfEdgesToBeRemoved = new HashSet<>();
                for (Edge edge : graph.getEdges()) {
                    if (Objects.equals(edge.getSourceId(), nodeId) || Objects.equals(edge.getTargetId(), nodeId)) {
                        idsOfEdgesToBeRemoved.add(edge.getId());
                    }
                }
                graphService.removeEdges(idsOfEdgesToBeRemoved);
                graphService.removeNode(nodeId);
            }
        }

        for (Edge edge : graph.getEdges()) {
            boolean edgeExists = false;
            for (EdgeDto edgeDto : edges) {
                if (Objects.equals(edgeDto.getId(), edge.getId())) {
                    edgeExists = true;
                    break;
                }
            }
            if (!edgeExists) {
                graphService.removeEdges(Set.of(edge.getId()));
            }
        }
    }

    private String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid Authorization header");
        }
        return authorizationHeader.substring(7); // Remove "Bearer " prefix
    }
}
