package com.tienda.abarrotes.patterns.observer;

import com.tienda.abarrotes.model.Producto;

public class AlertaBajoStock implements IStockObserver {
    @Override
    public void notificar(Producto producto) {
        if (producto.getStock() < 5) {
            System.out.println(" ALERTA DE SISTEMA: El producto '" + 
                               producto.getNombre() + "' tiene stock crítico: " + 
                               producto.getStock());
        }
    }
}