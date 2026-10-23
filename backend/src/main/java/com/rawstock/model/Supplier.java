package com.rawstock.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int supplierId;

    private String username;
    private String supplierName;
    private String phone;
    private String email;
    private String address;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
private String password;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public Supplier() {
    }


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Supplier(String username,
                    String supplierName,
                    String phone,
                    String email,
                    String address) {

        this.username = username;
        this.supplierName = supplierName;
        this.phone = phone;
        this.email = email;
        this.address = address;
    }


    // ==========================================
    // GETTERS & SETTERS
    // ==========================================

    public int getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(int supplierId) {
        this.supplierId = supplierId;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
    public String getPassword() {
    return password;
}

public void setPassword(String password) {
    this.password = password;
}
}
