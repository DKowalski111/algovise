package com.algovise.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Edge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "source_id", nullable = false)
    private Node source;

    @ManyToOne
    @JoinColumn(name = "target_id", nullable = false)
    private Node target;

    private Double weight; // Nullable if the graph is unweighted

    @ManyToOne
    @JoinColumn(name = "graph_id", nullable = false)
    private Graph graph;
}
