import customtkinter as ctk
from tkinter import Canvas
from lexer import Lexer
from parser import Parser
from ast_nodos import (
    NodoAST, Literal, Variable, Asignacion, 
    Bloque, BucleWhile, Condicional, Funcion, ExpresionBinaria, Retorno
)

class AppParser(ctk.CTk):
    """
    Interfaz de visualización AST de alto rendimiento.
    Implementa un algoritmo de medición de subárboles para un espaciado perfecto.
    """
    def __init__(self):
        super().__init__()
        self.title("Analizador de Código C++")
        self.geometry("1400x950")
        ctk.set_appearance_mode("dark")

        # Configuración de navegación
        self.zoom_factor = 1.0
        self.last_x = 0
        self.last_y = 0

        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # Panel de Control que es SideBar
        self.sidebar = ctk.CTkFrame(self, corner_radius=15)
        self.sidebar.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")

        self.lbl_editor = ctk.CTkLabel(
            self.sidebar, text="Configuración del Analizador", 
            font=("Roboto", 18, "bold")
        )
        self.lbl_editor.pack(pady=15)

        self.btn_validar = ctk.CTkButton(
            self.sidebar, text="Generar Árbol", 
            fg_color="#2ecc71", hover_color="#27ae60",
            font=("Roboto", 14, "bold", ), command=self.ejecutar_analisis, text_color="black"
        )
        self.btn_validar.pack(pady=10, padx=20, fill="x")

        self.txt_codigo = ctk.CTkTextbox(
            self.sidebar, font=("Consolas", 13), width=350,
            border_width=2, border_color="#333333"
        )
        self.txt_codigo.pack(expand=True, fill="both", padx=20, pady=10)
        
        # Ejemplo por defecto
        self.txt_codigo.insert("0.0", (
            'int edad = 19; \n'
        ))

        # Canvas con soporte de navegación
        self.canvas_frame = ctk.CTkFrame(self, fg_color="#1a1a1a", corner_radius=15)
        self.canvas_frame.grid(row=0, column=1, padx=20, pady=20, sticky="nsew")
        
        self.canvas = Canvas(
            self.canvas_frame, bg="#1a1a1a", 
            highlightthickness=0, bd=0
        )
        self.canvas.pack(expand=True, fill="both", padx=10, pady=10)

        # Eventos del Mouse
        self.canvas.bind("<Button-1>", self._iniciar_movimiento)
        self.canvas.bind("<B1-Motion>", self._realizar_movimiento)
        self.canvas.bind("<MouseWheel>", self._gestionar_zoom)

    def _iniciar_movimiento(self, event):
        """ Inicia el arrastre del lienzo. """
        self.last_x = event.x
        self.last_y = event.y

    def _realizar_movimiento(self, event):
        """ Desplaza el contenido del canvas. """
        dx = event.x - self.last_x
        dy = event.y - self.last_y
        self.canvas.move("all", dx, dy)
        self.last_x = event.x
        self.last_y = event.y

    def _gestionar_zoom(self, event):
        """ Aplica escala al dibujo. """
        factor = 1.1 if event.delta > 0 else 0.9
        self.zoom_factor *= factor
        self.canvas.scale("all", event.x, event.y, factor, factor)

    def ejecutar_analisis(self):
        """ Coordina las fases del compilador y dibuja el árbol. """
        self.canvas.delete("all")
        codigo = self.txt_codigo.get("0.0", "end")
        
        try:
            lexer = Lexer(codigo)
            tokens = lexer.generar_tokens()
            parser = Parser(tokens)
            ast = parser.parsear()
            
            self._dibujar_nodo_dinamico(ast, 700, 80)
            
        except Exception as error:
            self.canvas.create_text(
                700, 400, text=f"ERROR SINTÁCTICO:\n\n{str(error)}", 
                fill="#ff4d4d", font=("Roboto", 18, "bold"), justify="center"
            )

    def _get_ancho_subarbol(self, nodo):
        """
        Calcula el ancho total que necesita un nodo 
        basado en la cantidad de hojas en su nivel más bajo.
        """
        if nodo is None: return 0
        
        hijos = self._obtener_hijos(nodo)
        if not hijos:
            return 80  # Ancho mínimo de una hoja (círculo + margen)
        
        ancho_total = 0
        for hijo in hijos:
            ancho_total += self._get_ancho_subarbol(hijo)
        return ancho_total

    def _obtener_hijos(self, nodo):
        """ Retorna una lista de nodos hijos según el tipo de nodo AST. """
        if isinstance(nodo, Bloque): return nodo.sentencias
        if isinstance(nodo, Condicional):
            h = [nodo.condicion, nodo.cuerpo_if]
            if nodo.cuerpo_else: h.append(nodo.cuerpo_else)
            return h
        if isinstance(nodo, BucleWhile): return [nodo.condicion, nodo.cuerpo]
        if isinstance(nodo, ExpresionBinaria): return [nodo.izquierda, nodo.derecha]
        if isinstance(nodo, Retorno): return [nodo.valor]
        if isinstance(nodo, (Asignacion, Funcion)):
            return [nodo.valor if hasattr(nodo, 'valor') else nodo.cuerpo]
        return []

    def _dibujar_nodo_dinamico(self, nodo, x, y):
        """
        Dibuja el nodo centrándolo sobre el ancho total de sus hijos.
        """
        if nodo is None: return

        hijos = self._obtener_hijos(nodo)
        dist_y = 120 
        y_hijo = y + dist_y

        if hijos:

            ancho_total = self._get_ancho_subarbol(nodo)

            x_cursor = x - (ancho_total / 2)

            for hijo in hijos:
                ancho_hijo = self._get_ancho_subarbol(hijo)

                x_hijo = x_cursor + (ancho_hijo / 2)
                
                # Color de las lineas
                color_linea = "#555"
                if isinstance(nodo, Condicional) and hijo == nodo.condicion: 
                    color_linea = "#f1c40f" # Condición en amarillo
                
                self.canvas.create_line(x, y, x_hijo, y_hijo, fill=color_linea, width=2)
                self._dibujar_nodo_dinamico(hijo, x_hijo, y_hijo)
                
                x_cursor += ancho_hijo

        # Dibujar circulos
        estilo = self._obtener_estilo(nodo)
        r = 34
        self.canvas.create_oval(x-r, y-r, x+r, y+r, fill=estilo['col'], outline="white", width=2)
        self.canvas.create_text(x, y, text=estilo['txt'], fill="white", font=("Roboto", 9, "bold"), width=r*1.8)

    def _obtener_estilo(self, nodo):
        """ Define colores y etiquetas para el árbol [cite: 3273-3285]. """
        if isinstance(nodo, Literal): return {'txt': f"LIT: {nodo.valor}", 'col': "#9b59b6"}
        if isinstance(nodo, Variable): return {'txt': f"VAR: {nodo.nombre}", 'col': "#e67e22"}
        if isinstance(nodo, Asignacion): return {'txt': f"= ({nodo.target})", 'col': "#1abc9c"}
        if isinstance(nodo, BucleWhile): return {'txt': "WHILE", 'col': "#f1c40f"}
        if isinstance(nodo, Condicional): return {'txt': "IF-ELSE", 'col': "#e74c3c"}
        if isinstance(nodo, Funcion): return {'txt': f"FUNC:\n{nodo.nombre}", 'col': "#3498db"}
        if isinstance(nodo, Retorno): return {'txt': "RETURN", 'col': "#e67e22"}
        if isinstance(nodo, ExpresionBinaria): return {'txt': f"OP: {nodo.operador}", 'col': "#34495e"}
        return {'txt': type(nodo).__name__.upper(), 'col': "#3498db"}

if __name__ == "__main__":
    app = AppParser()
    app.mainloop()