
package com.rawstock.controller;

import com.rawstock.model.Supplier;
import com.rawstock.repository.SupplierRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
// @CrossOrigin(origins = "*")
public class SupplierController {

    private final SupplierRepository supplierRepository;
    private final PasswordEncoder passwordEncoder;

    public SupplierController(
            SupplierRepository supplierRepository,
            PasswordEncoder passwordEncoder) {
        this.supplierRepository = supplierRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Supplier> addSupplier(
            @RequestBody Supplier supplier) {

        if (supplier.getPassword() != null
                && !supplier.getPassword().isBlank()) {
            supplier.setPassword(
                passwordEncoder.encode(supplier.getPassword())
            );
        }

        Supplier saved = supplierRepository.save(supplier);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(
            @PathVariable int id,
            @RequestBody Supplier updatedSupplier) {

        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        Supplier supplier = supplierRepository.findById(id).get();

        supplier.setUsername(updatedSupplier.getUsername());
        supplier.setSupplierName(updatedSupplier.getSupplierName());
        supplier.setPhone(updatedSupplier.getPhone());
        supplier.setEmail(updatedSupplier.getEmail());
        supplier.setAddress(updatedSupplier.getAddress());

        // Change the password only when a new one is supplied.
        if (updatedSupplier.getPassword() != null
                && !updatedSupplier.getPassword().isBlank()) {
            supplier.setPassword(
                passwordEncoder.encode(updatedSupplier.getPassword())
            );
        }

        Supplier saved = supplierRepository.save(supplier);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable int id) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        supplierRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
