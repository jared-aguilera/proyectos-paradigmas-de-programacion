:- dynamic conocido/1. % ESto permite agregar hechos durante la consulta

% PARTE 1 WHY

% El predicado principal para iniciar una consulta
consultar(Enfermedad) :-
    retractall(conocido(_)), 
    solve_why(diagnostico(Enfermedad), []),
    format('~nResultado: El paciente tiene ~w.~n', [Enfermedad]),

    % Se pregunta how
    writeln('> Deseas ver la explicacion del resultado? (si/no)'),
    read(Resp),
    (Resp == si -> solve_how(diagnostico(Enfermedad), Arbol), imprimir_arbol(Arbol, 0) ; true).


solve_why(Meta, _) :- conocido(Meta).
solve_why(Meta, Pila) :-
    \+ conocido(Meta),
    regla(ID, Meta, Condiciones), % Se busca una regla
    NuevaPila = [regla(ID, Meta)|Pila],
    verificar_condiciones(Condiciones, NuevaPila).

% Se verifica cada sintoma
verificar_condiciones([], _).
verificar_condiciones([C|Resto], Pila) :-
    obtener_dato(C, Pila),
    verificar_condiciones(Resto, Pila).

% SE PRegunta al usuario
obtener_dato(Sintoma, Pila) :-
    conocido(Sintoma) -> true ;
    (format('~n> El paciente tiene ~w? (si/no/why): ', [Sintoma]),
     read(Resp),
     procesar(Resp, Sintoma, Pila)).

procesar(si, S, _) :- assert(conocido(S)).
procesar(no, _, _) :- fail.
procesar(why, S, Pila) :- 
    format('~n--- EXPLICACION (WHY) ---~n'),
    explicar_why(Pila), % Responde al "¿Por qué se solicita cierta información?"
    format('-------------------------~n'),
    obtener_dato(S, Pila).

explicar_why([]) :- writeln('Es un objetivo inicial.').
explicar_why([regla(ID, Meta)|T]) :-
    format('Estoy intentando demostrar la regla ~w para concluir ~w.~n', [ID, Meta]),
    explicar_why(T).




% PARTE 2: EXPLICACIÓN DE RESULTADOS HOW


% Construye el arbol de prueba para explicar "como se obtuvo el resultado"
solve_how(Meta, hecho(Meta)) :- conocido(Meta), \+ regla(_, Meta, _).
solve_how(Meta, paso(Meta, porque, ID, SubArboles)) :-
    regla(ID, Meta, Condiciones),
    solve_lista_how(Condiciones, SubArboles).

solve_lista_how([], []).
solve_lista_how([C|Resto], [A|Arboles]) :-
    solve_how(C, A),
    solve_lista_how(Resto, Arboles).

% Se formatea
imprimir_arbol(hecho(M), N) :- tab(N), format('- ~w (Confirmado por usuario)~n', [M]).
imprimir_arbol(paso(M, _, ID, Subs), N) :-
    tab(N), format('+ ~w (Usando regla ~w):~n', [M, ID]),
    N1 is N + 4,
    imprimir_lista_arbol(Subs, N1).

imprimir_lista_arbol([], _).
imprimir_lista_arbol([H|T], N) :-
    imprimir_arbol(H, N),
    imprimir_lista_arbol(T, N).