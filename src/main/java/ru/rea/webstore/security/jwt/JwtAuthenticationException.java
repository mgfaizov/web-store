package ru.rea.webstore.security.jwt;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;

import lombok.Getter;

@Getter
public class JwtAuthenticationException extends AuthenticationException {
    private HttpStatus httpStatus;
    /* public JwtAuthenticationException(String msq, Throwable t) {
        super(msq, t);
    } */
    public JwtAuthenticationException(String msq) {
        super(msq);
    }
    public JwtAuthenticationException(String msq, HttpStatus httpStatus) {
        super(msq);
        this.httpStatus = httpStatus;
    }
}
