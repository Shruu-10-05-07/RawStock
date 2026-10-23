package com.rawstock.controller;

import com.rawstock.model.Material;
import com.rawstock.service.MaterialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }


    // ==========================================
    // GET ALL MATERIALS
    // ==========================================

    @GetMapping
    public List<Material> getAllMaterials() {
        return materialService.getAllMaterials();
    }


    // ==========================================
    // SMART SEARCH
    // Searches:
    // Material Code
    // Material Name
    // Category
    // Location
    // ==========================================

    @GetMapping("/search")
    public List<Material> searchMaterials(
            @RequestParam String keyword) {

        return materialService.searchMaterials(keyword);
    }


    // ==========================================
    // GET MATERIAL BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Material> getMaterialById(
            @PathVariable int id) {

        return materialService.getMaterialById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // ==========================================
    // ADD MATERIAL
    // ==========================================

    @PostMapping
    public ResponseEntity<Material> addMaterial(
            @RequestBody Material material) {

        Material savedMaterial =
                materialService.addMaterial(material);

        return ResponseEntity.ok(savedMaterial);
    }


    // ==========================================
    // UPDATE MATERIAL
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<Material> updateMaterial(
            @PathVariable int id,
            @RequestBody Material material) {

        Material updated =
                materialService.updateMaterial(id, material);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }


    // ==========================================
    // DELETE MATERIAL
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(
            @PathVariable int id) {

        materialService.deleteMaterial(id);

        return ResponseEntity.noContent().build();
    }


    // ==========================================
    // STOCK IN
    // ==========================================

    @PutMapping("/{id}/stock-in")
    public ResponseEntity<Material> stockIn(
            @PathVariable int id,
            @RequestParam double amount) {

        Material material =
                materialService.addStock(id, amount);

        if (material == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(material);
    }


    // ==========================================
    // STOCK OUT
    // ==========================================

    @PutMapping("/{id}/stock-out")
    public ResponseEntity<Material> stockOut(
            @PathVariable int id,
            @RequestParam double amount) {

        Material material =
                materialService.removeStock(id, amount);

        if (material == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(material);
    }
}