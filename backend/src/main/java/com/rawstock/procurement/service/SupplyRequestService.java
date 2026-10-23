package com.rawstock.procurement.service;

import com.rawstock.model.StockItem;
import com.rawstock.repository.MaterialRepository;
import com.rawstock.repository.SupplierRepository;
import com.rawstock.service.StockService;
import com.rawstock.procurement.model.SupplyRequest;
import com.rawstock.procurement.repository.SupplyRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class SupplyRequestService {
    private final SupplyRequestRepository requestRepository;
    private final MaterialRepository materialRepository;
    private final SupplierRepository supplierRepository;
    private final StockService stockService;

    public SupplyRequestService(SupplyRequestRepository requestRepository,
                                MaterialRepository materialRepository,
                                SupplierRepository supplierRepository,
                                StockService stockService) {
        this.requestRepository = requestRepository;
        this.materialRepository = materialRepository;
        this.supplierRepository = supplierRepository;
        this.stockService = stockService;
    }

    public List<SupplyRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<SupplyRequest> getRequestsBySupplier(int supplierId) {
        return requestRepository.findBySupplierId(supplierId);
    }

    public List<SupplyRequest> getRequestsForAuthenticatedSupplier(String username) {
        var supplier = supplierRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found."));
        return requestRepository.findBySupplierId(supplier.getSupplierId());
    }

    private SupplyRequest getRequestForSupplier(int requestId, String username) {
        var supplier = supplierRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found."));
        SupplyRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Supply request not found."));
        if (!Objects.equals(request.getSupplierId(), supplier.getSupplierId())) {
            throw new IllegalArgumentException("You are not authorized to access this request.");
        }
        return request;
    }

    @Transactional
    public SupplyRequest createRequest(SupplyRequest request) {
        if (request == null || request.getSupplierId() <= 0 || request.getMaterialId() <= 0
                || !Double.isFinite(request.getRequestedQuantity()) || request.getRequestedQuantity() <= 0) {
            throw new IllegalArgumentException("Supplier, material, and positive quantity are required.");
        }
        if (!supplierRepository.existsById(request.getSupplierId())) {
            throw new IllegalArgumentException("Supplier not found.");
        }
        if (!materialRepository.existsById(request.getMaterialId())) {
            throw new IllegalArgumentException("Material not found.");
        }
        if (request.getRequiredDate() != null && request.getRequiredDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Required date cannot be in the past.");
        }
        request.setRequestDate(LocalDate.now());
        request.setReceivedQuantity(0);
        request.setDeliveryDays(null);
        request.setExpectedDeliveryDate(null);
        request.setStatus("PENDING");
        return requestRepository.save(request);
    }

    /** Legacy admin status endpoint retained for compatibility with older clients. */
    @Transactional
    public SupplyRequest updateStatus(int requestId, String newStatus, Integer deliveryDays) {
        SupplyRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Supply request not found."));
        validatePendingDecision(request, newStatus);
        String status = newStatus.trim().toUpperCase();
        if ("ACCEPTED".equals(status)) {
            if (deliveryDays == null || deliveryDays < 1) {
                throw new IllegalArgumentException("Delivery days must be at least 1.");
            }
            request.setDeliveryDays(deliveryDays);
            request.setExpectedDeliveryDate(LocalDate.now().plusDays(deliveryDays));
        } else {
            request.setDeliveryDays(null);
            request.setExpectedDeliveryDate(null);
        }
        request.setStatus(status);
        return requestRepository.save(request);
    }

    @Transactional
    public SupplyRequest updateSupplierRequestStatus(int requestId, String username,
                                                     String newStatus, String expectedDateText,
                                                     Integer legacyDeliveryDays) {
        SupplyRequest request = getRequestForSupplier(requestId, username);
        validatePendingDecision(request, newStatus);
        String status = newStatus.trim().toUpperCase();
        if ("ACCEPTED".equals(status)) {
            LocalDate expectedDate;
            if (expectedDateText != null && !expectedDateText.isBlank()) {
                try {
                    expectedDate = LocalDate.parse(expectedDateText.trim());
                } catch (RuntimeException ex) {
                    throw new IllegalArgumentException("Expected delivery date must be a valid date (YYYY-MM-DD).");
                }
            } else if (legacyDeliveryDays != null && legacyDeliveryDays >= 1) {
                // Compatibility for an older supplier page; new UI submits a date directly.
                expectedDate = LocalDate.now().plusDays(legacyDeliveryDays);
            } else {
                throw new IllegalArgumentException("Expected delivery date is required when accepting a request.");
            }
            if (expectedDate.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Expected delivery date cannot be in the past.");
            }
            request.setExpectedDeliveryDate(expectedDate);
            request.setDeliveryDays((int) Math.max(0, java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), expectedDate)));
        } else {
            request.setDeliveryDays(null);
            request.setExpectedDeliveryDate(null);
        }
        request.setStatus(status);
        return requestRepository.save(request);
    }

    private void validatePendingDecision(SupplyRequest request, String newStatus) {
        if (newStatus == null) throw new IllegalArgumentException("Status is required.");
        String status = newStatus.trim().toUpperCase();
        if (!List.of("ACCEPTED", "REJECTED").contains(status)) {
            throw new IllegalArgumentException("Only ACCEPTED or REJECTED is allowed here.");
        }
        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalArgumentException("Only pending requests can be accepted or rejected.");
        }
    }

    @Transactional
    public SupplyRequest receiveDelivery(int requestId, double quantity) {
        SupplyRequest request = requestRepository.findByIdForUpdate(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Supply request not found."));
        if (!"ACCEPTED".equals(request.getStatus()) && !"PARTIALLY_RECEIVED".equals(request.getStatus())) {
            throw new IllegalArgumentException("Only accepted requests can receive deliveries.");
        }
        if (!Double.isFinite(quantity) || quantity <= 0) {
            throw new IllegalArgumentException("Received quantity must be a positive number.");
        }
        double remaining = request.getRequestedQuantity() - request.getReceivedQuantity();
        if (quantity > remaining + 1e-9) {
            throw new IllegalArgumentException("Received quantity exceeds the remaining requested quantity.");
        }
        StockItem stockItem = new StockItem(request.getMaterialId(), "IN", quantity, LocalDate.now().toString());
        StockItem savedStock = stockService.addTransaction(stockItem);
        if (savedStock == null) throw new IllegalArgumentException("Material not found.");

        double totalReceived = request.getReceivedQuantity() + quantity;
        request.setReceivedQuantity(totalReceived);
        request.setActualDeliveryDate(LocalDate.now());
        request.setStatus(totalReceived + 1e-9 >= request.getRequestedQuantity()
                ? "COMPLETED" : "PARTIALLY_RECEIVED");
        return requestRepository.save(request);
    }
}
