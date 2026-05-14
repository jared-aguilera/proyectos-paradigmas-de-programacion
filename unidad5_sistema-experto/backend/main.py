from fastapi import FastAPI
from contextlib import asynccontextmanager
from pyswip import Prolog
from pydantic import BaseModel
from typing import List

#instancia global de motor
prolog = Prolog()

@asynccontextmanager
async def lifespan(app: FastAPI):
    prolog.consult("prolog/base_medica.pl")
    yield

app = FastAPI(lifespan = lifespan)

#esto va a asegurar que el frontend envie exactamente lo esperado
class DiagnosticoRequest(BaseModel):
    sintomas: List[str]

@app.post("/diagnosticar")
async def diagnosticar(datos: DiagnosticoRequest):
    try:
        for s in datos.sintomas:
            prolog.assertz(f"tiene_sintoma({s})")

        resultado = list(prolog.query("diagnosticar(Enfermedad)"))

        if resultado:
            return{"diagnostico": resultado[0]['Enfermedad']}
        else:
            return {"diagnostico": "No se pudo determinar un diagnostico exacto."}
    
    finally:
        prolog.retractall("tiene_sintoma(_)")