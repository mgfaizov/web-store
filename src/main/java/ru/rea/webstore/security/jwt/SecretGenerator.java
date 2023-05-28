package ru.rea.webstore.security.jwt;

// import io.jsonwebtoken.impl.crypto.MacProvider;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
// import java.util.Base64;

/** 
 * class который генерирует secretKey
 */

public class SecretGenerator {
    public static String generateSecret() {
        SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        String secretString = Encoders.BASE64.encode(secretKey.getEncoded());
        // System.out.println("Сгенерированный ключ (class SecretGenerator): " + secretString);
        return secretString;
    }
}