package com.rawstock.controller;

import com.rawstock.service.BomService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bom")
@CrossOrigin(origins = "*")
public class BomController {

    private final BomService bomService;

    public BomController(BomService bomService) {
        this.bomService = bomService;
    }

    // Calculate required material
    @GetMapping("/calculate")
    public Map<String, Object> calculateMaterial(
            @RequestParam double quantityPerProduct,
            @RequestParam int numberOfProducts) {

        double required =
                bomService.calculateRequiredMaterial(
                        quantityPerProduct,
                        numberOfProducts
                );

        Map<String, Object> response = new HashMap<>();

        response.put("quantityPerProduct",
                quantityPerProduct);

        response.put("numberOfProducts",
                numberOfProducts);

        response.put("requiredMaterial",
                required);

        return response;
    }

    // Check stock availability
    @GetMapping("/check-stock")
    public Map<String, Object> checkStock(
            @RequestParam double availableStock,
            @RequestParam double requiredStock) {

        boolean available =
                bomService.isStockAvailable(
                        availableStock,
                        requiredStock
                );

        Map<String, Object> response = new HashMap<>();

        response.put("availableStock",
                availableStock);

        response.put("requiredStock",
                requiredStock);

        response.put("stockAvailable",
                available);

        return response;
    }
}