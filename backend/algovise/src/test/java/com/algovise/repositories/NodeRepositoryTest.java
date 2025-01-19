package com.algovise.repositories;

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
class NodeRepositoryTest {

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
    void shouldSaveAndRetrieveNode() {
        Node node = new Node();
        node.setLabel("Test Node");
        node.setGraph(graph);
        nodeRepository.save(node);

        Optional<Node> retrievedNode = nodeRepository.findById(node.getId());

        assertTrue(retrievedNode.isPresent());
        assertEquals("Test Node", retrievedNode.get().getLabel());
        assertEquals(graph.getId(), retrievedNode.get().getGraph().getId());
    }

    @Test
    void shouldDeleteNode() {
        Node node = new Node();
        node.setLabel("Node to Delete");
        node.setGraph(graph);
        nodeRepository.save(node);

        assertTrue(nodeRepository.findById(node.getId()).isPresent());

        nodeRepository.delete(node);

        Optional<Node> deletedNode = nodeRepository.findById(node.getId());
        assertFalse(deletedNode.isPresent());
    }
}
