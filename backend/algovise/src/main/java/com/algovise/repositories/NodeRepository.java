package com.algovise.repositories;

import com.algovise.entities.Node;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NodeRepository extends JpaRepository<Node, Long> {

    @Modifying
    @Query("DELETE FROM Node n WHERE n.id = :id")
    void deleteById(@Param("id") Long id);

}
