package com.algovise.controllers;

import com.algovise.dtos.EdgeDto;
import com.algovise.entities.Edge;
import com.algovise.entities.Graph;
import com.algovise.entities.Node;
import com.algovise.services.GraphService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.IntStream;

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
    public ResponseEntity<List<Node>> addNodeToGraph(@PathVariable Long graphId, @RequestBody Node[] nodes) {
        List<Node> createdNodes = new ArrayList<>();
        for(Node node : nodes) {
            createdNodes.add(graphService.addNodeToGraph(graphId, node));
        }
        return ResponseEntity.ok(createdNodes);
    }

    @PostMapping("/{graphId}/edges")
    public ResponseEntity<List<Edge>> addEdgeToGraph(@PathVariable Long graphId, @RequestBody EdgeDto[] edgeDtos) {
        removeNotExistingNodes(graphId, edgeDtos);
        List<Edge> createdEdges = new ArrayList<>();
        for(EdgeDto edgeDto : edgeDtos) {
            createdEdges.add(graphService.addEdgeToGraph(graphId, edgeDto));
        }
        return ResponseEntity.ok(createdEdges);
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

    private void removeNotExistingNodes(final Long graphId, final EdgeDto[] edges)
    {
        Graph graph = graphService.findGraphById(graphId).orElseThrow();

        Set<Long> idsOfExistingEdges = new HashSet<>();
        for(EdgeDto edgeDto : edges)
        {
            idsOfExistingEdges.add(edgeDto.getId());
        }

        Set<Long> idsOfExistingNodes = new HashSet<>();

        for(EdgeDto edgeDto : edges)
        {
            idsOfExistingNodes.add(edgeDto.getSourceId());
            idsOfExistingNodes.add(edgeDto.getTargetId());
        }

        System.out.println(idsOfExistingNodes);

        for(Node node : graph.getNodes())
        {
            final Long nodeId = node.getId();
            if (!idsOfExistingNodes.contains(nodeId))
            {
                Set<Long> idsOfEdgesToBeRemoved = new HashSet<>();
                for(Edge edge : graph.getEdges())
                {
                    if(Objects.equals(edge.getSourceId(), nodeId) || Objects.equals(edge.getTargetId(), nodeId))
                    {
                        idsOfEdgesToBeRemoved.add(edge.getId());
                    }
                }
                graphService.removeEdges(idsOfEdgesToBeRemoved);
                graphService.removeNode(nodeId);
            }
        }

        for(Edge edge : graph.getEdges())
        {
            boolean edgeExists = false;
            for(EdgeDto edgeDto : edges)
            {
                if (Objects.equals(edgeDto.getId(), edge.getId())) {
                    edgeExists = true;
                    break;
                }
            }
            if(!edgeExists)
            {
                graphService.removeEdges(Set.of(edge.getId()));
            }
        }
    }
}
