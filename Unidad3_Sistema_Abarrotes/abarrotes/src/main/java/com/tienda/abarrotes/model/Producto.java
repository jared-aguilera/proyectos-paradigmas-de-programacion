package com.tienda.abarrotes.model;

import com.tienda.abarrotes.patterns.observer.IStockObserver; // Corregido con 'r'
import java.util.ArrayList;
import java.util.List;
import com.tienda.abarrotes.utils.SinStockException;

public abstract class Producto {
    private String codigo;
    private String nombre;
    private double precioVenta;
    private int stock;
    private List<IStockObserver> observadores = new ArrayList<>(); // Corregido

    public Producto(String codigo, String nombre, double precioVenta, int stock) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.precioVenta = precioVenta;
        this.stock = stock;
    }

    public abstract double calcularImpuesto();

    public void agregarObservador(IStockObserver obs) { // Corregido
        observadores.add(obs);
    }
    
    public void vender(int cantidad) throws SinStockException {
        if (cantidad > this.stock) {
            throw new SinStockException("Sin existencias suficientes para: " + nombre);
        }
        this.stock -= cantidad;

        for (IStockObserver obs : observadores) { // Corregido
            obs.notificar(this);
        }
    }

    public String getNombre() { return nombre; }
    public double getPrecioVenta() { return precioVenta; }
    public int getStock() { return stock; }
    public String getCodigo() { return codigo; }
}