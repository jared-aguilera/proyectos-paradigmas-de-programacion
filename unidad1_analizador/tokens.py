from enum import Enum

class TokenType(Enum):
    """
    Define los tokens para C++
    """
    # Tipos y Literales
    INT_TYPE = "TIPO_ENTERO"
    FLOAT_TYPE = "TIPO_FLOAT"
    STR_TYPE = "TIPO_CADENA"
    VOID_TYPE = "TIPO_VOID"
    BOOL_TYPE = "TIPO_BOOLEANO"
    IDENTIFIER = "IDENTIFICADOR"
    NUMBER = "NUMERO"
    STRING = "CADENA"

    # Operadores
    ASSIGN = "ASIGNACION"
    PLUS = "SUMA"
    MINUS = "RESTA"
    MULTIPLY = "MULTIPLICACION"
    DIVIDE = "DIVISION"
    EQ = "IGUAL_A"
    GE = "MAYOR_IGUAL"
    LE = "MENOR_IGUAL"
    GT = "MAYOR_QUE"
    LT = "MENOR_QUE"

    # Delimitadores
    SEMICOLON = "PUNTO_COMA"
    LPAREN = "PARENTESIS_IZQ"
    RPAREN = "PARENTESIS_DER"
    LBRACE = "LLAVE_IZQ"
    RBRACE = "LLAVE_DER"
    COMMA = "COMA"
    COLON = "DOS_PUNTOS"

    # Palabras Reservadas
    IF = "SI"
    ELSE = "SINO"
    WHILE = "MIENTRAS"
    DEF = "DEFINIR"
    RETURN = "RETORNO"
    CIN = "CIN"
    COUT = "COUT"
    
    LSHIFT = "DESPLAZAMIENTO_IZQ"
    RSHIFT = "DESPLAZAMIENTO_DER" 
    
    EOF = "FIN_ARCHIVO"
    UNKNOWN = "DESCONOCIDO"