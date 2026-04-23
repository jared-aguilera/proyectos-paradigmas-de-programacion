package com.tienda.abarrotes.patterns.strategy;

public class DescuentoPorcentaje implements IEstrategiaDescuento {
    private double porcentaje;

    public DescuentoPorcentaje(double porcentaje) {
        this.porcentaje = porcentaje;
    }

    @Override
    public double aplicarDescuento(double totalOriginal) {
        return totalOriginal - (totalOriginal * (porcentaje / 100));
    }
}   