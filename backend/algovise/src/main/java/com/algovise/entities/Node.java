package com.algovise.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Node {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;

    @ManyToOne
    @JoinColumn(name = "graph_id", nullable = false)
    private Graph graph;
}
