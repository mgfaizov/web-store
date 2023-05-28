package ru.rea.webstore.security;

import ru.rea.webstore.models.user.User;
import ru.rea.webstore.repositories.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/** 
 * Этот компонент предоставляет пользовательские данные, 
 * необходимые для аутентификации пользователя, 
 * такие как его имя пользователя, пароль и роли. 
 * Он реализует интерфейс UserDetailsService, 
 * который используется в JwtTokenProvider 
 * для получения информации о пользователе.
 */

@Service("userDetailsServiceImpl")
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    // @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("userDetailsService.message: Пользователь с логин: " + email + " не найден"));
        return SecurityUser.fromUser(user);
    }
}
