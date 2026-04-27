package com.tienda.abarrotes.model;

import java.util.ArrayList;
import java.util.List;

import com.tienda.abarrotes.patterns.strategy.IEstrategiaDescuento;

public class Venta {
    private List<DetalleVenta> listaItems = new ArrayList<>();

    private IEstrategiaDescuento estrategia = (total) -> total; 

    public void setEstrategia(IEstrategiaDescuento estrategia) {
        this.estrategia = estrategia;
    }

    // 2. Suma bruta de todos los productos
    public double calcularTotalVenta() {
        double total = 0;
        for (DetalleVenta item : listaItems) {
            total += item.calcularSubtotal();
        }
        return total;
    }

    // 3. El gran final: Aplica la estrategia elegida
    public double calcularTotalFinal() {
        double subtotal = calcularTotalVenta();
        return estrategia.aplicarDescuento(subtotal);
    }

    // --- Gestión del Carrito ---
    public List<DetalleVenta> getListaItems() { return listaItems; }

    public void agregarItem(Producto p, int cant) {
        listaItems.add(new DetalleVenta(p, cant));
    }
    
    public void eliminarItem(String codigo) {
        listaItems.removeIf(item -> item.getProducto().getCodigo().equals(codigo));
    }

    public void modificarCantidad(String codigo, int nuevaCantidad) {
        if (nuevaCantidad <= 0) {
            this.eliminarItem(codigo);
            return;
        }
        for (DetalleVenta item : listaItems) {
            if (item.getProducto().getCodigo().equals(codigo)) {
                item.setCantidad(nuevaCantidad); 
                break; 
            }
        }
    }
}