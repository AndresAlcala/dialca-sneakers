package com.sneakerstore.api.controller.auth;

import com.sneakerstore.api.model.Role;
import com.sneakerstore.api.model.User;
import com.sneakerstore.api.repository.UserRepository;
import com.sneakerstore.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    // Repositorio para buscar y guardar usuarios en la base de datos
    private final UserRepository repository;
    
    // Herramienta de Spring Security para encriptar contraseñas (BCrypt)
    private final PasswordEncoder passwordEncoder;
    
    // Nuestro servicio personalizado que genera los tokens JWT
    private final JwtService jwtService;
    
    // Gestor de autenticación de Spring Security (verifica que el email y pass coincidan)
    private final AuthenticationManager authenticationManager;

    /**
     * Método para registrar un NUEVO usuario público.
     * Cualquier persona que se registre en la tienda pasará por aquí.
     */
    public AuthenticationResponse register(RegisterRequest request) {
        // 1. Construimos el usuario con los datos que llegaron del formulario
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                // ENCRIPTAMOS la contraseña antes de guardarla. ¡Nunca guardar en texto plano!
                .password(passwordEncoder.encode(request.getPassword()))
                // MUY IMPORTANTE: Todos los registros públicos son CLIENTES normales (CUSTOMER)
                // Nadie puede registrarse como ADMIN desde internet.
                .role(Role.CUSTOMER) 
                .build();
                
        // 2. Guardamos el usuario en la base de datos de PostgreSQL
        repository.save(user);
        
        // 3. Generamos un token JWT para que el usuario inicie sesión inmediatamente
        var jwtToken = jwtService.generateToken(user);
        
        // 4. Devolvemos el token y el rol al frontend
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .build();
    }

    /**
     * Método para iniciar sesión (Login).
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // 1. Spring Security revisa si el email y la contraseña son correctos.
        // Si la contraseña está mal, este método lanzará un error automáticamente.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        // 2. Si llegamos aquí, las credenciales son válidas. Buscamos al usuario en la BD.
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
                
        // 3. Generamos un nuevo token JWT para su sesión
        var jwtToken = jwtService.generateToken(user);
        
        // 4. Devolvemos el token y su rol al frontend (para saber si mostrar el panel Admin o no)
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .build();
    }
}
