package com.algovise.repositories;

import com.algovise.entities.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Transactional
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveAndRetrieveUser() {
        User user = new User();
        user.setName("TestUser");
        user.setPassword("password");
        user.setEmail("testuser@example.com");
        user.setRole("USER");
        userRepository.save(user);

        Optional<User> retrievedUser = userRepository.findById(user.getId());

        assertTrue(retrievedUser.isPresent());
        assertEquals("TestUser", retrievedUser.get().getName());
        assertEquals("testuser@example.com", retrievedUser.get().getEmail());
    }

    @Test
    void shouldFindUserByName() {
        User user = new User();
        user.setName("UniqueUser");
        user.setPassword("securepassword");
        user.setEmail("unique@example.com");
        user.setRole("ADMIN");
        userRepository.save(user);

        Optional<User> retrievedUser = userRepository.findByName("UniqueUser");

        assertTrue(retrievedUser.isPresent());
        assertEquals("UniqueUser", retrievedUser.get().getName());
    }

    @Test
    void shouldReturnEmptyOptionalForNonExistentUser() {
        Optional<User> retrievedUser = userRepository.findByName("NonExistentUser");

        assertFalse(retrievedUser.isPresent());
    }

    @Test
    void shouldDeleteUser() {
        User user = new User();
        user.setName("UserToDelete");
        user.setPassword("password123");
        user.setEmail("delete@example.com");
        user.setRole("USER");
        userRepository.save(user);

        assertTrue(userRepository.findById(user.getId()).isPresent());

        userRepository.deleteById(user.getId());

        Optional<User> deletedUser = userRepository.findById(user.getId());
        assertFalse(deletedUser.isPresent());
    }
}
