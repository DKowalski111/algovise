package com.algovise.services;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.entities.Graph;
import com.algovise.entities.Node;
import com.algovise.entities.User;
import com.algovise.repositories.EdgeRepository;
import com.algovise.repositories.GraphRepository;
import com.algovise.repositories.NodeRepository;
import com.algovise.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.management.openmbean.KeyAlreadyExistsException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GraphServiceTest {

    @Mock
    private GraphRepository graphRepository;

    @Mock
    private NodeRepository nodeRepository;

    @Mock
    private EdgeRepository edgeRepository;

    @Mock
    private UserAuthenticationProvider userAuthenticationProvider;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GraphService graphService;

    private Graph graph;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setName("Test User");

        graph = new Graph();
        graph.setId(1L);
        graph.setName("Test Graph");
        graph.setUser(user);
    }

    @Test
    void shouldGetAllGraphsForUser() {
        when(userAuthenticationProvider.getUserIdByToken("validToken")).thenReturn(1L);
        when(graphRepository.findByUserId(1L)).thenReturn(List.of(graph));

        var graphs = graphService.getAllGraphs("validToken");

        assertEquals(1, graphs.size());
        assertEquals("Test Graph", graphs.iterator().next().getName());
        verify(graphRepository).findByUserId(1L);
    }

    @Test
    void shouldGetGraphById() throws IllegalAccessException {
        when(graphRepository.findById(1L)).thenReturn(Optional.of(graph));
        when(graphService.getGraphById(1L, "dummy-token")).thenReturn(graph);

        Graph retrievedGraph = graphService.getGraphById(1L, "dummy-token");

        assertEquals("Test Graph", retrievedGraph.getName());
        verify(graphRepository).findById(1L);
    }

    @Test
    void shouldCreateNewGraph() throws IllegalAccessException {
        when(userAuthenticationProvider.getUserIdByToken("validToken")).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(graphRepository.save(any(Graph.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Graph newGraph = new Graph();
        newGraph.setName("New Graph");

        Graph savedGraph = graphService.createGraph(newGraph, "validToken");

        assertEquals("New Graph", savedGraph.getName());
        assertEquals(1L, savedGraph.getUser().getId());
        verify(graphRepository).save(any(Graph.class));
    }

    @Test
    void shouldUpdateExistingGraph() throws IllegalAccessException {
        when(graphRepository.findById(1L)).thenReturn(Optional.of(graph));
        when(userAuthenticationProvider.getUserIdByToken("validToken")).thenReturn(1L);
        when(graphRepository.save(any(Graph.class))).thenAnswer(invocation -> invocation.getArgument(0));

        graph.setName("Updated Graph");
        graph.setDirected(true);

        Graph result = graphService.updateGraph(1L, graph, "validToken");

        assertEquals("Updated Graph", result.getName());
        assertTrue(result.isDirected());
        verify(graphRepository).save(graph);
    }

    @Test
    void shouldThrowExceptionWhenUpdatingGraphOfAnotherUser() {
        when(graphRepository.findById(1L)).thenReturn(Optional.of(graph));
        when(userAuthenticationProvider.getUserIdByToken("validToken")).thenReturn(2L);

        Graph updatedGraph = new Graph();
        updatedGraph.setName("Updated Graph");

        assertThrows(IllegalAccessException.class, () -> graphService.updateGraph(1L, updatedGraph, "validToken"));
    }

    @Test
    void shouldAddNodeToGraph() throws IllegalAccessException {
        when(graphRepository.findById(1L)).thenReturn(Optional.of(graph));
        when(userAuthenticationProvider.getUserIdByToken("validToken")).thenReturn(1L);
        when(nodeRepository.save(any(Node.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Node node = new Node();
        node.setLabel("New Node");

        Node savedNode = graphService.addNodeToGraph(1L, node, "validToken");

        assertEquals("New Node", savedNode.getLabel());
        verify(nodeRepository).save(node);
        verify(graphRepository).save(graph);
    }
}
