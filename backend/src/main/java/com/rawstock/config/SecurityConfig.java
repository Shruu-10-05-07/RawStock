
// package com.rawstock.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import java.util.List;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http)
//             throws Exception {

//         http
//             .cors(Customizer.withDefaults())
//             .csrf(csrf -> csrf.disable())
// //             .authorizeHttpRequests(auth -> auth
// //                 // Login endpoints must be accessible before login
// //               .requestMatchers(
// //     "/api/admin-auth/login",
// //     "/api/admin-auth/me",
// //     "/api/admin-auth/logout",
// //     "/api/supplier-auth/login"
// // ).permitAll()

// //                 // Supplier request endpoints
// //                 .requestMatchers("/api/supply-requests/supplier/**")
// //                     .hasRole("SUPPLIER")

// //                 // All remaining API endpoints require admin login
// //                 .requestMatchers("/api/**")
// //                     .hasRole("ADMIN")

// //                 // Other requests
// //                 .anyRequest().permitAll()
// //             );
// .authorizeHttpRequests(auth -> auth
//     // Login endpoints
//     .requestMatchers(
//         "/api/admin-auth/login",
//         "/api/admin-auth/me",
//         "/api/admin-auth/logout",
//         "/api/supplier-auth/login"
//     ).permitAll()

//     // Supplier can view their request list
//     .requestMatchers(
//         org.springframework.http.HttpMethod.GET,
//         "/api/supply-requests/supplier/**"
//     ).hasRole("SUPPLIER")

//     // Supplier can accept/reject requests
//     .requestMatchers(
//         org.springframework.http.HttpMethod.PUT,
//         "/api/supply-requests/*/status"
//     ).hasRole("SUPPLIER")

//     // All other API endpoints require admin login
//     .requestMatchers("/api/**").hasRole("ADMIN")

//     .anyRequest().permitAll()
// )

//         return http.build();
//     }

//     @Bean
//     public CorsConfigurationSource corsConfigurationSource() {

//         CorsConfiguration configuration = new CorsConfiguration();

//         // Local frontend development origins
//         configuration.setAllowedOrigins(List.of(
//             "http://localhost:5500",
//             "http://127.0.0.1:5500",
//             "http://localhost:3000",
//             "http://127.0.0.1:3000"
//         ));

//         configuration.setAllowCredentials(true);

//         configuration.setAllowedMethods(List.of(
//             "GET", "POST", "PUT", "DELETE", "OPTIONS"
//         ));

//         configuration.setAllowedHeaders(List.of(
//             "Content-Type", "Accept", "X-Requested-With"
//         ));

//         UrlBasedCorsConfigurationSource source =
//             new UrlBasedCorsConfigurationSource();

//         source.registerCorsConfiguration("/**", configuration);

//         return source;
//     }
// }

// package com.rawstock.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import java.util.List;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http)
//             throws Exception {

//         http
//             .cors(Customizer.withDefaults())
//             .csrf(csrf -> csrf.disable())
//             .authorizeHttpRequests(auth -> auth

//                 // Login endpoints must be accessible before login
//                 .requestMatchers(
//                     "/api/admin-auth/login",
//                     "/api/admin-auth/me",
//                     "/api/admin-auth/logout",
//                     "/api/supplier-auth/login"
//                 ).permitAll()

//                 // Supplier can view their request list
//                 .requestMatchers(
//                     HttpMethod.GET,
//                     "/api/supply-requests/supplier/**"
//                 ).hasRole("SUPPLIER")

//                 // Supplier can accept/reject their assigned requests
//                 .requestMatchers(
//                     HttpMethod.PUT,
//                     "/api/supply-requests/*/supplier-status"
//                 ).hasRole("SUPPLIER")

//                 // All remaining API endpoints require admin login
//                 .requestMatchers("/api/**").hasRole("ADMIN")

//                 // Other requests
//                 .anyRequest().permitAll()
//             );

//         return http.build();
//     }

//     @Bean
//     public CorsConfigurationSource corsConfigurationSource() {

//         CorsConfiguration configuration = new CorsConfiguration();

//         // Local frontend development origins
//         configuration.setAllowedOrigins(List.of(
//             "http://localhost:5500",
//             "http://127.0.0.1:5500",
//             "http://localhost:3000",
//             "http://127.0.0.1:3000"
//         ));

//         configuration.setAllowCredentials(true);

//         configuration.setAllowedMethods(List.of(
//             "GET", "POST", "PUT", "DELETE", "OPTIONS"
//         ));

//         configuration.setAllowedHeaders(List.of(
//             "Content-Type", "Accept", "X-Requested-With"
//         ));

//         UrlBasedCorsConfigurationSource source =
//             new UrlBasedCorsConfigurationSource();

//         source.registerCorsConfiguration("/**", configuration);

//         return source;
//     }
// }

package com.rawstock.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

@Configuration
public class SecurityConfig {

@Bean
public SecurityFilterChain securityFilterChain(
        HttpSecurity http) throws Exception {

    http
        .cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())

        .authorizeHttpRequests(auth -> auth

            // Login endpoints accessible before login
            .requestMatchers(
                "/api/admin-auth/login",
                "/api/admin-auth/me",
                "/api/admin-auth/logout",
                "/api/supplier-auth/login"
            ).permitAll()

            // Supplier can view their own requests
            .requestMatchers(
                HttpMethod.GET,
                "/api/supply-requests/supplier/my-requests"
            ).hasRole("SUPPLIER")

            // Supplier can accept or reject assigned requests
            .requestMatchers(
                HttpMethod.PUT,
                "/api/supply-requests/*/supplier-status"
            ).hasRole("SUPPLIER")

            // Other API endpoints require admin login
            .requestMatchers("/api/**").hasRole("ADMIN")

            .anyRequest().permitAll()
        )

        // Explicitly configure Spring Security logout
        .logout(logout -> logout
            .logoutUrl("/logout")
            .invalidateHttpSession(true)
            .clearAuthentication(true)
            .deleteCookies("JSESSIONID")
            .logoutSuccessHandler((request, response, authentication) ->
                response.setStatus(HttpServletResponse.SC_NO_CONTENT)
            )
        );

    return http.build();
}


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
             "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5501",
    "http://127.0.0.1:5501",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
        ));

        configuration.setAllowCredentials(true);

        configuration.setAllowedMethods(List.of(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of(
            "Content-Type",
            "Accept",
            "X-Requested-With", "Authorization"
        ));

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
