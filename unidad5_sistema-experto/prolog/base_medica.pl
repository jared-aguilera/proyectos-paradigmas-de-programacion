
% Esto es para que fasapy envie los datos a prolog
:- dynamic tiene_sintoma/1.

% Se declaran primero los sintomas
sintoma(fiebre).
sintoma(tos).
sintoma(cansancio).
sintoma(dolor_cuerpo).
sintoma(congestion).
sintoma(estornudos).
sintoma(picazon_ojos).
sintoma(lagrimeo).
sintoma(nauseas).
sintoma(vomito).
sintoma(diarrea).
sintoma(dolor_cabeza).
sintoma(escalofrios).
sintoma(perdida_olfato).
sintoma(palidez).


% Despues las enfermedades
enfermedad(gripe).
enfermedad(resfriado).
enfermedad(alergia).
enfermedad(gastroenteritis).
enfermedad(migrana).

% La estructura de jared y como se relaciona la enfermedad con las sintomas
regla(r1, diagnostico(gripe), [sintoma(fiebre),sintoma(tos),sintoma(cansancio),sintoma(dolor_cuerpo)]).
regla(r2, diagnostico(resfriado), [sintoma(congestion),sintoma(estornudos),sintoma(tos)]).
regla(r3, diagnostico(alergia),[sintoma(estornudos),sintoma(picazon_ojos),sintoma(lagrimeo)]).
regla(r4,diagnostico(migrana),[sintoma(dolor_cabeza),sintoma(nauseas),sintoma(escalofrios)]).
regla(r5, diagnostico(gastroenteritis), [sintoma(nauseas), sintoma(vomito), sintoma(diarrea)]).

cumple_sintoma([]).
cumple_sintoma([sintoma(S)|Resto]):-
tiene_sintoma(S),
cumple_sintoma(Resto).

diagnosticar(Enfermedad):-
regla(_,diagnostico(Enfermedad),Sintomas),
cumple_sintoma(Sintomas),!.
diagnosticar('No se pudo determinar un diagnostico exacto.').







