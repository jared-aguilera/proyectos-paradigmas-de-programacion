package com.tienda.abarrotes.controller;

import com.tienda.abarrotes.model.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class VentasController {

    private Venta ventaActual = new Venta();

    @PostMapping("/carrito/agregar")
    public String agregarAlCarrito(@RequestParam String nombre, 
                                   @RequestParam int cantidad, 
                                   RedirectAttributes flash) {
        try {
            Producto p = Inventario.getInstancia().buscarPorNombre(nombre);

            if (p != null) {
                ventaActual.agregarItem(p, cantidad); 
                flash.addFlashAttribute("mensaje", "Producto agregado con exito");
            } else {
                flash.addFlashAttribute("error", "Error: Producto no encontrado");
            }
            
        } catch (Exception e) { 
            flash.addFlashAttribute("error", "Hubo un problema: " + e.getMessage());
        }
        return "redirect:/productos";
    }

    @PostMapping("/cobrar")
    public String finalizarVenta(RedirectAttributes flash) {
        // Usamos el metodo de David para el total
        double total = ventaActual.calcularTotalVenta();

        flash.addFlashAttribute("mensaje", "Venta completada. Total: $" + total);

        // Reiniciamos el objeto para la siguiente venta
        ventaActual = new Venta(); 
        return "redirect:/productos";
    }
}