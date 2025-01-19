package com.algovise.repositories;

import com.algovise.entities.Graph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GraphRepository extends JpaRepository<Graph, Long> {
    List<Graph> findByUserId(Long userId);
}
