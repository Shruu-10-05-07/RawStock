
// package com.rawstock.procurement.controller;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import com.rawstock.procurement.model.SupplyRequest;
// import com.rawstock.procurement.service.SupplyRequestService;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/supply-requests")
// @CrossOrigin(origins = "*")
// public class SupplyRequestController {

//     private final SupplyRequestService supplyRequestService;

//     public SupplyRequestController(
//             SupplyRequestService supplyRequestService) {
//         this.supplyRequestService = supplyRequestService;
//     }

//     // Get all supply requests
//     @GetMapping
//     public List<SupplyRequest> getAllRequests() {
//         return supplyRequestService.getAllRequests();
//     }

//     // Get requests for a particular supplier
//     @GetMapping("/supplier/{supplierId}")
//     public List<SupplyRequest> getRequestsBySupplier(
//             @PathVariable int supplierId) {
//         return supplyRequestService.getRequestsBySupplier(supplierId);
//     }

//     // Create a new supply request
//     @PostMapping
//     public ResponseEntity<?> createRequest(
//             @RequestBody SupplyRequest request) {
//         try {
//             return ResponseEntity.ok(
//                     supplyRequestService.createRequest(request));
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest()
//                     .body(Map.of("error", e.getMessage()));
//         }
//     }

//     // Accept or reject a pending request
// @PutMapping("/{requestId}/status")
// public ResponseEntity<?> updateStatus(
//         @PathVariable int requestId,
//         @RequestBody Map<String, Object> body) {

//     try {
//         String status = (String) body.get("status");
//         Integer deliveryDays = null;

//         Object days = body.get("deliveryDays");

//         if (days instanceof Number) {
//             deliveryDays = ((Number) days).intValue();
//         }

//         return ResponseEntity.ok(
//                 supplyRequestService.updateStatus(
//                         requestId, status, deliveryDays));

//     } catch (IllegalArgumentException e) {
//         return ResponseEntity.badRequest()
//                 .body(Map.of("error", e.getMessage()));
//     }
// }

//     // Record an actual delivery
//     @PostMapping("/{requestId}/receive")
//     public ResponseEntity<?> receiveDelivery(
//             @PathVariable int requestId,
//             @RequestBody Map<String, Double> body) {
//         try {
//             Double quantity = body.get("quantity");

//             if (quantity == null) {
//                 return ResponseEntity.badRequest()
//                         .body(Map.of("error", "Received quantity is required."));
//             }

//             return ResponseEntity.ok(
//                     supplyRequestService.receiveDelivery(
//                             requestId, quantity));
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest()
//                     .body(Map.of("error", e.getMessage()));
//         }
//     }
// }

package com.rawstock.procurement.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.rawstock.procurement.model.SupplyRequest;
import com.rawstock.procurement.service.SupplyRequestService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/supply-requests")
@CrossOrigin(origins = "*")
public class SupplyRequestController {

    private final SupplyRequestService supplyRequestService;

    public SupplyRequestController(
            SupplyRequestService supplyRequestService) {
        this.supplyRequestService = supplyRequestService;
    }

    // Get all supply requests - ADMIN
    @GetMapping
    public List<SupplyRequest> getAllRequests() {
        return supplyRequestService.getAllRequests();
    }

    // Get requests for a particular supplier - existing endpoint
    // @GetMapping("/supplier/{supplierId}")
    // public List<SupplyRequest> getRequestsBySupplier(
    //         @PathVariable int supplierId) {
    //     return supplyRequestService.getRequestsBySupplier(supplierId);
    // }

    // Get requests for the authenticated supplier - SUPPLIER
    @GetMapping("/supplier/my-requests")
    public ResponseEntity<?> getMyRequests() {
        try {
            Authentication authentication =
                    SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null
                    || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Supplier login required."));
            }

            return ResponseEntity.ok(
                    supplyRequestService.getRequestsForAuthenticatedSupplier(
                            authentication.getName()));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Create a new supply request - ADMIN
    @PostMapping
    public ResponseEntity<?> createRequest(
            @RequestBody SupplyRequest request) {
        try {
            return ResponseEntity.ok(
                    supplyRequestService.createRequest(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Accept or reject a pending request - ADMIN endpoint preserved
    @PutMapping("/{requestId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable int requestId,
            @RequestBody Map<String, Object> body) {

        try {
            String status = (String) body.get("status");
            Integer deliveryDays = null;

            Object days = body.get("deliveryDays");

            if (days instanceof Number) {
                deliveryDays = ((Number) days).intValue();
            }

            return ResponseEntity.ok(
                    supplyRequestService.updateStatus(
                            requestId, status, deliveryDays));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Accept or reject a request assigned to the logged-in supplier
    @PutMapping("/{requestId}/supplier-status")
    public ResponseEntity<?> updateSupplierStatus(
            @PathVariable int requestId,
            @RequestBody Map<String, Object> body) {

        try {
            Authentication authentication =
                    SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null
                    || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Supplier login required."));
            }

            String status = (String) body.get("status");
            Integer deliveryDays = null;
            Object days = body.get("deliveryDays");
            if (days instanceof Number) deliveryDays = ((Number) days).intValue();
            String expectedDeliveryDate = body.get("expectedDeliveryDate") == null
                    ? null : String.valueOf(body.get("expectedDeliveryDate"));

            return ResponseEntity.ok(
                    supplyRequestService.updateSupplierRequestStatus(
                            requestId,
                            authentication.getName(),
                            status,
                            expectedDeliveryDate,
                            deliveryDays));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Record an actual delivery - ADMIN endpoint preserved
    @PostMapping("/{requestId}/receive")
    public ResponseEntity<?> receiveDelivery(
            @PathVariable int requestId,
            @RequestBody Map<String, Double> body) {
        try {
            Double quantity = body.get("quantity");

            if (quantity == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Received quantity is required."));
            }

            return ResponseEntity.ok(
                    supplyRequestService.receiveDelivery(
                            requestId, quantity));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
