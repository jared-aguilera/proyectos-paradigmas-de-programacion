package com.tienda.abarrotes.model;

public class DetalleVenta {
    private Producto producto;
    private int cantidad;

    public DetalleVenta(Producto producto, int cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }

    // Polimorfismo: Calcula el subtotal usando el impuesto específico de cada producto 
    public double calcularSubtotal() {
        double precioConImpuesto = producto.getPrecioVenta() + producto.calcularImpuesto();
        return precioConImpuesto * cantidad;
    }

    public Producto getProducto() { return producto; }
    public int getCantidad() { return cantidad; }
}   