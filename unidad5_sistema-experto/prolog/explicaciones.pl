:- dynamic conocido/1.

solve_how(sintoma(S), hecho(sintoma(S))) :- 
    tiene_sintoma(S).

solve_how(diagnostico(E), paso(diagnostico(E), regla_usada, ID, SubArboles)) :-
    regla(ID, diagnostico(E), Condiciones),
    solve_lista_how(Condiciones, SubArboles).

solve_lista_how([], []).

solve_lista_how([C|Resto], [A|Arboles]) :-
    solve_how(C, A),
    solve_lista_how(Resto, Arboles).

solve_why(Sintoma, Enfermedad, IDRegla) :-
    regla(IDRegla, diagnostico(Enfermedad), Condiciones),
    member(sintoma(Sintoma), Condiciones).