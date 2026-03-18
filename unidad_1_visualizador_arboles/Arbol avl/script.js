const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
let raiz = null;
let escala = 1;
let origenX = 0;
let origenY = 0;
let estaArrastrando = false;
let ultimaPosMouse = { x: 0, y: 0 };
let modoMatematico = false;

class Nodo {
    constructor(valor) {
        this.valor = valor;
        this.izq = null;
        this.der = null;
        this.x = 0;
        this.y = 0;
        this.altura = 1;
        this.color = "white";
    }
}

function getAltura(n) {
    return n ? n.altura : 0;
}

function getBalance(n) {
    return n ? getAltura(n.izq) - getAltura(n.der) : 0;
}

function rotarDerecha(y) {
    let x = y.izq;
    let T2 = x.der;
    x.der = y;
    y.izq = T2;
    y.altura = Math.max(getAltura(y.izq), getAltura(y.der)) + 1;
    x.altura = Math.max(getAltura(x.izq), getAltura(x.der)) + 1;
    return x;
}

function rotarIzquierda(x) {
    let y = x.der;
    let T2 = y.izq;
    y.izq = x;
    x.der = T2;
    x.altura = Math.max(getAltura(x.izq), getAltura(x.der)) + 1;
    y.altura = Math.max(getAltura(y.izq), getAltura(y.der)) + 1;
    return y;
}

function insertarAVL(nodo, valor) {
    if (!nodo) return new Nodo(valor);
    if (valor < nodo.valor) {
        nodo.izq = insertarAVL(nodo.izq, valor);
    } else if (valor > nodo.valor) {
        nodo.der = insertarAVL(nodo.der, valor);
    } else {
        return nodo;
    }
    nodo.altura = 1 + Math.max(getAltura(nodo.izq), getAltura(nodo.der));
    let balance = getBalance(nodo);
    // Caso izquierda-izquierda
    if (balance > 1 && valor < nodo.izq.valor) {
        return rotarDerecha(nodo);
    }
    // Caso derecha-derecha
    if (balance < -1 && valor > nodo.der.valor) {
        return rotarIzquierda(nodo);
    }
    // Caso izquierda-derecha
    if (balance > 1 && valor > nodo.izq.valor) {
        nodo.izq = rotarIzquierda(nodo.izq);
        return rotarDerecha(nodo);
    }
    // Caso derecha-izquierda
    if (balance < -1 && valor < nodo.der.valor) {
        nodo.der = rotarDerecha(nodo.der);
        return rotarIzquierda(nodo);
    }
    return nodo;
}

function eliminarAVL(nodo, valor) {
    if (!nodo) return nodo;
    if (valor < nodo.valor) {
        nodo.izq = eliminarAVL(nodo.izq, valor);
    } else if (valor > nodo.valor) {
        nodo.der = eliminarAVL(nodo.der, valor);
    } else {
        // Nodo encontrado
        if (!nodo.izq || !nodo.der) {
            // Tiene uno o ningun hijo
            let temp = nodo.izq ? nodo.izq : nodo.der;
            if (!temp) {
                temp = nodo;
                nodo = null;
            } else {
                nodo = temp;
            }
        } else {
            // Tiene dos hijos: obtener el sucesor inorder (menor del subarbol derecho)
            let temp = (function(n) {
                let curr = n;
                while (curr.izq !== null) curr = curr.izq;
                return curr;
            })(nodo.der);
            nodo.valor = temp.valor;
            nodo.der = eliminarAVL(nodo.der, temp.valor);
        }
    }
    if (!nodo) return nodo;
    nodo.altura = 1 + Math.max(getAltura(nodo.izq), getAltura(nodo.der));
    let balance = getBalance(nodo);
    // Rebalanceo despues de eliminacion
    if (balance > 1 && getBalance(nodo.izq) >= 0) {
        return rotarDerecha(nodo);
    }
    if (balance > 1 && getBalance(nodo.izq) < 0) {
        nodo.izq = rotarIzquierda(nodo.izq);
        return rotarDerecha(nodo);
    }
    if (balance < -1 && getBalance(nodo.der) <= 0) {
        return rotarIzquierda(nodo);
    }
    if (balance < -1 && getBalance(nodo.der) > 0) {
        nodo.der = rotarDerecha(nodo.der);
        return rotarIzquierda(nodo);
    }
    return nodo;
}

function eliminarNodoSimple(nodo, valor) {
    // Eliminacion para arbol de expresion (sin rebalanceo)
    if (!nodo) return null;
    if (valor === nodo.valor) {
        if (!nodo.izq && !nodo.der) return null;
        if (!nodo.izq) return nodo.der;
        if (!nodo.der) return nodo.izq;
        // Tiene dos hijos: obtener sucesor inorder
        let temp = (function(n) {
            let curr = n;
            while (curr.izq !== null) curr = curr.izq;
            return curr;
        })(nodo.der);
        nodo.valor = temp.valor;
        nodo.der = eliminarNodoSimple(nodo.der, temp.valor);
    } else {
        nodo.izq = eliminarNodoSimple(nodo.izq, valor);
        nodo.der = eliminarNodoSimple(nodo.der, valor);
    }
    return nodo;
}

function agregarNodo() {
    const input = document.getElementById('nodoValor');
    const val = parseInt(input.value);
    if (isNaN(val)) return;
    modoMatematico = false;
    raiz = insertarAVL(raiz, val);
    actualizarYDibujar();
    input.value = '';
}

function procesarExpresion() {
    let exp = document.getElementById('nodoValor').value;
    if (!exp) return;
    modoMatematico = true;

    // Detectar variables
    let variables = exp.match(/[a-zA-Z]/g);
    variables = variables ? [...new Set(variables)] : [];
    let valores = {};

    // Preguntar valores al usuario
    variables.forEach(v => {
        let val = prompt(`Que valor quieres darle a ${v}?`);
        valores[v] = parseFloat(val);
    });

    // Reemplazar variables por sus valores numericos
    for (let v in valores) {
        let regex = new RegExp(v, 'g');
        exp = exp.replace(regex, valores[v]);
    }

    // Tokenizacion correcta (sin espacios)
    const tokens = exp.replace(/\s+/g, '').match(/[0-9]+|[a-zA-Z]+|[\^+*/()-]/g);
    if (!tokens) return;

    const prioridad = (op) => {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        if (op === '^') return 3;
        return 0;
    };

    const salida = [];
    const operadores = [];

    tokens.forEach(t => {
        // Acepta numeros y variables (aunque ya reemplazadas, podrian quedar letras)
        if (/^[a-zA-Z0-9]+$/.test(t)) {
            salida.push(new Nodo(t));
        } else if (t === '(') {
            operadores.push(t);
        } else if (t === ')') {
            while (operadores.length && operadores[operadores.length - 1] !== '(') {
                let n = new Nodo(operadores.pop());
                n.der = salida.pop();
                n.izq = salida.pop();
                salida.push(n);
            }
            operadores.pop(); // quita '('
        } else {
            // Operador
            while (
                operadores.length &&
                prioridad(operadores[operadores.length - 1]) >= prioridad(t)
            ) {
                let n = new Nodo(operadores.pop());
                n.der = salida.pop();
                n.izq = salida.pop();
                salida.push(n);
            }
            operadores.push(t);
        }
    });

    while (operadores.length) {
        let n = new Nodo(operadores.pop());
        n.der = salida.pop();
        n.izq = salida.pop();
        salida.push(n);
    }

    raiz = salida[0];
    actualizarYDibujar();
}

function cargarJSON(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        const data = JSON.parse(ev.target.result);
        reiniciar();

        // Caso nuevo: arreglo con una expresion como string
        if (Array.isArray(data) && typeof data[0] === "string") {
            document.getElementById('nodoValor').value = data[0];
            procesarExpresion();
        }
        // Caso objeto con campo expresion
        else if (data.expresion) {
            document.getElementById('nodoValor').value = data.expresion;
            procesarExpresion();
        }
        // Caso arreglo de numeros (arbol AVL)
        else if (Array.isArray(data)) {
            modoMatematico = false;
            data.forEach(v => {
                raiz = insertarAVL(raiz, v);
            });
            actualizarYDibujar();
        }
    };
    reader.readAsText(e.target.files[0]);
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left - origenX) / escala;
    const my = (e.clientY - rect.top - origenY) / escala;
    const nodo = (function buscar(n) {
        if (!n) return null;
        if (Math.sqrt((mx - n.x) ** 2 + (my - n.y) ** 2) < 22) return n;
        return buscar(n.izq) || buscar(n.der);
    })(raiz);
    if (nodo) {
        limpiarColores(raiz);
        nodo.color = "#f1c40f";
        dibujar();
        setTimeout(() => {
            if (confirm(`¿Eliminar nodo con valor: ${nodo.valor}?`)) {
                raiz = modoMatematico ? eliminarNodoSimple(raiz, nodo.valor) : eliminarAVL(raiz, nodo.valor);
                actualizarYDibujar();
            } else {
                limpiarColores(raiz);
                dibujar();
            }
        }, 50);
    }
});

function actualizarPosiciones(n, x, y, offset) {
    if (!n) return;
    n.x = x;
    n.y = y;
    actualizarPosiciones(n.izq, x - offset, y + 70, offset / 1.9);
    actualizarPosiciones(n.der, x + offset, y + 70, offset / 1.9);
}

function actualizarYDibujar() {
    actualizarPosiciones(raiz, canvas.width / 2, 50, canvas.width / 4);
    dibujar();
}

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(origenX, origenY);
    ctx.scale(escala, escala);
    if (raiz) {
        // Dibujar lineas (conexiones)
        (function dibujarLineas(n) {
            ctx.strokeStyle = "#bdc3c7";
            ctx.lineWidth = 2;
            if (n.izq) {
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(n.izq.x, n.izq.y);
                ctx.stroke();
                dibujarLineas(n.izq);
            }
            if (n.der) {
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(n.der.x, n.der.y);
                ctx.stroke();
                dibujarLineas(n.der);
            }
        })(raiz);

        // Dibujar circulos de los nodos
        (function dibujarCirculos(n) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 22, 0, 2 * Math.PI);
            ctx.fillStyle = n.color;
            ctx.fill();
            ctx.strokeStyle = "#2c3e50";
            ctx.stroke();
            ctx.fillStyle = n.color === "white" ? "black" : "white";
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(n.valor, n.x, n.y);
            if (n.izq) dibujarCirculos(n.izq);
            if (n.der) dibujarCirculos(n.der);
        })(raiz);
    }
    ctx.restore();
}

async function iniciarRecorrido(tipo) {
    if (!raiz) return;
    limpiarColores(raiz);
    let orden = [];
    if (tipo === 'pre') {
        (function preorden(n) {
            if (n) {
                orden.push(n);
                preorden(n.izq);
                preorden(n.der);
            }
        })(raiz);
    } else if (tipo === 'in') {
        (function inorden(n) {
            if (n) {
                inorden(n.izq);
                orden.push(n);
                inorden(n.der);
            }
        })(raiz);
    } else if (tipo === 'post') {
        (function postorden(n) {
            if (n) {
                postorden(n.izq);
                postorden(n.der);
                orden.push(n);
            }
        })(raiz);
    } else if (tipo === 'bfs') {
        let cola = [raiz];
        while (cola.length) {
            let actual = cola.shift();
            orden.push(actual);
            if (actual.izq) cola.push(actual.izq);
            if (actual.der) cola.push(actual.der);
        }
    } else if (tipo === 'dfs') {
        let pila = [raiz];
        while (pila.length) {
            let actual = pila.pop();
            orden.push(actual);
            if (actual.der) pila.push(actual.der);
            if (actual.izq) pila.push(actual.izq);
        }
    }
    const listaDiv = document.getElementById('lista-nodos');
    listaDiv.innerHTML = "";
    for (let n of orden) {
        n.color = "#e67e22";
        dibujar();
        let span = document.createElement("span");
        span.innerText = n.valor + " ";
        span.className = "current-val";
        listaDiv.appendChild(span);
        await new Promise(resolve => setTimeout(resolve, 500));
        n.color = "#3498db";
        dibujar();
    }
}

function limpiarColores(n) {
    if (n) {
        n.color = "white";
        limpiarColores(n.izq);
        limpiarColores(n.der);
    }
}

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    escala *= (e.deltaY > 0 ? 0.9 : 1.1);
    dibujar();
}, { passive: false });

canvas.addEventListener('mousedown', (e) => {
    estaArrastrando = true;
    ultimaPosMouse = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
    if (!estaArrastrando) return;
    origenX += e.clientX - ultimaPosMouse.x;
    origenY += e.clientY - ultimaPosMouse.y;
    ultimaPosMouse = { x: e.clientX, y: e.clientY };
    dibujar();
});

window.addEventListener('mouseup', () => {
    estaArrastrando = false;
});

function reiniciar() {
    raiz = null;
    escala = 1;
    origenX = 0;
    origenY = 0;
    dibujar();
}