package com.tienda.abarrotes.model; 

public class ProductoUnitario extends Producto { 
    public ProductoUnitario(String codigo, String nombre, double precio, int stock) {
        super(codigo, nombre, precio, stock);
    }

    @Override
    public double calcularImpuesto() {
        return this.getPrecioVenta() * 0.16; 
        
    }
}