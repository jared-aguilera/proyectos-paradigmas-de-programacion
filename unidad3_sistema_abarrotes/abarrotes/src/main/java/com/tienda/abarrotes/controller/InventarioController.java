package com.tienda.abarrotes.controller;

import com.tienda.abarrotes.model.Inventario;
import com.tienda.abarrotes.patterns.factory.ProductoFactory;
import com.tienda.abarrotes.model.Producto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/productos")
public class InventarioController {

    // Metodo para mostrar la lista de productos en la pagina web
    @GetMapping
    public String listarProductos(Model model) {
        // Usamos el Singleton para obtener la lista unica de productos
        // Se la pasamos a Miguel para que la use en el HTML
        model.addAttribute("productos", Inventario.getInstancia().getProductos());
        return "catalogo"; 
    }

    @PostMapping("/nuevo")
    public String registrarProducto(@RequestParam String tipo,
                                    @RequestParam String codigo, 
                                    @RequestParam String nombre,
                                    @RequestParam double precio,
                                    @RequestParam int stock) {
                                        
        Producto nuevo = ProductoFactory.crearProducto(tipo, codigo, nombre, precio, stock);
         if (nuevo != null) {
            Inventario.getInstancia().agregarProducto(nuevo);
         }
        
        return "redirect:/productos";
    }
}