from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pyswip import Prolog
from pydantic import BaseModel
from typing import List
import os

DIRECTORIO_ACTUAL = os.path.dirname(os.path.abspath(__file__))
DIRECTORIO_RAIZ = os.path.dirname(DIRECTORIO_ACTUAL)

RUTA_BASE_MEDICA = os.path.join(DIRECTORIO_RAIZ, "prolog", "base_medica.pl").replace("\\", "/")
RUTA_EXPLICACIONES = os.path.join(DIRECTORIO_RAIZ, "prolog", "explicaciones.pl").replace("\\", "/")
RUTA_FRONTEND = os.path.join(DIRECTORIO_RAIZ, "frontend")

prolog = Prolog()

@asynccontextmanager
async def lifespan(app: FastAPI):
    prolog.consult(RUTA_BASE_MEDICA)
    prolog.consult(RUTA_EXPLICACIONES)
    yield

app = FastAPI(lifespan=lifespan)

class DiagnosticoRequest(BaseModel):
    sintomas: List[str]

@app.post("/diagnosticar")
async def diagnosticar(datos: DiagnosticoRequest):
    try:
        for s in datos.sintomas:
            prolog.assertz(f"tiene_sintoma({s})")

        resultado = list(prolog.query("diagnosticar(Enfermedad)"))

        if resultado:
            enfermedad = str(resultado[0]['Enfermedad'])
            
            if "No se pudo" in enfermedad:
                return {
                    "diagnostico": "Sin diagnostico",
                    "explicacion_how": "Los sintomas ingresados no coinciden con ninguna enfermedad en la base de conocimiento actual"
                }
            
            explicacion = list(prolog.query(f"solve_how(diagnostico({enfermedad}), Arbol)"))
            arbol_how = str(explicacion[0]['Arbol']) if explicacion else "Sin explicación"

            return {
                "diagnostico": enfermedad,
                "explicacion_how": arbol_how
            }
        else:
            return {"diagnostico": "No se pudo determinar un diagnostico exacto.", "explicacion_how": ""}
    
    finally:
        prolog.retractall("tiene_sintoma(_)")

app.mount("/", StaticFiles(directory=RUTA_FRONTEND, html=True), name="frontend")