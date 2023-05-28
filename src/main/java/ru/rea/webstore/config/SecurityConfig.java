package ru.rea.webstore.config;

// import java.util.Arrays;

// import org.springframework.boot.autoconfigure.h2.H2ConsoleProperties;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.WebSecurityConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.web.bind.annotation.RequestMethod;
// import org.springframework.web.cors.CorsConfiguration;

import ru.rea.webstore.security.jwt.JwtConfigurer;

// import ru.rea.springsecurityapp.security.jwt.JwtConfigurer;
// import ru.rea.springsecurityapp.security.jwt.JwtTokenProvider;
// import ru.rea.springsecurityapp.services.UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebSecurityConfigurer<WebSecurity> {

    private final JwtConfigurer jwtConfigurer;
    // @Autowired
    public SecurityConfig(JwtConfigurer jwtConfigurer) {
        this.jwtConfigurer = jwtConfigurer;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        // Настройка CORS
        /* .cors(cors -> {
            cors
                .configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(Arrays.asList("http://localhost:8080"));
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
                    // config.setAllowedMethods(Arrays.asList("*"));
                    return config;
                });
            }) */
            .csrf(csrf -> csrf.disable())
            // .headers().disable()
            // не будет создаваться сессия для каждого запроса
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(authorize -> authorize
                // разрешить все запросы
                .requestMatchers("/*").permitAll()
                // .requestMatchers(HttpMethod.GET, "/").permitAll()
                .requestMatchers("/users/submit", "/auth/login", "/products/all").permitAll()

                // Разрешить статические ресурсы
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                // .requestMatchers("/css/**", "/js/**", "/svg/**", "/images/**").permitAll()

                // доступ только для администраторов, имеющих право на запись
                // .requestMatchers(HttpMethod.PUT, "/users/all", "/users/{id}").hasAuthority("admin:write")
                // .requestMatchers("/users/{id}").hasAnyAuthority("user:read", "admin:read", "admin:write")
                
                // требовать аутентификацию для всех других запросов
                // .requestMatchers("/users/{id}").hasAnyAuthority("user:read", "admin:read")
                // .requestMatchers("/users", "/users/all").hasAuthority("admin:read")
                // .requestMatchers("/users/submit", "/users/{id}").hasAnyAuthority("user:read", "admin:read")

                // .requestMatchers("/users/submit", "/users/{id}", "/users/all", "/users").hasAnyAuthority("admin:read", "admin:write")
                // .requestMatchers("/users/submit", "/users/{id}").hasAuthority("user:read")

                // .requestMatchers(PathRequest.toH2Console()).permitAll()
                // .requestMatchers("/users/{id}").hasAnyRole("USER", "ADMIN")
                // .requestMatchers("/users", "/users/all").hasRole("ADMIN")
                
                // .requestMatchers("/users/{id}").hasAnyAuthority("user:read", "admin:read", "admin:write")
                // RequestMethod.GET
                // .hasRole("USER") // .hasAuthority("USER_READ")
                // .requestMatchers(HttpMethod.GET, "/users/{id}").hasAnyRole("USER", "ADMIN")
                // .requestMatchers(HttpMethod.PUT, "/users/{id}").hasRole("ADMIN")

                // .requestMatchers("/users", "/users/**", "/users/{id}", "/users/all").hasAnyRole("ROLE_USER", "ROLE_ADMIN")
                // .requestMatchers("/users", "/users/**", "/users/{id}", "/users/all").hasAnyAuthority("user:read", "admin:read")


                // .requestMatchers("/users", "/users/**", "/users/{id}", "/users/all").hasAnyAuthority("user:read", "admin:read", "admin:write")
                .anyRequest()
                .authenticated()
            )
            // .formLogin(form -> form.and()) 
            // добавить фильтр для проверки JWT-токена
            .apply(jwtConfigurer); 
        return http.build();
    }


    /* @Bean
    public H2ConsoleProperties h2ConsoleProperties() {
        return new H2ConsoleProperties();
    } */
    
    /* @Bean
    protected PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
        // return new BCryptPasswordEncoder(12);
    } */
    @Bean
    protected BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /* @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    } */

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /* @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return new ProviderManager(Arrays.asList(authenticationProvider()));
    } */

    
    @Override
    public void configure(WebSecurity builder) throws Exception {
        // throw new UnsupportedOperationException("Unimplemented method 'configure'");
    }

    @Override
    public void init(WebSecurity builder) throws Exception {
        // throw new UnsupportedOperationException("Unimplemented method 'init'");
    }

}
