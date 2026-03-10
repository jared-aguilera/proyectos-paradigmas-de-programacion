from tokens import TokenType
from ast_nodos import *

class Parser:
    """
    Analizador sintáctico estricto. Implementa jerarquía de operadores
    para evitar errores de precedencia en C++.
    """
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def _actual(self):
        return self.tokens[self.pos]

    def _consumir(self, tipo_esperado):
        if self._actual()[0] == tipo_esperado:
            token = self._actual()
            self.pos += 1
            return token
        raise Exception(f"Error Sintáctico: Se esperaba '{tipo_esperado.name}' cerca de '{self._actual()[1]}'")

    def parsear(self):
        sentencias = []
        while self._actual()[0] != TokenType.EOF:
            sentencias.append(self._sentencia())
        return Bloque(sentencias)

    def _sentencia(self):
        tipo = self._actual()[0]
        # if tipo == TokenType.DEF: return self._funcion()
        if tipo in [TokenType.INT_TYPE, TokenType.FLOAT_TYPE, TokenType.STR_TYPE, TokenType.VOID_TYPE]:
            if self.pos + 2 < len(self.tokens) and self.tokens[self.pos + 2][0] == TokenType.LPAREN:
                return self._funcion()
            return self._asignacion()
        
        if tipo == TokenType.IF: return self._if_else()
        if tipo == TokenType.WHILE: return self._while()
        if tipo == TokenType.RETURN: return self._retorno()
        
        if tipo == TokenType.COUT: return self._impresion()
        if tipo == TokenType.CIN: return self._entrada()
        
        if tipo in [TokenType.INT_TYPE, TokenType.FLOAT_TYPE, TokenType.STR_TYPE, TokenType.IDENTIFIER]: 
            return self._asignacion()
        raise Exception(f"Línea no reconocida: {self._actual()[1]}")

    def _asignacion(self):
        if self._actual()[0] in [TokenType.INT_TYPE, TokenType.FLOAT_TYPE, TokenType.STR_TYPE, TokenType.VOID_TYPE]: 
            self.pos += 1
        
        nombre = self._consumir(TokenType.IDENTIFIER)[1]
        self._consumir(TokenType.ASSIGN)
        valor = self._expresion() 
        self._consumir(TokenType.SEMICOLON) 
        return Asignacion(nombre, valor)

    # --- JERARQUÍA DE OPERACIONES ---

    def _expresion(self):
        """ Nivel 1: Sumas, Restas y Comparaciones """
        izq = self._termino() # Llama al nivel de multiplicaciones
        ops = [TokenType.PLUS, TokenType.MINUS, TokenType.GE, TokenType.LE, TokenType.EQ, TokenType.GT, TokenType.LT]
        while self._actual()[0] in ops:
            op = self._consumir(self._actual()[0])[1]
            der = self._termino()
            izq = ExpresionBinaria(izq, op, der)
        return izq

    def _termino(self):
        """ Nivel 2: Multiplicaciones y Divisiones """
        izq = self._factor() # Llama al nivel de números/variables
        ops = [TokenType.MULTIPLY, TokenType.DIVIDE]
        while self._actual()[0] in ops:
            op = self._consumir(self._actual()[0])[1]
            der = self._factor()
            izq = ExpresionBinaria(izq, op, der)
        return izq

    def _factor(self):
        """ Nivel 3: Valores base (Números, IDs, Paréntesis) """
        tk = self._actual()
        
        if tk[0] == TokenType.NUMBER:
            self.pos += 1
            valor_texto = tk[1]
            # Si contiene un punto, se convierte a float; si no, a int
            valor_num = float(valor_texto) if '.' in valor_texto else int(valor_texto)
            return Literal(valor_num)
        
        if tk[0] == TokenType.STRING:
            self.pos += 1
            return Literal(tk[1])
        if tk[0] == TokenType.IDENTIFIER:
            self.pos += 1
            return Variable(tk[1])
        if tk[0] == TokenType.LPAREN:
            self.pos += 1
            expr = self._expresion()
            self._consumir(TokenType.RPAREN)
            return expr
        raise Exception(f"Se esperaba un valor o variable, pero se encontró: {tk[1]}")

    # --- ESTRUCTURAS DE CONTROL ---

    def _if_else(self):
        self.pos += 1 
        self._consumir(TokenType.LPAREN)
        cond = self._expresion()
        self._consumir(TokenType.RPAREN)
        self._consumir(TokenType.LBRACE)
        cuerpo = self._bloque_interno()
        self._consumir(TokenType.RBRACE)
        sino = None
        if self._actual()[0] == TokenType.ELSE:
            self.pos += 1
            self._consumir(TokenType.LBRACE)
            sino = self._bloque_interno()
            self._consumir(TokenType.RBRACE)
        return Condicional(cond, cuerpo, sino)

    def _while(self):
        self.pos += 1 
        self._consumir(TokenType.LPAREN)
        cond = self._expresion()
        self._consumir(TokenType.RPAREN)
        self._consumir(TokenType.LBRACE)
        cuerpo = self._bloque_interno()
        self._consumir(TokenType.RBRACE)
        return BucleWhile(cond, cuerpo)

    def _funcion(self):
        self.pos += 1 
        nombre = self._consumir(TokenType.IDENTIFIER)[1]
        self._consumir(TokenType.LPAREN)
        params = []
        if self._actual()[0] == TokenType.IDENTIFIER:
            params.append(self._consumir(TokenType.IDENTIFIER)[1])
        self._consumir(TokenType.RPAREN)
        self._consumir(TokenType.LBRACE)
        cuerpo = self._bloque_interno()
        self._consumir(TokenType.RBRACE)
        return Funcion(nombre, params, cuerpo)

    def _bloque_interno(self):
        sentencias = []
        while self._actual()[0] not in [TokenType.RBRACE, TokenType.EOF]:
            sentencias.append(self._sentencia())
        return Bloque(sentencias)
    
    def _retorno(self):
        self.pos += 1  
        valor = self._expresion()
        self._consumir(TokenType.SEMICOLON) 
        return Retorno(valor)
    
    def _impresion(self):
        self.pos += 1  # Salta 'cout'
        self._consumir(TokenType.LSHIFT)
        valor = self._expresion()
        self._consumir(TokenType.SEMICOLON)
        return Impresion(valor)

    def _entrada(self):
        self.pos += 1  # Salta 'cin'
        self._consumir(TokenType.RSHIFT)
        nombre = self._consumir(TokenType.IDENTIFIER)[1]
        self._consumir(TokenType.SEMICOLON)
        return Entrada(nombre)