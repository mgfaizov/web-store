package ru.rea.webstore.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
// import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.security.Keys;
import java.lang.IllegalArgumentException;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

// import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
// import ru.rea.webstore.models.User;
// import ru.rea.webstore.repositories.UserRepository;
// import ru.rea.webstore.services.UserService;

// import java.nio.charset.StandardCharsets;
import java.security.Key;
// import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
// import java.util.function.Function;
// import java.util.Objects;

import javax.crypto.spec.SecretKeySpec;

// import javax.crypto.SecretKey;
// import javax.crypto.spec.SecretKeySpec;

/** 
 * Этот компонент отвечает за генерацию JWT токена 
 * при успешной аутентификации пользователя 
 * и проверку подлинности токена при каждом запросе.
 */

@Component
public class JwtTokenProvider { // JwtUtil
    
    // Информация о пользователе
    private final UserDetailsService userDetailsService;

    /* @Value("${jwt.secret}")
    public final String secretKey;
    @Value("${jwt.header}")
    public String autorizationHeader;
    @Value("${jwt.expiration}")
    public long validityMiliSeconds; */

    private final String secretKey;
    // Имя заголовка HTTP, в котором передается токен JWT.
    private final String authorizationHeader;
    // Длительность действия токена
    private final long validityMilliseconds;
    // private final BCryptPasswordEncoder passwordEncoder;
    

    public JwtTokenProvider(
        @Qualifier("userDetailsServiceImpl") UserDetailsService userDetailsService,
        // @Value("${jwt.secret}") String secretKey,
        @Value("${jwt.header}") String authorizationHeader,
        @Value("${jwt.expiration}") long validitySeconds
    ) {
        this.userDetailsService = userDetailsService;
        // генерация случайного секрета при создании объекта JwtTokenProvider
        this.secretKey = SecretGenerator.generateSecret(); 
        // this.secretKey = secretKey; 
        this.authorizationHeader = authorizationHeader;
        // Переводим validitySeconds в миллисекунды
        this.validityMilliseconds = validitySeconds * 1000;
    }

    // Метод для создания токена JWT
    public String createToken(Long id, String username, String role) {
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("id", id);
        claims.put("role", role);
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityMilliseconds);

        // Преобразуем строковое представление секретного ключа в массив байтов
        byte[] secretBytes = Base64.getDecoder().decode(secretKey);
        // System.out.println("Декодированный ключ: " + secretBytes);
        // создает объект SecretKey на основе декодированного секретного ключа
        Key key = new SecretKeySpec(secretBytes, SignatureAlgorithm.HS256.getJcaName());
        // System.out.println("Сгенерированный ключ (createToken): " + key);

        // Токен создается с помощью метода Jwts.builder()
        String token = Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(validity)
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
        // System.out.println("Сгенерированный токен: " + token);
        
        return token;
    }

    
    // Метод для валидации токена
    // проверяет подпись токена и проверяет его срок действия
    public boolean validateToken(String token) {
        try {
            // Декодируем секретный ключ
            byte[] secretBytes = Base64.getDecoder().decode(secretKey);
            Key key = new SecretKeySpec(secretBytes, SignatureAlgorithm.HS256.getJcaName());
            // System.out.println("Сгенерированный ключ (validateToken): " + key);
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            // Проверяем что токен не исек
            return !claimsJws.getBody().getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            // код статуса HTTP UNAUTHORIZED (401)
            throw new JwtAuthenticationException(
                // "Срок действия токена JWT истек или он недействителен" 
                "JwtTokenProvider.message: " + e.getMessage(), HttpStatus.UNAUTHORIZED
            );
        }
    }

    //  Метод для получения аутентификации и сохранения ключа токена
    public Authentication getAuthentication(String token) {
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(getUserName(token));
        // User user = (User) userDetails;
        // сохраняем ключ
        // userService.saveTokenKey(user.getId(), secretKey);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    // Метод для получения UserName
    public String getUserName(String token) {
        byte[] secretBytes = Base64.getDecoder().decode(secretKey);
        Key key = new SecretKeySpec(secretBytes, SignatureAlgorithm.HS256.getJcaName());
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }

    // Метод получения токена из запроса
    public String resolveToken(HttpServletRequest request) {
        return request.getHeader(authorizationHeader);
    }

}
