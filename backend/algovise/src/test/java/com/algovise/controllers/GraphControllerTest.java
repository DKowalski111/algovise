package com.algovise.controllers;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.dtos.EdgeDto;
import com.algovise.entities.Edge;
import com.algovise.entities.Graph;
import com.algovise.entities.Node;
import com.algovise.services.GraphService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class GraphControllerTest {

    @Mock
    private GraphService graphService;

    @Mock
    private UserAuthenticationProvider userAuthenticationProvider;

    @InjectMocks
    private GraphController graphController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(graphController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void shouldGetAllGraphs() throws Exception {
        Graph graph = new Graph();
        graph.setId(1L);
        graph.setName("Test Graph");

        when(userAuthenticationProvider.getUserIdByToken("dummy-token")).thenReturn(1L);
        when(graphService.getAllGraphs("dummy-token")).thenReturn(List.of(graph));

        mockMvc.perform(get("/graphs")
                        .header("Authorization", "Bearer dummy-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Test Graph"));

        verify(graphService).getAllGraphs("dummy-token");
    }

    @Test
    void shouldGetGraphById() throws Exception {
        Graph graph = new Graph();
        graph.setId(1L);
        graph.setName("Test Graph");

        when(graphService.getGraphById(1L, "dummy-token")).thenReturn(graph);

        mockMvc.perform(get("/graphs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Test Graph"));

        verify(graphService).getGraphById(1L, "dummy-token");
    }

    @Test
    void shouldCreateGraph() throws Exception {
        Graph graph = new Graph();
        graph.setName("New Graph");

        Graph createdGraph = new Graph();
        createdGraph.setId(1L);
        createdGraph.setName("New Graph");

        when(userAuthenticationProvider.getUserIdByToken("dummy-token")).thenReturn(1L);
        when(graphService.createGraph(any(Graph.class), eq("dummy-token"))).thenReturn(createdGraph);

        mockMvc.perform(post("/graphs")
                        .header("Authorization", "Bearer dummy-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(graph)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("New Graph"));

        verify(graphService).createGraph(any(Graph.class), eq("dummy-token"));
    }

    @Test
    void shouldAddNodesToGraph() throws Exception {
        Node node1 = new Node();
        node1.setId(1L);
        node1.setLabel("Node 1");

        Node node2 = new Node();
        node2.setId(2L);
        node2.setLabel("Node 2");

        when(userAuthenticationProvider.getUserIdByToken("dummy-token")).thenReturn(1L);
        when(graphService.addNodeToGraph(eq(1L), any(Node.class), eq("dummy-token")))
                .thenReturn(node1)
                .thenReturn(node2);

        mockMvc.perform(post("/graphs/1/nodes")
                        .header("Authorization", "Bearer dummy-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new Node[]{node1, node2})))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].label").value("Node 1"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].label").value("Node 2"));

        verify(graphService, times(2)).addNodeToGraph(eq(1L), any(Node.class), eq("dummy-token"));
    }

    @Test
    void shouldAddEdgesToGraph() throws Exception {
        EdgeDto edgeDto1 = new EdgeDto(1L, 1L, 2L, 10.0);
        EdgeDto edgeDto2 = new EdgeDto(2L, 2L, 3L, 15.0);

        Edge edge1 = new Edge();
        edge1.setId(1L);
        edge1.setWeight(10.0);

        Edge edge2 = new Edge();
        edge2.setId(2L);
        edge2.setWeight(15.0);

        Node node1 = new Node();
        node1.setId(1L);
        Node node2 = new Node();
        node2.setId(2L);
        Node node3 = new Node();
        node3.setId(3L);

        Graph graph = new Graph();
        graph.setId(1L);
        graph.setNodes(Set.of(node1, node2, node3));
        graph.setEdges(Set.of(edge1, edge2));
        graph.setUser(new com.algovise.entities.User());
        graph.getUser().setId(1L);

        when(userAuthenticationProvider.getUserIdByToken("dummy-token")).thenReturn(1L);
        when(graphService.findGraphById(1L)).thenReturn(Optional.of(graph));
        when(graphService.addEdgeToGraph(eq(1L), any(EdgeDto.class), "dummy-token"))
                .thenReturn(edge1)
                .thenReturn(edge2);

        mockMvc.perform(post("/graphs/1/edges")
                        .header("Authorization", "Bearer dummy-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new EdgeDto[]{edgeDto1, edgeDto2})))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].weight").value(10.0))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].weight").value(15.0));

        verify(graphService, times(2)).addEdgeToGraph(eq(1L), any(EdgeDto.class), "dummy-token");
        verify(graphService).findGraphById(1L);
        verify(userAuthenticationProvider).getUserIdByToken("dummy-token");
    }


    @Test
    void shouldDeleteGraph() throws Exception {
        when(userAuthenticationProvider.getUserIdByToken("dummy-token")).thenReturn(1L);
        doNothing().when(graphService).deleteGraph(1L, "dummy-token");

        mockMvc.perform(delete("/graphs/1")
                        .header("Authorization", "Bearer dummy-token"))
                .andExpect(status().isNoContent());

        verify(graphService).deleteGraph(1L, "dummy-token");
    }
}
