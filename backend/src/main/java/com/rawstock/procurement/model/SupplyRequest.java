
package com.rawstock.procurement.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "supply_requests")
public class SupplyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int requestId;

    private int supplierId;
    private int materialId;

    private double requestedQuantity;
    private double receivedQuantity;

    private LocalDate requestDate;
    private LocalDate requiredDate;
    private Integer deliveryDays;
private LocalDate expectedDeliveryDate;
    private LocalDate actualDeliveryDate;

    private String status;
    private String notes;

    public SupplyRequest() {
    }

    public int getRequestId() {
        return requestId;
    }

    public void setRequestId(int requestId) {
        this.requestId = requestId;
    }

    public int getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(int supplierId) {
        this.supplierId = supplierId;
    }

    public int getMaterialId() {
        return materialId;
    }

    public void setMaterialId(int materialId) {
        this.materialId = materialId;
    }

    public double getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(double requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public double getReceivedQuantity() {
        return receivedQuantity;
    }

    public void setReceivedQuantity(double receivedQuantity) {
        this.receivedQuantity = receivedQuantity;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDate getRequiredDate() {
        return requiredDate;
    }

    public void setRequiredDate(LocalDate requiredDate) {
        this.requiredDate = requiredDate;
    }
    public Integer getDeliveryDays() {
    return deliveryDays;
}

public void setDeliveryDays(Integer deliveryDays) {
    this.deliveryDays = deliveryDays;
}

public LocalDate getExpectedDeliveryDate() {
    return expectedDeliveryDate;
}

public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) {
    this.expectedDeliveryDate = expectedDeliveryDate;
}

public LocalDate getActualDeliveryDate() {
    return actualDeliveryDate;
}

public void setActualDeliveryDate(LocalDate actualDeliveryDate) {
    this.actualDeliveryDate = actualDeliveryDate;
}

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
