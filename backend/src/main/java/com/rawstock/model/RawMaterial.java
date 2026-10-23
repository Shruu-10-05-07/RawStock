package com.rawstock.model;

public class RawMaterial extends Material {

    private String materialType;

    public RawMaterial() {
        super();
    }

    public RawMaterial(String materialCode,
                       String materialName,
                       String category,
                       String unit,
                       double quantity,
                       double minimumStock,
                       String location,
                       String materialType) {

        super(
                materialCode,
                materialName,
                category,
                unit,
                quantity,
                minimumStock,
                location
        );

        this.materialType = materialType;
    }

    public String getMaterialType() {
        return materialType;
    }

    public void setMaterialType(String materialType) {
        this.materialType = materialType;
    }

    // Method overriding
    @Override
    public String toString() {

        return "Raw Material: " + getMaterialName()
                + " | Quantity: " + getQuantity()
                + " | Unit: " + getUnit()
                + " | Type: " + materialType;
    }
}