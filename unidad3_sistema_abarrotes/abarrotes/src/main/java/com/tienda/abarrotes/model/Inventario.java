package com.tienda.abarrotes.model;

import java.util.ArrayList;
import java.util.List;

// Implementación del patrón Singleton según la rúbrica 
public class Inventario {
    private static Inventario instancia; 
    private List<Producto> productos; 

    private Inventario() {
        productos = new ArrayList<>();
    }

    public static Inventario getInstancia() {
        if (instancia == null) {
            instancia = new Inventario();
        }
        return instancia;
    }

    public void agregarProducto(Producto p) {
        productos.add(p);
    }

    // MÉTODO OBLIGATORIO SEGÚN TU INSTRUCCIÓN 3:
    // Permite buscar un producto específico por su nombre
    public Producto buscarPorNombre(String nombre) {
        for (Producto p : productos) {
            if (p.getNombre().equalsIgnoreCase(nombre)) {
                return p;
            }
        }
        return null; // Retorna null si no lo encuentra
    }

    public List<Producto> getProductos() {
        return productos;
    }
}