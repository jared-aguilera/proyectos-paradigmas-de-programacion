package com.tienda.abarrotes.model;

import java.util.ArrayList;
import java.util.List;

public class Venta {
    private List<DetalleVenta> listaItems = new ArrayList<>();

    public void agregarItem(Producto p, int cant) {
        listaItems.add(new DetalleVenta(p, cant));
    }
    
    public void eliminarItem(String codigo) {
        // Busca en la lista el item que tenga ese código y lo borra mágicamente
        listaItems.removeIf(item -> item.getProducto().getCodigo().equals(codigo));
    }

    public double calcularTotalVenta() {
        double total = 0;
        for (DetalleVenta item : listaItems) {
            total += item.calcularSubtotal();
        }
        return total;
    }

    public List<DetalleVenta> getListaItems() { return listaItems; }
}