package com.tienda.abarrotes.model;

public class ProductoGranel extends Producto { // 
    public ProductoGranel(String codigo, String nombre, double precio, int stock) {
        super(codigo, nombre, precio, stock);
    }

    @Override
    public double calcularImpuesto() {
        return this.getPrecioVenta() * 0.08; 
    }
}