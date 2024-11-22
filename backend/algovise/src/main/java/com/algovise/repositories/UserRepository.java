package com.algovise.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.algovise.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>
{
    Optional<User> findByName(String name);
}
