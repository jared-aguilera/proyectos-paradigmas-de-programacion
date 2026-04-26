package com.tienda.abarrotes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.tienda.abarrotes.model.DetalleVenta;
import com.tienda.abarrotes.model.Inventario;
import com.tienda.abarrotes.model.Producto;
import com.tienda.abarrotes.model.Venta;
@Controller
public class VentasController {
    private Venta ventaActual = new Venta();
    
    @GetMapping("/carrito")
    public String verCarrito(Model model) {
        model.addAttribute("venta", ventaActual);
        return "carrito"; 
    }

    @PostMapping("/carrito/agregar")
    public String agregarAlCarrito(@RequestParam String nombre, @RequestParam int cantidad, RedirectAttributes flash) {
        Producto p = Inventario.getInstancia().buscarPorNombre(nombre);
        if (p != null) {
            ventaActual.agregarItem(p, cantidad); 
            flash.addFlashAttribute("mensaje", "Agregado con exito");
        }
        return "redirect:/productos";
    }

    @PostMapping("/cobrar")
    public String finalizarVenta(@RequestParam(required = false, defaultValue = "Publico General") String nombreCliente, Model model) {
        try {
            model.addAttribute("clienteNombre", nombreCliente);
            for (DetalleVenta item : ventaActual.getListaItems()) {
                item.getProducto().vender(item.getCantidad());
            }
            model.addAttribute("venta", ventaActual);
            ventaActual = new Venta();
            return "ticket";
        } catch (com.tienda.abarrotes.utils.SinStockException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("venta", ventaActual);
            return "carrito";
        }
    }

    @PostMapping("/carrito/eliminar")
    public String eliminarDelCarrito(@RequestParam String codigo) {
        ventaActual.eliminarItem(codigo);
        return "redirect:/carrito";
    }
}