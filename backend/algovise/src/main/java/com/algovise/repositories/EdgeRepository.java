package com.algovise.repositories;

import com.algovise.entities.Edge;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EdgeRepository extends JpaRepository<Edge, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM Edge e WHERE e.id = :id")
    void deleteById(@Param("id") Long id);
}
