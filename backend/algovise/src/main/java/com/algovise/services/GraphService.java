package com.algovise.services;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.dtos.EdgeDto;
import com.algovise.entities.Edge;
import com.algovise.entities.Graph;
import com.algovise.entities.Node;
import com.algovise.repositories.EdgeRepository;
import com.algovise.repositories.GraphRepository;
import com.algovise.repositories.NodeRepository;
import com.algovise.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.stereotype.Service;

import javax.management.openmbean.KeyAlreadyExistsException;
import java.util.*;

@Service
@AllArgsConstructor
public class GraphService {

    private GraphRepository graphRepository;

    private NodeRepository nodeRepository;

    private EdgeRepository edgeRepository;

    private UserAuthenticationProvider userAuthenticationProvider;

    private UserRepository userRepository;

    public List<Graph> getAllGraphs(String token) {
        return graphRepository.findByUserId(userAuthenticationProvider.getUserIdByToken(token));
    }

    public Graph getGraphById(Long id) {
        return graphRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Graph not found with id: " + id));
    }

    public Graph createGraph(Graph graph, String token) throws IllegalAccessException {
        Long userId = userAuthenticationProvider.getUserIdByToken(token);
        if (graph.getId() != null) {
            if(Objects.equals(graph.getUser().getId(), userId))
            {
                return updateExistingGraph(graph);
            }
            else
            {
                throw new IllegalAccessException("Trying to modify graph of someone else!");
            }

        } else {
            graph.setUser(userRepository.findById(userId).orElseThrow());
            return saveNewGraph(graph);
        }
    }

    private Graph updateExistingGraph(Graph graph) {
        Optional<Graph> existingGraphOpt = graphRepository.findById(graph.getId());
        if (existingGraphOpt.isPresent()) {
            Graph existingGraph = existingGraphOpt.get();
            updateGraphFields(existingGraph, graph);
            return graphRepository.save(existingGraph);
        }
        throw new EntityNotFoundException("Graph with ID " + graph.getId() + " not found");
    }

    private Graph saveNewGraph(Graph graph) {
        graph.setNodes(new HashSet<>());
        graph.setEdges(new HashSet<>());
        return graphRepository.save(graph);
    }

    private void updateGraphFields(Graph existingGraph, Graph newGraph) {
        existingGraph.setName(newGraph.getName());
        existingGraph.setDirected(newGraph.isDirected());
        existingGraph.setWeighted(newGraph.isWeighted());
    }

    public Node addNodeToGraph(Long graphId, Node node, String token) throws IllegalAccessException {
        Long userId = userAuthenticationProvider.getUserIdByToken(token);
        Graph graph = getGraphById(graphId);
        if(!graph.getUser().getId().equals(userId))
        {
            throw new IllegalAccessException("Trying to modify graph of someone else!");
        }
        node.setGraph(graph);

        if (node.getId() != null && (node.getId() > 0)) {
            return updateExistingNode(node);
        } else {
            return saveNewNode(graph, node);
        }
    }

    private Node updateExistingNode(Node node) {
        Optional<Node> existingNodeOpt = nodeRepository.findById(node.getId());
        if (existingNodeOpt.isPresent()) {
            Node existingNode = existingNodeOpt.get();
            updateNodeFields(existingNode, node);
            return nodeRepository.save(existingNode);
        }
        throw new EntityNotFoundException("Node with ID " + node.getId() + " not found");
    }

    private Node saveNewNode(Graph graph, Node node) {
        for(Node existingNode : graph.getNodes())
        {
            if(node.getLabel().equals(existingNode.getLabel()))
            {
                throw new KeyAlreadyExistsException("The node: " + node + " already exists!");
            }
        }
        Node savedNode = nodeRepository.save(node);
        graph.getNodes().add(savedNode);
        graphRepository.save(graph);
        return savedNode;
    }

    private void updateNodeFields(Node existingNode, Node newNode) {
        existingNode.setLabel(newNode.getLabel());
    }

    public Edge addEdgeToGraph(Long graphId, EdgeDto edgeDto) {
        Graph graph = getGraphById(graphId);

        if (edgeDto.getId() > 0) {
            return updateExistingEdge(edgeDto);
        } else {
            return saveNewEdge(graph, edgeDto);
        }
    }

    private Edge updateExistingEdge(EdgeDto edgeDto) {
        Optional<Edge> existingEdgeOpt = edgeRepository.findById(edgeDto.getId());
        if (existingEdgeOpt.isPresent()) {
            Edge existingEdge = existingEdgeOpt.get();
            updateEdgeFields(existingEdge, edgeDto);
            return edgeRepository.save(existingEdge);
        }
        throw new EntityNotFoundException("Edge with ID " + edgeDto.getId() + " not found");
    }

    private Edge saveNewEdge(Graph graph, EdgeDto edgeDto) {
        Edge edge = new Edge();
        edge.setGraph(graph);
        edge.setSource(getNodeById(edgeDto.getSourceId()));
        edge.setTarget(getNodeById(edgeDto.getTargetId()));
        edge.setWeight(edgeDto.getWeight());

        Node sourceNode = getNodeById(edge.getSource().getId());
        Node targetNode = getNodeById(edge.getTarget().getId());

        if (!sourceNode.getGraph().getId().equals(graph.getId()) || !targetNode.getGraph().getId().equals(graph.getId())) {
            throw new IllegalArgumentException("Source or Target nodes do not belong to the specified graph");
        }

        Edge savedEdge = edgeRepository.save(edge);
        graph.getEdges().add(savedEdge);
        graphRepository.save(graph);
        return savedEdge;
    }

    private void updateEdgeFields(Edge existingEdge, EdgeDto edgeDto) {
        existingEdge.setSource(getNodeById(edgeDto.getSourceId()));
        existingEdge.setTarget(getNodeById(edgeDto.getTargetId()));
        existingEdge.setWeight(edgeDto.getWeight());
    }


    private Node getNodeById(Long nodeId) {
        return nodeRepository.findById(nodeId)
                .orElseThrow(() -> new RuntimeException("Node not found with id: " + nodeId));
    }

    public Graph updateGraph(Long id, Graph updatedGraph, String token) throws IllegalAccessException {
        Graph graph = getGraphById(id);
        Long userId = userAuthenticationProvider.getUserIdByToken(token);
        if(!graph.getUser().getId().equals(userId))
        {
            throw new IllegalAccessException("Trying to modify graph of someone else!");
        }
        graph.setDirected(updatedGraph.isDirected());
        graph.setWeighted(updatedGraph.isWeighted());
        graph.setNodes(updatedGraph.getNodes());
        graph.setEdges(updatedGraph.getEdges());
        return graphRepository.save(graph);
    }

    public void deleteGraph(Long id, String token) throws IllegalAccessException {
        Long userId = userAuthenticationProvider.getUserIdByToken(token);
        Graph graph = graphRepository.findById(id).orElseThrow();
        if(!graph.getUser().getId().equals(userId))
        {
            throw new IllegalAccessException("Trying to modify graph of someone else!");
        }
        graphRepository.deleteById(id);
    }

    public Optional<Graph> findGraphById(Long graphId) {
        return graphRepository.findById(graphId);
    }

    public void removeNode(Long nodeId) {
        nodeRepository.deleteById(nodeId);
    }

    public void removeEdges(Set<Long> idsOfEdgesToBeRemoved) {
        for(Long edgeId : idsOfEdgesToBeRemoved)
        {
            edgeRepository.deleteById(edgeId);
        }
    }
}
