import re
from tokens import TokenType

class Lexer:
    """
    Transforma el código fuente en una secuencia de tokens válidos
    """
    def __init__(self, codigo):
        self.codigo = codigo
        self.posicion = 0
        self._keywords = {
            'int': TokenType.INT_TYPE, 'float': TokenType.FLOAT_TYPE, 'string': TokenType.STR_TYPE,
            'if': TokenType.IF, 'else': TokenType.ELSE, 
            'while': TokenType.WHILE, 'def': TokenType.DEF,
            'return': TokenType.RETURN
        }

    def generar_tokens(self):
        """
        Escanea el texto y clasifica los lexemas siguiendo la regla del match más largo
        """
        patrones = [
            (r'\d+\.\d+', TokenType.NUMBER),
            (r'[0-9]+', TokenType.NUMBER),
            (r'"[^"]*"', TokenType.STRING),
            (r'[a-zA-Z_][a-zA-Z0-9_]*', TokenType.IDENTIFIER),
            (r'==', TokenType.EQ),
            (r'>=', TokenType.GE),
            (r'<=', TokenType.LE),
            (r'>', TokenType.GT),
            (r'<', TokenType.LT),
            (r'=', TokenType.ASSIGN),
            (r'\+', TokenType.PLUS),
            (r'-', TokenType.MINUS),
            (r'\*', TokenType.MULTIPLY),
            (r'/', TokenType.DIVIDE),
            (r';', TokenType.SEMICOLON),
            (r'\(', TokenType.LPAREN),
            (r'\)', TokenType.RPAREN),
            (r'\{', TokenType.LBRACE),
            (r'\}', TokenType.RBRACE),
            (r':', TokenType.COLON),
        ]

        tokens = []
        while self.posicion < len(self.codigo):
            if self.codigo[self.posicion].isspace():
                self.posicion += 1
                continue

            exito = False
            for patron, tipo in patrones:
                regex = re.compile(patron)
                match = regex.match(self.codigo, self.posicion)
                if match:
                    texto = match.group(0)
                    if tipo == TokenType.IDENTIFIER and texto in self._keywords:
                        tipo = self._keywords[texto]
                    tokens.append((tipo, texto))
                    self.posicion = match.end()
                    exito = True
                    break
            if not exito: self.posicion += 1
            
        tokens.append((TokenType.EOF, "EOF"))
        return tokens