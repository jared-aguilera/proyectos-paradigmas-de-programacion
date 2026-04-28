package com.tienda.abarrotes.model;

import java.util.ArrayList; 
import java.util.List;

import com.tienda.abarrotes.patterns.observer.IStockObserver;
import com.tienda.abarrotes.utils.SinStockException;

public abstract class Producto {
    private String codigo;
    private String nombre;
    private double precioVenta;
    private double stock;
    private List<IStockObserver> observadores = new ArrayList<>(); 

    public Producto(String codigo, String nombre, double precioVenta, double stock) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.precioVenta = precioVenta;
        this.stock = stock;
    }

    public abstract double calcularImpuesto();
    
    public void agregarObservador(IStockObserver obs) {
        observadores.add(obs);
    }
    
    public void vender(double cantidad) throws SinStockException {
        if (cantidad > this.stock) {
            throw new SinStockException("Sin existencias suficientes para: " + nombre);
        }
        this.stock -= cantidad;

        for (IStockObserver obs : observadores) { 
            obs.notificar(this);
        }
    }

    public String getNombre() { return nombre; }
    public double getPrecioVenta() { return precioVenta; }
    public double getStock() { return stock; }
    public String getCodigo() { return codigo; }
    public void setStock(double stock) {this.stock = stock;}
    
}