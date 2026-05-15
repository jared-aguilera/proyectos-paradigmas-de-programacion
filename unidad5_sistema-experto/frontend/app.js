document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sintomas-form');
    const btnDiagnosticar = document.getElementById('btn-diagnosticar');
    const panelResultados = document.getElementById('panel-resultados');
    const txtEnfermedad = document.getElementById('txt-enfermedad');
    const txtExplicacion = document.getElementById('txt-explicacion');

    const checkboxesOptions = document.querySelectorAll('input[type="checkbox"]');
    const MAX_SINTOMAS = 5;

    checkboxesOptions.forEach(box => {
        box.addEventListener('change', () => {
            const seleccionados = document.querySelectorAll('input[type="checkbox"]:checked').length;
            
            checkboxesOptions.forEach(chk => {
                if (seleccionados >= MAX_SINTOMAS && !chk.checked) {
                    chk.disabled = true;
                } else {
                    chk.disabled = false;
                }
            });
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const sintomasSeleccionados = Array.from(checkboxes).map(cb => cb.value);

        if (sintomasSeleccionados.length === 0) {
            alert("Por favor, seleccione al menos un sintoma");
            return;
        }

        btnDiagnosticar.disabled = true;
        btnDiagnosticar.textContent = "Consultando a Prolog...";
        panelResultados.style.display = "none";

        try {
            const respuesta = await fetch("/diagnosticar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ sintomas: sintomasSeleccionados })
            });

            if (!respuesta.ok) {
                throw new Error("Error en la respuesta del servidor");
            }

            const datos = await respuesta.json();

            txtEnfermedad.textContent = datos.diagnostico;
            
            let rastroLimpio = datos.explicacion_how;

            if (rastroLimpio) {
                rastroLimpio = rastroLimpio
                    .replace(/paso/g, '●')                // Cambia 'paso' por un punto
                    .replace(/diagnostico/g, 'Evaluando') // Cambia el termino tecnico
                    .replace(/regla_usada/g, 'Usando la regla')
                    .replace(/sintoma/g, 'Sintoma detectado')
                    .replace(/[\[\]\(\)]/g, ' ')         // quita parentesis y corchetes y pone espacios en blanco
                    .replace(/Functor \d+,\d+,/g, '')     // borra la palabra Functor y sus numeros ("Functor 11231 por ejemplo")
                    .replace(/,/g, '<br> → ');            // Cambia comas por flechas y saltos de línea
            } else {
                rastroLimpio = "No hay justificacion disponible";
            }

            txtExplicacion.innerHTML = rastroLimpio;
            panelResultados.style.display = "block";
            panelResultados.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error(error);
            alert("Error de conexion");
        } finally {
            btnDiagnosticar.disabled = false;
            btnDiagnosticar.textContent = "Obtener Diagnostico";
        }
    });
});