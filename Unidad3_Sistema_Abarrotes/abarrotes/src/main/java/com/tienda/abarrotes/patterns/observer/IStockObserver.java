package com.tienda.abarrotes.patterns.observer;

import com.tienda.abarrotes.model.Producto;

public interface IStockObserver {
    void notificar(Producto producto);
}