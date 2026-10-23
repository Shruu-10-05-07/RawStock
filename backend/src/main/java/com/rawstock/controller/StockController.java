package com.rawstock.controller;

import com.rawstock.model.StockItem;
import com.rawstock.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // GET all stock transactions
    @GetMapping
    public List<StockItem> getAllTransactions() {

        return stockService.getAllTransactions();
    }

    // ADD stock transaction
    // @PostMapping
    // public ResponseEntity<StockItem> addTransaction(
    //         @RequestBody StockItem stockItem) {

    //     StockItem saved =
    //             stockService.addTransaction(stockItem);

    //     return ResponseEntity.ok(saved);
    // }
    @PostMapping
public ResponseEntity<StockItem> addTransaction(@RequestBody StockItem stockItem) {

    StockItem saved = stockService.addTransaction(stockItem);

    if (saved == null) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(saved);
}

    // DELETE transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable int id) {

        stockService.deleteTransaction(id);

        return ResponseEntity.noContent().build();
    }
}