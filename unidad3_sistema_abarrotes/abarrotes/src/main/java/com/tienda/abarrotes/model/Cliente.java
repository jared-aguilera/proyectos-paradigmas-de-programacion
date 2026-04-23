package com.tienda.abarrotes.model;

public class Cliente {
    private String nombre;
    private String telefono;
    private int puntosAcumulados;

    public Cliente(String nombre, String telefono) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.puntosAcumulados = 0;
    }

    public void sumarPuntos(int puntos) {
        this.puntosAcumulados += puntos;
    }

    public String getNombre() { return nombre; }
    public String getTelefono() { return telefono; }
    public int getPuntosAcumulados() { return puntosAcumulados; }
}