package com.rawstock.model;

import jakarta.persistence.*;

@Entity
@Table(name = "materials")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int materialId;

    private String materialCode;
    private String materialName;
    private String category;
    private String unit;

    private double quantity;
    private double minimumStock;

    private String location;

    // Purchase / Packaging details
    private String purchaseUnit;
    private double packSize;
    private String packType;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public Material() {
    }


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Material(String materialCode,
                    String materialName,
                    String category,
                    String unit,
                    double quantity,
                    double minimumStock,
                    String location) {

        this.materialCode = materialCode;
        this.materialName = materialName;
        this.category = category;
        this.unit = unit;
        this.quantity = quantity;
        this.minimumStock = minimumStock;
        this.location = location;
    }


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public int getMaterialId() {
        return materialId;
    }

    public void setMaterialId(int materialId) {
        this.materialId = materialId;
    }


    public String getMaterialCode() {
        return materialCode;
    }

    public void setMaterialCode(String materialCode) {
        this.materialCode = materialCode;
    }


    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }


    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }


    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }


    public double getMinimumStock() {
        return minimumStock;
    }

    public void setMinimumStock(double minimumStock) {
        this.minimumStock = minimumStock;
    }


    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


    // ==========================================
    // PURCHASE / PACKAGING GETTERS & SETTERS
    // ==========================================

    public String getPurchaseUnit() {
        return purchaseUnit;
    }

    public void setPurchaseUnit(String purchaseUnit) {
        this.purchaseUnit = purchaseUnit;
    }


    public double getPackSize() {
        return packSize;
    }

    public void setPackSize(double packSize) {
        this.packSize = packSize;
    }


    public String getPackType() {
        return packType;
    }

    public void setPackType(String packType) {
        this.packType = packType;
    }


    // ==========================================
    // STOCK OPERATIONS
    // ==========================================

    // Basic stock operation
    public void addStock(double amount) {

        if (amount > 0) {
            quantity = quantity + amount;
        }
    }


    // Method Overloading
    public void addStock(double amount, String source) {

        if (amount > 0) {
            quantity = quantity + amount;

            System.out.println(
                "Stock received from: " + source
            );
        }
    }


    public void removeStock(double amount) {

        if (amount > 0 && amount <= quantity) {
            quantity = quantity - amount;
        }
    }


    // ==========================================
    // LOW STOCK CHECK
    // ==========================================

    public boolean isLowStock() {

        return quantity <= minimumStock;
    }
}