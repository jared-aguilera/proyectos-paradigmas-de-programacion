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
import com.tienda.abarrotes.patterns.strategy.DescuentoFijo;
import com.tienda.abarrotes.patterns.strategy.DescuentoPorcentaje;
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

    @PostMapping("/carrito/modificar")
    public String modificarDelCarrito(@RequestParam String codigo, @RequestParam int cantidad) {
        ventaActual.modificarCantidad(codigo, cantidad);
        return "redirect:/carrito";
    }

    @PostMapping("/carrito/descuento")
public String aplicarDescuento(@RequestParam String tipo, @RequestParam double valor, RedirectAttributes flash) {
    if (tipo.equals("PORCENTAJE")) {
        ventaActual.setEstrategia(new DescuentoPorcentaje(valor));
        flash.addFlashAttribute("mensaje", "Descuento del " + valor + "% aplicado.");
    } else if (tipo.equals("FIJO")) {
        ventaActual.setEstrategia(new DescuentoFijo(valor));
        flash.addFlashAttribute("mensaje", "Descuento de $" + valor + " aplicado.");
    } else {
        ventaActual.setEstrategia((total) -> total);
    }
    
    return "redirect:/carrito";
}
}