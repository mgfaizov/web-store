package ru.rea.webstore.security.jwt;

import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

/** 
 * Этот компонент используется для настройки Spring Security, 
 * чтобы использовать JwtTokenFilter для проверки JWT токена 
 * при каждом запросе на защищенный ресурс.
 */

@Component
public class JwtConfigurer extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {

    private final JwtTokenFilter jwtTokenFilter;


    public JwtConfigurer(JwtTokenFilter jwtTokenProvider) {
        this.jwtTokenFilter = jwtTokenProvider;
    }


    @Override
    public void configure(HttpSecurity httpSecurity) {
        httpSecurity.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
