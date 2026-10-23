package com.rawstock.repository;

import com.rawstock.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {

    List<Material> findByMaterialCodeContainingIgnoreCaseOrMaterialNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String materialCode,
            String materialName,
            String category,
            String location
    );
}