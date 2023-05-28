package ru.rea.webstore.controllers;

import ru.rea.webstore.models.user.UpdateUserDTO;
import ru.rea.webstore.models.user.User;
import ru.rea.webstore.services.UserService;

import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
// import java.util.stream.Collectors;
// import java.util.stream.Stream;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> createUser(@Valid @RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        } else {
            User savedUser = userService.createUser(user);
            return ResponseEntity.ok(savedUser);
        }
    }
    // GET-запрос для получения пользователя по id
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
    // GET-запрос для получения всех пользователей
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> userList = userService.getAllUser();
        return ResponseEntity.ok(userList);
    }
    /* public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String authorizationHeader) {
        // здесь вы можете проверить и использовать значение токена
        System.out.println("Authorization Header: " + authorizationHeader);
        List<User> userList = userService.getAllUser();
        return ResponseEntity.ok(userList);
    } */


    // PUT-запрос для обновления пользователя по id
    @PostMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") Long id, @Valid @RequestBody UpdateUserDTO updateUserDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        } else {
            User updatedUser = userService.updateUserById(id, updateUserDTO);
            return ResponseEntity.ok(updatedUser);
        }
    }
    // DELETE-запрос для удаления пользователя по id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok().build();
    }
}