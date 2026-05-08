package com.tienda.abarrotes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping; 
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.tienda.abarrotes.model.Inventario;
import com.tienda.abarrotes.model.Producto;

import jakarta.servlet.http.HttpSession;

@Controller
public class InventarioController {

    @GetMapping("/productos")
    public String listarProductos(Model model) {
        model.addAttribute("productos", Inventario.getInstancia().getProductos());
        return "catalogo"; 
    }

    @GetMapping("/login")
    public String mostrarLogin() {
        return "login";
    }

    @PostMapping("/login")
    public String procesarLogin(@RequestParam String usuario, @RequestParam String password, HttpSession session, RedirectAttributes flash) {
        if (usuario.equals("admin") && password.equals("1234")) {
            session.setAttribute("adminLogueado", true); 
            return "redirect:/admin";
        } else {
            flash.addFlashAttribute("error", "Usuario o contraseña incorrectos.");
            return "redirect:/login";
        }
    }
    @GetMapping("/admin")
    public String mostrarAdmin(HttpSession session) {
        // Verificamos si la llave "adminLogueado" existe en la sesión
        if (session.getAttribute("adminLogueado") == null) {
            return "redirect:/login"; // Si no está logueado, lo pateamos al login
        }
        return "admin";
    }
    
    @PostMapping("/nuevo")
    public String registrarProducto(@RequestParam String tipo, @RequestParam String codigo, 
                                    @RequestParam String nombre, @RequestParam double precio,
                                    @RequestParam double stock, RedirectAttributes flash) {

        boolean yaExiste = Inventario.getInstancia().getProductos().stream().anyMatch(p -> p.getCodigo().equals(codigo));
        if (yaExiste) {
            flash.addFlashAttribute("error", "Error: El codigo '" + codigo + "' ya existe");
            return "redirect:/admin";
        }
        com.tienda.abarrotes.patterns.factory.ProductoFactory factory = new com.tienda.abarrotes.patterns.factory.ProductoFactory();
        Producto nuevo = factory.crearProducto(tipo, codigo, nombre, precio, (int) stock);
        if (nuevo != null) {
            Inventario.getInstancia().agregarProducto(nuevo);
            flash.addFlashAttribute("mensaje", "Producto '" + nombre + "' registrado.");
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
                flash.addFlashAttribute("mensaje", "Stock actualizado para " + p.getNombre());
                break;
            }
        }
        if (!encontrado) flash.addFlashAttribute("error", "El codigo no existe");
        return "redirect:/admin"; 
    }
}
