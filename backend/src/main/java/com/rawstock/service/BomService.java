package com.rawstock.service;

import org.springframework.stereotype.Service;

@Service
public class BomService {

    // Calculate required raw material
    public double calculateRequiredMaterial(
            double quantityPerProduct,
            int numberOfProducts) {

        return quantityPerProduct * numberOfProducts;
    }

    // Check whether available stock is enough
    public boolean isStockAvailable(
            double availableStock,
            double requiredStock) {

        return availableStock >= requiredStock;
    }
}