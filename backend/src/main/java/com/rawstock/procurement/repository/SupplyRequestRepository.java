
package com.rawstock.procurement.repository;

import com.rawstock.procurement.model.SupplyRequest;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplyRequestRepository
        extends JpaRepository<SupplyRequest, Integer> {

    List<SupplyRequest> findBySupplierId(int supplierId);

    List<SupplyRequest> findByMaterialId(int materialId);

    List<SupplyRequest> findByStatus(String status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM SupplyRequest r WHERE r.requestId = :requestId")
    Optional<SupplyRequest> findByIdForUpdate(
            @Param("requestId") int requestId);
}
