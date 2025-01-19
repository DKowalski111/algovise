package com.algovise.repositories;

import com.algovise.entities.Edge;
import com.algovise.entities.Graph;
import com.algovise.entities.Node;
import com.algovise.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Transactional
class EdgeRepositoryTest {

    @Autowired
    private EdgeRepository edgeRepository;

    @Autowired
    private NodeRepository nodeRepository;

    @Autowired
    private GraphRepository graphRepository;

    @Autowired
    private UserRepository userRepository;

    private Graph graph;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setName("Test User");
        user.setPassword("password");
        user.setEmail("test@example.com");
        user.setRole("USER");
        userRepository.save(user);

        graph = new Graph();
        graph.setName("Test Graph");
        graph.setDirected(false);
        graph.setWeighted(true);
        graph.setUser(user);
        graphRepository.save(graph);
    }

    @Test
    void shouldSaveAndRetrieveEdge() {
        Node source = new Node();
        source.setLabel("Source Node");
        source.setGraph(graph);
        nodeRepository.save(source);

        Node target = new Node();
        target.setLabel("Target Node");
        target.setGraph(graph);
        nodeRepository.save(target);

        Edge edge = new Edge();
        edge.setSource(source);
        edge.setTarget(target);
        edge.setWeight(2.5);
        edge.setGraph(graph);
        edgeRepository.save(edge);

        Optional<Edge> retrievedEdge = edgeRepository.findById(edge.getId());
        assertTrue(retrievedEdge.isPresent());
        assertEquals(2.5, retrievedEdge.get().getWeight());
        assertEquals(source.getId(), retrievedEdge.get().getSource().getId());
        assertEquals(target.getId(), retrievedEdge.get().getTarget().getId());
    }

    @Test
    void shouldDeleteEdge() {
        Node source = new Node();
        source.setLabel("Source Node");
        source.setGraph(graph);
        nodeRepository.save(source);

        Node target = new Node();
        target.setLabel("Target Node");
        target.setGraph(graph);
        nodeRepository.save(target);

        Edge edge = new Edge();
        edge.setSource(source);
        edge.setTarget(target);
        edge.setGraph(graph);
        edge.setWeight(3.5);
        edgeRepository.save(edge);

        edgeRepository.delete(edge);

        Optional<Edge> deletedEdge = edgeRepository.findById(edge.getId());
        assertFalse(deletedEdge.isPresent());
    }
}

