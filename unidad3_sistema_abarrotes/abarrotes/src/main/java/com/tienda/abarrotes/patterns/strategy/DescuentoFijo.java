package com.tienda.abarrotes.patterns.strategy;

// Implementacion para restar un monto fijo (ej. $20 pesos menos)
public class DescuentoFijo implements IEstrategiaDescuento {
    private double monto;

    public DescuentoFijo(double monto) {
        this.monto = monto;
    }

    @Override
    public double aplicarDescuento(double totalOriginal) {
        return Math.max(0, totalOriginal - monto);
    }
}