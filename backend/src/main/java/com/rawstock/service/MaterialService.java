package com.rawstock.service;

import com.rawstock.model.Material;
import com.rawstock.repository.MaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;

    public MaterialService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }


    // ==========================================
    // GET ALL MATERIALS
    // ==========================================

    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }


    // ==========================================
    // GET MATERIAL BY ID
    // ==========================================

    public Optional<Material> getMaterialById(int id) {
        return materialRepository.findById(id);
    }


    // ==========================================
    // ADD MATERIAL
    // ==========================================

    public Material addMaterial(Material material) {
        return materialRepository.save(material);
    }


    // ==========================================
    // UPDATE MATERIAL
    // ==========================================

    public Material updateMaterial(
            int id,
            Material updatedMaterial) {

        Optional<Material> existingMaterial =
                materialRepository.findById(id);

        if (existingMaterial.isPresent()) {

            Material material = existingMaterial.get();

            material.setMaterialCode(
                    updatedMaterial.getMaterialCode()
            );

            material.setMaterialName(
                    updatedMaterial.getMaterialName()
            );

            material.setCategory(
                    updatedMaterial.getCategory()
            );

            material.setUnit(
                    updatedMaterial.getUnit()
            );

            material.setQuantity(
                    updatedMaterial.getQuantity()
            );

            material.setMinimumStock(
                    updatedMaterial.getMinimumStock()
            );

            material.setLocation(
                    updatedMaterial.getLocation()
            );

            // NEW: Purchase / Packaging details

            material.setPurchaseUnit(
                    updatedMaterial.getPurchaseUnit()
            );

            material.setPackSize(
                    updatedMaterial.getPackSize()
            );

            material.setPackType(
                    updatedMaterial.getPackType()
            );

            return materialRepository.save(material);
        }

        return null;
    }


    // ==========================================
    // DELETE MATERIAL
    // ==========================================

    public void deleteMaterial(int id) {
        materialRepository.deleteById(id);
    }


    // ==========================================
    // STOCK IN
    // ==========================================

    public Material addStock(
            int id,
            double amount) {

        Optional<Material> result =
                materialRepository.findById(id);

        if (result.isPresent()) {

            Material material = result.get();

            material.addStock(amount);

            return materialRepository.save(material);
        }

        return null;
    }


    // ==========================================
    // STOCK OUT
    // ==========================================

    public Material removeStock(
            int id,
            double amount) {

        Optional<Material> result =
                materialRepository.findById(id);

        if (result.isPresent()) {

            Material material = result.get();

            material.removeStock(amount);

            return materialRepository.save(material);
        }

        return null;
    }


    // ==========================================
    // SMART SEARCH
    // Searches:
    // Material Code
    // Material Name
    // Category
    // Location
    // ==========================================

    public List<Material> searchMaterials(
            String keyword) {

        if (keyword == null ||
            keyword.trim().isEmpty()) {

            return materialRepository.findAll();
        }

        return materialRepository
                .findByMaterialCodeContainingIgnoreCaseOrMaterialNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrLocationContainingIgnoreCase(
                        keyword,
                        keyword,
                        keyword,
                        keyword
                );
    }
}