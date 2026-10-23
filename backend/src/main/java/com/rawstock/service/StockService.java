package com.rawstock.service;

import com.rawstock.model.StockItem;
import com.rawstock.model.Material;
import com.rawstock.repository.StockRepository;
import com.rawstock.repository.MaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final MaterialRepository materialRepository;

    public StockService(StockRepository stockRepository,
                        MaterialRepository materialRepository) {
        this.stockRepository = stockRepository;
        this.materialRepository = materialRepository;
    }

    public List<StockItem> getAllTransactions() {
        return stockRepository.findAll();
    }

    public StockItem addTransaction(StockItem stockItem) {

        Optional<Material> result =
                materialRepository.findById(stockItem.getMaterialId());

        if (result.isEmpty()) {
            return null;
        }

        Material material = result.get();

        if (stockItem.getTransactionType().equalsIgnoreCase("IN")) {

            material.addStock(stockItem.getQuantity());

        } else if (stockItem.getTransactionType().equalsIgnoreCase("OUT")) {

            material.removeStock(stockItem.getQuantity());

        }

        materialRepository.save(material);

        return stockRepository.save(stockItem);
    }

    public void deleteTransaction(int id) {
        stockRepository.deleteById(id);
    }
}