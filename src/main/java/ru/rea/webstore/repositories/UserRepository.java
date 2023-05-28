package ru.rea.webstore.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

import ru.rea.webstore.models.user.User;

/**  
 * Интерфейс UserRepository является репозиторием для работы с данными в таблице пользователей. 
 * Он расширяет интерфейс JpaRepository, который предоставляет базовые операции над сущностями JPA.
*/

// @Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    /* static Optional<User> findByEmail(String email) {
        throw new UnsupportedOperationException("Unimplemented method 'findByEmail'");
    } */
}
