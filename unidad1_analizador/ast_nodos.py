from dataclasses import dataclass
from typing import List, Union, Optional

@dataclass
class NodoAST:
    """
    Clase base para todos los nodos del árbol
    """
    pass

@dataclass
class ExpresionBinaria(NodoAST):
    """
    Representa operaciones con dos operandos (a + b, x >= 10)
    """
    izquierda: NodoAST
    operador: str
    derecha: NodoAST

@dataclass
class Literal(NodoAST):
    """
    Representa valores constantes
    """
    valor: Union[int, float, str, bool]

@dataclass
class Variable(NodoAST):
    """
    Representa un nombre de variable
    """
    nombre: str

@dataclass
class Asignacion(NodoAST):
    """
    Representa la instrucción de asignar un valor a una variable
    """
    target: str
    valor: NodoAST

@dataclass
class Bloque(NodoAST):
    """
    Contiene un conjunto de sentencias
    """
    sentencias: List[NodoAST]

@dataclass
class Condicional(NodoAST):
    """
    Representa la estructura de control if-else
    """
    condicion: NodoAST
    cuerpo_if: Bloque
    cuerpo_else: Optional[Bloque] = None

@dataclass
class BucleWhile(NodoAST):
    """
    Representa un ciclo mientras
    """
    condicion: NodoAST
    cuerpo: Bloque

@dataclass
class Funcion(NodoAST):
    """
    Representa la definición de una función
    """
    nombre: str
    parametros: List[str]
    cuerpo: Bloque

@dataclass
class Retorno(NodoAST):
    """ Representa la instrucción return """
    valor: NodoAST