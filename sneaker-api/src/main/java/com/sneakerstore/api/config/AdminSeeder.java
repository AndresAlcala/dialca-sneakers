package com.sneakerstore.api.config;

import com.sneakerstore.api.model.Role;
import com.sneakerstore.api.model.User;
import com.sneakerstore.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Este componente se ejecuta automáticamente cada vez que Spring Boot arranca.
 * Lo usamos para "sembrar" (inyectar) datos obligatorios en la base de datos, 
 * como nuestra cuenta secreta de Administrador.
 */
@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        String adminEmail = "admin@dialca.com";

        // 1. Verificamos si el administrador ya existe en la base de datos
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            
            // 2. Si no existe, lo creamos forzando el rol ADMIN
            User adminUser = User.builder()
                    .firstName("Administrador")
                    .lastName("Dialca")
                    .email(adminEmail)
                    // Encriptamos la contraseña secreta
                    .password(passwordEncoder.encode("dialca2026")) 
                    .role(Role.ADMIN) // <- ESTE ES EL ROL CLAVE PARA CREAR DROPS
                    .build();

            // 3. Lo guardamos en la base de datos
            userRepository.save(adminUser);
            
            System.out.println("==================================================");
            System.out.println("CUENTA DE ADMINISTRADOR CREADA AUTOMÁTICAMENTE:");
            System.out.println("Email: " + adminEmail);
            System.out.println("Password: dialca2026");
            System.out.println("==================================================");
        } else {
            System.out.println("La cuenta de administrador ya existe. Saltando creación.");
        }
    }
}
