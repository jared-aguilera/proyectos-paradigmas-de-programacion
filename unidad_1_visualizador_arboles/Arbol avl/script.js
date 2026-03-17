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

function getAltura(n) { return n ? n.altura : 0; }
function getBalance(n) { return n ? getAltura(n.izq) - getAltura(n.der) : 0; }

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
    if (valor < nodo.valor) nodo.izq = insertarAVL(nodo.izq, valor);
    else if (valor > nodo.valor) nodo.der = insertarAVL(nodo.der, valor);
    else return nodo;
    nodo.altura = 1 + Math.max(getAltura(nodo.izq), getAltura(nodo.der));
    let balance = getBalance(nodo);
    if (balance > 1 && valor < nodo.izq.valor) return rotarDerecha(nodo);
    if (balance < -1 && valor > nodo.der.valor) return rotarIzquierda(nodo);
    if (balance > 1 && valor > nodo.izq.valor) {  //el peso esta en el hijo izquierdo pero nieto derecho
        nodo.izq = rotarIzquierda(nodo.izq); //primero rotamos a la izquiera, luego a la derecha el apdre
        return rotarDerecha(nodo);
    }
    if (balance < -1 && valor < nodo.der.valor) { //el peso esta en el hijo derecho pero nieto izquierdo
        nodo.der = rotarDerecha(nodo.der); //la inversa del de arriba
        return rotarIzquierda(nodo);
    }
    return nodo;
}

function eliminarAVL(nodo, valor) {
    if (!nodo) return nodo;
    if (valor < nodo.valor) nodo.izq = eliminarAVL(nodo.izq, valor);
    else if (valor > nodo.valor) nodo.der = eliminarAVL(nodo.der, valor);
    else {
        if (!nodo.izq || !nodo.der) {
            let temp = nodo.izq ? nodo.izq : nodo.der;
            if (!temp) { temp = nodo; nodo = null; }
            else nodo = temp;
        } else {
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
    if (balance > 1 && getBalance(nodo.izq) >= 0) return rotarDerecha(nodo);
    if (balance > 1 && getBalance(nodo.izq) < 0) {
        nodo.izq = rotarIzquierda(nodo.izq);
        return rotarDerecha(nodo);
    }
    if (balance < -1 && getBalance(nodo.der) <= 0) return rotarIzquierda(nodo);
    if (balance < -1 && getBalance(nodo.der) > 0) {
        nodo.der = rotarDerecha(nodo.der);
        return rotarIzquierda(nodo);
    }
    return nodo;
}

function eliminarNodoSimple(nodo, valor) {  
    if (!nodo) return null; 
    if (valor === nodo.valor) {
        if (!nodo.izq && !nodo.der) return null;
        if (!nodo.izq) return nodo.der;
        if (!nodo.der) return nodo.izq;
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
    const exp = document.getElementById('nodoValor').value;
    if (!exp) return;
    modoMatematico = true;
    
    const tokens = exp.replace(/\s+/g, '').match(/[a-zA-Z0-9]+|[+*/()-]/g);
    if (!tokens) return;

    const prioritizar = (op) => (op === '+' || op === '-') ? 1 : (op === '*' || op === '/') ? 2 : 0;
    const salida = [], operadores = [];

    tokens.forEach(t => {
        
        if (/[a-zA-Z0-9]/.test(t)) {
            salida.push(new Nodo(t));
        } else if (t === '(') {
            operadores.push(t);
        } else if (t === ')') {
            while (operadores.length && operadores[operadores.length-1] !== '(') {
                let n = new Nodo(operadores.pop());
                n.der = salida.pop(); n.izq = salida.pop(); salida.push(n);
            }
            operadores.pop();
        } else {
            while (operadores.length && prioritizar(operadores[operadores.length-1]) >= prioritizar(t)) {
                let n = new Nodo(operadores.pop());
                n.der = salida.pop(); n.izq = salida.pop(); salida.push(n);
            }
            operadores.push(t);
        }
    });

    while (operadores.length) {
        let n = new Nodo(operadores.pop());
        n.der = salida.pop(); n.izq = salida.pop(); salida.push(n);
    }
    raiz = salida[0];
    actualizarYDibujar();
}

function cargarJSON(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        const data = JSON.parse(ev.target.result);
        reiniciar();
        
        if (data.expresion) {
            document.getElementById('nodoValor').value = data.expresion;
            procesarExpresion();
        } else if (Array.isArray(data)) {
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
        if(!n) return null;
        if(Math.sqrt((mx-n.x)**2 + (my-n.y)**2) < 22) return n;
        return buscar(n.izq) || buscar(n.der);
    })(raiz);
    if (nodo) {
        limpiarColores(raiz);
        nodo.color = "#f1c40f"; dibujar();
        setTimeout(() => {
            if (confirm(`¿Eliminar nodo con valor: ${nodo.valor}?`)) {
                raiz = modoMatematico ? eliminarNodoSimple(raiz, nodo.valor) : eliminarAVL(raiz, nodo.valor);
                actualizarYDibujar();
            } else {
                limpiarColores(raiz); dibujar();
            }
        }, 50);
    }
});

function actualizarPosiciones(n, x, y, offset) {
    if (!n) return;
    n.x = x; n.y = y;
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
    ctx.translate(origenX, origenY); ctx.scale(escala, escala);
    if (raiz) {
        (function dL(n) {
            ctx.strokeStyle = "#bdc3c7"; ctx.lineWidth = 2;
            if (n.izq) { ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(n.izq.x, n.izq.y); ctx.stroke(); dL(n.izq); }
            if (n.der) { ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(n.der.x, n.der.y); ctx.stroke(); dL(n.der); }
        })(raiz);
        (function dC(n) {
            ctx.beginPath(); ctx.arc(n.x, n.y, 22, 0, 7);
            ctx.fillStyle = n.color; ctx.fill(); ctx.strokeStyle = "#2c3e50"; ctx.stroke();
            ctx.fillStyle = n.color === "white" ? "black" : "white";
            ctx.font = "bold 14px Arial"; ctx.textAlign = "center";
            ctx.fillText(n.valor, n.x, n.y + 6);
            if (n.izq) dC(n.izq); if (n.der) dC(n.der);
        })(raiz);
    }
    ctx.restore();
}

async function iniciarRecorrido(tipo) {
    if (!raiz) return;
    limpiarColores(raiz);
    let orden = [];
    if (tipo === 'pre') (function r(n){ if(n){ orden.push(n); r(n.izq); r(n.der); }})(raiz);
    else if (tipo === 'in') (function r(n){ if(n){ r(n.izq); orden.push(n); r(n.der); }})(raiz);
    else if (tipo === 'post') (function r(n){ if(n){ r(n.izq); r(n.der); orden.push(n); }})(raiz);
    else if (tipo === 'bfs') {
        let q = [raiz];
        while(q.length){ let c = q.shift(); orden.push(c); if(c.izq) q.push(c.izq); if(c.der) q.push(c.der); }
    } else if (tipo === 'dfs') {
        let s = [raiz];
        while(s.length){ let c = s.pop(); orden.push(c); if(c.der) s.push(c.der); if(c.izq) s.push(c.izq); }
    }
    const listaDiv = document.getElementById('lista-nodos');
    listaDiv.innerHTML = "";
    for (let n of orden) {
        n.color = "#e67e22"; dibujar();
        let s = document.createElement("span"); s.innerText = n.valor + " "; s.className = "current-val";
        listaDiv.appendChild(s);
        await new Promise(r => setTimeout(r, 500));
        n.color = "#3498db"; dibujar();
    }
}

function limpiarColores(n) { if(n){ n.color="white"; limpiarColores(n.izq); limpiarColores(n.der); } }

canvas.addEventListener('wheel', (e) => {
    e.preventDefault(); escala *= (e.deltaY > 0 ? 0.9 : 1.1); dibujar();
}, { passive: false });

canvas.addEventListener('mousedown', (e) => { estaArrastrando = true; ultimaPosMouse = { x: e.clientX, y: e.clientY }; });
window.addEventListener('mousemove', (e) => {
    if (!estaArrastrando) return;
    origenX += e.clientX - ultimaPosMouse.x; origenY += e.clientY - ultimaPosMouse.y;
    ultimaPosMouse = { x: e.clientX, y: e.clientY }; dibujar();
});
window.addEventListener('mouseup', () => estaArrastrando = false);
function reiniciar() { raiz = null; escala = 1; origenX = 0; origenY = 0; dibujar(); }