package com.algovise.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
public class Graph {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private boolean directed;
    private boolean weighted;

    @OneToMany(mappedBy = "graph", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Node> nodes = new HashSet<>();

    @OneToMany(mappedBy = "graph", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Edge> edges = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Graph graph = (Graph) o;
        return id != null && id.equals(graph.id); // Only compare IDs
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0; // Use ID for hashCode
    }

    @Override
    public String toString()
    {
        return "Graph id: " + id + ", name: " + name + ", directed: " + directed + ", weighted: " + weighted;
    }
}
