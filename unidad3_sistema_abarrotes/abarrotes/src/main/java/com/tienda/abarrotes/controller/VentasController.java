package com.tienda.abarrotes.controller;

import org.springframework.stereotype.Controller;
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
    public String verCarrito(org.springframework.ui.Model model) {
        model.addAttribute("venta", ventaActual);
        return "carrito"; 
    }

    @PostMapping("/carrito/agregar")
    public String agregarAlCarrito(@RequestParam String nombre, @RequestParam int cantidad, RedirectAttributes flash) {
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
    public String finalizarVenta(
            @RequestParam(required = false, defaultValue = "Público General") String nombreCliente, 
            org.springframework.ui.Model model) {
        try {
            //  
            model.addAttribute("clienteNombre", nombreCliente);
            //  Descontamos stock de cada producto
            for (DetalleVenta item : ventaActual.getListaItems()) {
                item.getProducto().vender(item.getCantidad());
            }
            //  Pasamos la venta al ticket ANTES de resetearla
            model.addAttribute("venta", ventaActual);
            model.addAttribute("mensaje", "Venta completada para: " + nombreCliente);
            ventaActual = new Venta();
            return "ticket";
        } catch (com.tienda.abarrotes.utils.SinStockException e) {
            model.addAttribute("error", "Error de stock: " + e.getMessage());
            model.addAttribute("venta", ventaActual);
            return "carrito";
        }
    }
    
    @PostMapping("/carrito/eliminar")
    public String eliminarDelCarrito(@RequestParam String codigo) {
        ventaActual.eliminarItem(codigo);
        
        return "redirect:/carrito";
    }

    @GetMapping("/admin")
    public String mostrarAdmin() {
        return "admin";
    }

    @PostMapping("/nuevo")
public String registrarProducto(@RequestParam String tipo,@RequestParam String codigo,  @RequestParam String nombre,@RequestParam double precio,@RequestParam double stock,RedirectAttributes flash) {
    boolean yaExiste = Inventario.getInstancia().getProductos().stream().anyMatch(p -> p.getCodigo().equals(codigo));

    if (yaExiste) {
        flash.addFlashAttribute("error", "Error: El codigo de barras '" + codigo + "' ya esta registrado");
        return "redirect:/admin";
    }
    com.tienda.abarrotes.patterns.factory.ProductoFactory factory = new com.tienda.abarrotes.patterns.factory.ProductoFactory();
    Producto nuevo = factory.crearProducto(tipo, codigo, nombre, precio, (int) stock);
    if (nuevo != null) {
        Inventario.getInstancia().agregarProducto(nuevo);
        flash.addFlashAttribute("mensaje", "Producto '" + nombre + "' registrado exitosamente");
    }
    return "redirect:/productos";
}

    @PostMapping("/inventario/actualizar")
public String actualizarStock(@RequestParam String codigo, @RequestParam double cantidadExtra, RedirectAttributes flash) {
    boolean encontrado = false;
    for (Producto p : Inventario.getInstancia().getProductos()) {
        if (p.getCodigo().equals(codigo)) {
            p.setStock(p.getStock() + cantidadExtra); 
            encontrado = true;
            flash.addFlashAttribute("mensaje", "Stock actualizado: Se sumaron " + cantidadExtra + " unidades a " + p.getNombre());
            break;
        }
    }
    if (!encontrado) {
        flash.addFlashAttribute("error", "Error: El codigo '" + codigo + "' no existe en el sistema");
    }
    return "redirect:/admin"; 
}

} 
    