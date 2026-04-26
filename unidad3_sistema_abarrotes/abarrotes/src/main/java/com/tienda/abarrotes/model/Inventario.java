package com.tienda.abarrotes.model;

import java.util.ArrayList;
import java.util.List;

import com.tienda.abarrotes.patterns.factory.ProductoFactory;

public class Inventario {
    private static Inventario instancia; 
    private List<Producto> productos; 

    private Inventario() {
        productos = new ArrayList<>();
        productos.add(ProductoFactory.crearProducto("Unitario", "001", "Coca-Cola 600ml", 18.00, 50));
        productos.add(ProductoFactory.crearProducto("Unitario", "002", "Leche Alpura 1L", 28.50, 25));
        productos.add(ProductoFactory.crearProducto("Unitario", "003", "Jugo Jumex Manzana 1L", 24.00, 30));
        productos.add(ProductoFactory.crearProducto("Unitario", "004", "Gansito Marinela", 25.00, 20));
        productos.add(ProductoFactory.crearProducto("Unitario", "005", "Galletas Emperador Chocolate", 17.00, 40));
        productos.add(ProductoFactory.crearProducto("Unitario", "006", "Sabritas Sal 170g", 42.00, 35));
        productos.add(ProductoFactory.crearProducto("Unitario", "007", "Aceite Nutrioli 946ml", 48.50, 40));
        productos.add(ProductoFactory.crearProducto("Unitario", "008", "Atún Dolores en Agua 140g", 21.00, 60));
        productos.add(ProductoFactory.crearProducto("Unitario", "009", "Pan Bimbo Blanco Grande", 46.00, 15));
        productos.add(ProductoFactory.crearProducto("Unitario", "010", "Cereal Zucaritas 500g", 65.00, 18));
        productos.add(ProductoFactory.crearProducto("Granel", "011", "Frijol Peruano (Kg)", 38.00, 100));
        productos.add(ProductoFactory.crearProducto("Granel", "012", "Huevo San Juan (Kg)", 45.00, 50));
        productos.add(ProductoFactory.crearProducto("Granel", "013", "Arroz Super Extra (Kg)", 24.50, 80));
        productos.add(ProductoFactory.crearProducto("Granel", "014", "Azucar Estandar (Kg)", 28.00, 120));
        productos.add(ProductoFactory.crearProducto("Unitario", "015", "Jabon Zote Rosa 400g", 22.00, 45));
        productos.add(ProductoFactory.crearProducto("Unitario", "016", "Detergente Foca 1Kg", 38.50, 30));
        productos.add(ProductoFactory.crearProducto("Unitario", "017", "Papel Higienico Petalo 4pz", 35.00, 25));

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

    public Producto buscarPorNombre(String nombre) {
        for (Producto p : productos) {
            if (p.getNombre().equalsIgnoreCase(nombre)) {
                return p;
            }
        }
        return null; 
    }

    public List<Producto> getProductos() {
        return productos;
    }
}