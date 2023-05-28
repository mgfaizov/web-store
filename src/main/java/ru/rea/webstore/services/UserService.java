package ru.rea.webstore.services;

import java.util.List;

// import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import ru.rea.webstore.models.user.UpdateUserDTO;
import ru.rea.webstore.models.user.User;
import ru.rea.webstore.repositories.UserRepository;

/** 
 * Класс UserService представляет сервис, который содержит бизнес-логику для работы с пользователями. 
 * Он использует UserRepository для выполнения операций над пользователями.
 */

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {
        // return userRepository.save(user);
        // Шифрование пароля
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // System.out.println("password: " + user.getPassword());
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateUserById(Long id, UpdateUserDTO updateUserDTO) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            // throw new EntityNotFoundException("User with id " + id + " not found");
        }
        // Обновление полей пользователя
        existingUser.setFirstName(updateUserDTO.getFirstName());
        existingUser.setLastName(updateUserDTO.getLastName());
        existingUser.setAge(updateUserDTO.getAge());
        existingUser.setEmail(updateUserDTO.getEmail());
        existingUser.setPhoneNumber(updateUserDTO.getPhoneNumber());
        existingUser.setRole(updateUserDTO.getRole());
        existingUser.setStatus(updateUserDTO.getStatus());

        return userRepository.save(existingUser);
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    // записываем токен
   /*  public void saveTokenKey(Long userId, String tokenKey) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new UsernameNotFoundException("Пользователь с идентификатором " + userId + " не найден");
        }
        user.setTokenKey(tokenKey);
        userRepository.save(user);
    }
    public String getTokenKey(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new UsernameNotFoundException("Пользователь с идентификатором " + userId + " не найден");
        }
        return user.getTokenKey();
    } */
}