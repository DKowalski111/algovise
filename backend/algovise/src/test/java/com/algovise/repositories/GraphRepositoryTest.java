package com.algovise.repositories;

import com.algovise.entities.Graph;
import com.algovise.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Transactional
class GraphRepositoryTest {

    @Autowired
    private GraphRepository graphRepository;

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setName("Test User");
        user.setPassword("password");
        user.setEmail("test@example.com");
        user.setRole("USER");
        userRepository.save(user);
    }

    @Test
    void shouldFindGraphsByUserId() {
        Graph graph1 = new Graph();
        graph1.setName("Graph 1");
        graph1.setDirected(true);
        graph1.setWeighted(false);
        graph1.setUser(user);
        graphRepository.save(graph1);

        Graph graph2 = new Graph();
        graph2.setName("Graph 2");
        graph2.setDirected(false);
        graph2.setWeighted(true);
        graph2.setUser(user);
        graphRepository.save(graph2);

        List<Graph> graphs = graphRepository.findByUserId(user.getId());

        assertEquals(2, graphs.size());
        assertTrue(graphs.stream().anyMatch(graph -> graph.getName().equals("Graph 1")));
        assertTrue(graphs.stream().anyMatch(graph -> graph.getName().equals("Graph 2")));
    }

    @Test
    void shouldReturnEmptyListIfNoGraphsForUser() {
        User anotherUser = new User();
        anotherUser.setName("Another User");
        anotherUser.setPassword("password123");
        anotherUser.setEmail("another@example.com");
        anotherUser.setRole("ADMIN");
        userRepository.save(anotherUser);

        List<Graph> graphs = graphRepository.findByUserId(anotherUser.getId());

        assertTrue(graphs.isEmpty());
    }
}
