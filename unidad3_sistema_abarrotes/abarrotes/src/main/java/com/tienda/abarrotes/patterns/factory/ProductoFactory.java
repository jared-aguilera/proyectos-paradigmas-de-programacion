package com.tienda.abarrotes.patterns.factory;
import com.tienda.abarrotes.model.Producto;
import com.tienda.abarrotes.model.ProductoGranel;
import com.tienda.abarrotes.model.ProductoUnitario;

public class ProductoFactory {
    public static Producto crearProducto(String tipo, String codigo, String nombre, double precio, int stock) {
        if (tipo.equalsIgnoreCase("Granel")) {
            return new ProductoGranel(codigo, nombre, precio, stock);
        } else if (tipo.equalsIgnoreCase("Unitario")) {
            return new ProductoUnitario(codigo, nombre, precio, stock);
        }
        return null;
    
    }
}