
package com.rawstock.repository;

import com.rawstock.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SupplierRepository
        extends JpaRepository<Supplier, Integer> {

    Optional<Supplier> findByUsername(String username);
}
