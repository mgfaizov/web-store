package ru.rea.webstore.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.AuthenticationException;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
// import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import ru.rea.webstore.models.user.User;
import ru.rea.webstore.repositories.UserRepository;
import ru.rea.webstore.security.jwt.JwtTokenProvider;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private JwtTokenProvider jwtTokenProvider;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
            JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@Valid @RequestBody AuthenticationRequestDTO request,
            BindingResult bindingResult) {
        // проверяем, есть ли ошибки в запросе
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        } else {
            try {
                // Debug print to check
                // UsernamePasswordAuthenticationToken authRequest = new
                // UsernamePasswordAuthenticationToken(request.getEmail(),
                // request.getPassword());
                // System.out.println("Username: " + authRequest.getName());
                // System.out.println("Password: " + authRequest.getCredentials());

                // аутентифицируем пользователя
                authenticationManager
                        .authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
                User user = userRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() -> new UsernameNotFoundException(
                                "AuthController.message: Пользователь не существует"));

                // Debug print to check
                // System.out.println("Пароль из запроса: " + request.getPassword());
                // System.out.println("Пароль из базы данных: " + user.getPassword());

                // Если пользователь найден, создаем токен JWT
                String token = jwtTokenProvider.createToken(user.getId(), request.getEmail(), user.getRole().name());
                Map<Object, Object> response = new HashMap<>();
                response.put("subject", request.getEmail());
                response.put("token", token);
                response.put("message", "AuthController.message: Вы успешно авторизовались");
                return ResponseEntity.ok(response);
            } catch (AuthenticationException e) {
                // return new ResponseEntity<>("Произошла ошибка аутентификации: " +
                // e.getMessage(), HttpStatus.FORBIDDEN);
                Map<Object, Object> response = new HashMap<>();
                response.put("message", "AuthController.message: Ошибка аутентификации: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        }
    }

    /* @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextLogoutHandler securityContextLogoutHandler = new SecurityContextLogoutHandler();
        securityContextLogoutHandler.logout(request, response, null);
    } */

    @PostMapping("/logout")
    public ResponseEntity<Map<Object, Object>> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            SecurityContextLogoutHandler securityContextLogoutHandler = new SecurityContextLogoutHandler();
            securityContextLogoutHandler.logout(request, response, null);
            Map<Object, Object> responseOut = new HashMap<>();
            responseOut.put("message", "Вы успешно вышли из системы");
            return ResponseEntity.ok(responseOut);
        } catch (Exception e) {
            Map<Object, Object> responseOut = new HashMap<>();
            responseOut.put("message", "Произошла ошибка при выходе из системы: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseOut);
        }
    }

    /*
     * @GetMapping("/validate")
     * public ResponseEntity<?> validateToken (@RequestParam String
     * token, @AuthenticationPrincipal User user) {
     * boolean isTokenValid = jwtUtil.validateToken(token, user);
     * return ResponseEntity.ok(isTokenValid)
     * }
     */
}
