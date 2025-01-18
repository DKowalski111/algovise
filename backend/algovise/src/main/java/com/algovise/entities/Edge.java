package com.algovise.entities;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Edge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "source_id", nullable = false)
    private Node source;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "target_id", nullable = false)
    private Node target;

    private Double weight;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "graph_id", nullable = false)
    private Graph graph;

    @JsonGetter("source_id")
    public Long getSourceId() {
        return source != null ? source.getId() : null;
    }

    @JsonGetter("target_id")
    public Long getTargetId() {
        return target != null ? target.getId() : null;
    }

    @Override
    public String toString()
    {
        return "Edge id: " + id + ", source id: " + source.getId() + ", target id: " + target.getId() + ", weight: " + weight;
    }
}
