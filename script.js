{
    var divisionesPorCurso = {
        "1": {
            "5": ["A-Are", "Ari-Fer", "Fo-Lob", "Lop-P", "R-Z"],
            "6": ["A-Are", "Ari-Dom", "Dov-Gom", "Gon-Mar", "Meb-Rib", "Riv-Z"]
        },
        "2": {
            "4": ["A-Cer", "Co-Gij", "Gil-Pereiro", "Pérez-Z"],
            "5": ["A-B", "C-Frag", "Fran-Ma", "Me-Reg", "Rod-Z"]
        },
        "3": {
            "4": ["A-Bel", "Ber-Fue", "Gar-Ote", "Ou-Z"]
        },
        "4": {
            "2": ["A-L", "M-Z"]
        }
    };

    var intervalo_0 = (9*60)/30;


    var horario_current = {
        nombre: "",
        apellidos: "",
        Cursos: [],
        Asignaturas: [],
        grupo_por_asignatura: [],
        clases_primer_cuatri: {
            "L": [],
            "M": [],
            "X": [],
            "J": [],
            "V": []
        },
        clases_segundo_cuatri: {
            "L": [],
            "M": [],
            "X": [],
            "J": [],
            "V": []
        }
    };
}

function hora_from_intervalo(intervalo) {
    
    let hora = Math.floor(intervalo/2) + 9;
    let minutos = (intervalo % 2) * 30;
    return hora + ":" + minutos;

}

function intervalo_from_horas(hora1, hora2) {
//Devuelve el rango de intervalos de 30 minutos entre dos horas, incluido el primero, sin incluir el ultimo
    let [h1, m1] = hora1.split(":");
    let [h2, m2] = hora2.split(":");
    let intervalo_inic_clase = (parseInt(h1) * 60 + parseInt(m1))/30;
    let intervalo_fin_clase = (parseInt(h2) * 60 + parseInt(m2))/30;
    intervalo_comienza = intervalo_inic_clase - intervalo_0;
    intervalo_termina = intervalo_fin_clase - intervalo_0;

    return [intervalo_comienza, intervalo_termina];
}


// function comprobar_colisiones() {
//     const days = ["L", "M", "X", "J", "V"];
//     var intervalosPorDia_primer_cuatri = {};

//     // Initialize intervalosPorDia for each day
//     days.forEach(day => {
//         intervalosPorDia[day] = [];
//     });

//     // Populate intervalosPorDia with intervals for each class
//     horario_current.clases_primer_cuatri.forEach((clases, day) => {
//         clases.forEach(clase => {
//             const [inicio, fin] = clase.intervalo;
//             for (let i = inicio; i < fin; i++) {
//                 if (!intervalosPorDia_primer_cuatri[day][i]) {
//                     intervalosPorDia_primer_cuatri[day][i] = [];
//                 }
//                 intervalosPorDia_primer_cuatri[day][i].push(clase);
//             }
//         });
//     });

//     // Check for collisions


//     console.log("No collisions detected");
//     return false;
// }

// Example usage




function obtener_grupo(curso, numGrupos) {
    let division = divisionesPorCurso[String(curso)][String(numGrupos)];
    for (let i = 0; i < division.length; i++) {
        const element = division[i];
        let [inicio, fin] = division[i].split("-"); // String dividido de grupos para orden alfabético

        if (horario_current.apellidos.localeCompare(inicio) >= 0 && horario_current.apellidos.localeCompare(fin) <= 0) {
            return i;  // Devolvemos el índice del grupo 
        }

    }

    return -1;  // No se encontró grupo supongo? cagaste


}

document.addEventListener("DOMContentLoaded", () => {
    fetch('asignaturas.json')
        .then(response => response.json())
        .then(data => {
            const contenedorCursos = document.getElementById('contenedorCursos');
            const cursos = {};

            // Organize subjects by course and cuatrimestre
            for (const key in data) {
                const asignatura = data[key];
                const curso = asignatura.curso;
                const cuatrimestre = asignatura.cuatrimestre;

                if (!cursos[curso]) {
                    cursos[curso] = {};
                }
                if (!cursos[curso][cuatrimestre]) {
                    cursos[curso][cuatrimestre] = [];
                }
                cursos[curso][cuatrimestre].push({ id: key, nombre: asignatura.asignatura });
            }

            // Clear existing content
            contenedorCursos.innerHTML = '';

            // Generate divs for each course and cuatrimestre
            for (const curso in cursos) {
                const divCurso = document.createElement('div');
                divCurso.className = 'curso form-check border';
                divCurso.id = `curso${curso}`;

                const divTituloCurso = document.createElement('div');
                divTituloCurso.className = 'titulo';

                const inputCursoCheckbox = document.createElement('input');
                inputCursoCheckbox.className = 'form-check-input';
                inputCursoCheckbox.type = 'checkbox';
                inputCursoCheckbox.id = `cursoCheckbox${curso}`;
                inputCursoCheckbox.addEventListener('change', (event) => {
                    const checkboxes = divCurso.querySelectorAll('.form-check-input.asignatura-checkbox');
                    checkboxes.forEach(checkbox => checkbox.checked = event.target.checked);
                });

                const labelCursoCheckbox = document.createElement('label');
                labelCursoCheckbox.className = 'form-check-label';
                labelCursoCheckbox.htmlFor = `cursoCheckbox${curso}`;
                labelCursoCheckbox.textContent = `Curso ${curso}`;

                divTituloCurso.appendChild(inputCursoCheckbox);
                divTituloCurso.appendChild(labelCursoCheckbox);
                divCurso.appendChild(divTituloCurso);

                for (const cuatrimestre in cursos[curso]) {
                    const divCuatrimestre = document.createElement('div');
                    divCuatrimestre.className = 'cuatrimestre border';
                    divCuatrimestre.id = `cuatrimestre${curso}_${cuatrimestre}`;

                    const divTituloCuatrimestre = document.createElement('div');
                    divTituloCuatrimestre.className = 'titulo';

                    const inputCuatrimestreCheckbox = document.createElement('input');
                    inputCuatrimestreCheckbox.className = 'form-check-input';
                    inputCuatrimestreCheckbox.type = 'checkbox';
                    inputCuatrimestreCheckbox.id = `cuatrimestreCheckbox${curso}_${cuatrimestre}`;
                    inputCuatrimestreCheckbox.addEventListener('change', (event) => {
                        const checkboxes = divCuatrimestre.querySelectorAll('.form-check-input.asignatura-checkbox');
                        checkboxes.forEach(checkbox => checkbox.checked = event.target.checked);
                    });

                    const labelCuatrimestreCheckbox = document.createElement('label');
                    labelCuatrimestreCheckbox.className = 'form-check-label';
                    labelCuatrimestreCheckbox.htmlFor = `cuatrimestreCheckbox${curso}_${cuatrimestre}`;
                    labelCuatrimestreCheckbox.textContent = `Cuatrimestre ${cuatrimestre}`;

                    divTituloCuatrimestre.appendChild(inputCuatrimestreCheckbox);
                    divTituloCuatrimestre.appendChild(labelCuatrimestreCheckbox);
                    divCuatrimestre.appendChild(divTituloCuatrimestre);

                    cursos[curso][cuatrimestre].forEach(asignatura => {
                        const divAsignatura = document.createElement('div');
                        divAsignatura.className = 'form-check';

                        const inputAsignaturaCheckbox = document.createElement('input');
                        inputAsignaturaCheckbox.className = 'form-check-input asignatura-checkbox';
                        inputAsignaturaCheckbox.type = 'checkbox';
                        inputAsignaturaCheckbox.id = asignatura.id;

                        const labelAsignaturaCheckbox = document.createElement('label');
                        labelAsignaturaCheckbox.className = 'form-check-label';
                        labelAsignaturaCheckbox.htmlFor = asignatura.id;
                        labelAsignaturaCheckbox.textContent = asignatura.nombre;

                        divAsignatura.appendChild(inputAsignaturaCheckbox);
                        divAsignatura.appendChild(labelAsignaturaCheckbox);
                        divCuatrimestre.appendChild(divAsignatura);
                    });

                    divCurso.appendChild(divCuatrimestre);
                }

                contenedorCursos.appendChild(divCurso);
            }
        })
        .catch(error => console.error('Error fetching asignaturas.json:', error));
});

document.addEventListener("DOMContentLoaded", () => {
    const aplicarCambiosButton = document.getElementById('aplicar-datos');
    const cancelarCambiosButton = document.getElementById('cancelar-datos');

    aplicarCambiosButton.addEventListener('click', () => {

        update_horario_current();



    });

    // cancelarCambiosButton.addEventListener('click', () => {
    //     console.log("no");
    // });
});

function update_horario_html() {
    const days = ["L", "M", "X", "J", "V"];
    const intervalo_ultimo = (21 * 60) / 30;
    const horarioContainer = document.getElementById('horario');

    // Clear existing content
    horarioContainer.innerHTML = '';

    // Create grids for both semesters
    createGrid(horarioContainer, 'clases_primer_cuatri', 'Primer Cuatrimestre');
    createGrid(horarioContainer, 'clases_segundo_cuatri', 'Segundo Cuatrimestre');
}

function createGrid(container, cuatriKey, title) {
    const days = ["L", "M", "X", "J", "V"];
    const intervalo_ultimo = (21 * 60) / 30;

    // Create title
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    container.appendChild(titleElement);

    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'container text-center';

    // Create header row
    const headerRow = document.createElement('div');
    headerRow.className = 'row';
    headerRow.innerHTML = `
        <div class="col">Hora</div>
        <div class="col">Lunes</div>
        <div class="col">Martes</div>
        <div class="col">Miércoles</div>
        <div class="col">Jueves</div>
        <div class="col">Viernes</div>
    `;
    gridContainer.appendChild(headerRow);

    // Create rows for each 30-minute interval
    for (let interval = 0; interval < intervalo_ultimo; interval++) {
        const row = document.createElement('div');
        row.className = 'row';

        // Create time column
        const timeCol = document.createElement('div');
        timeCol.className = 'col';
        timeCol.textContent = hora_from_intervalo(interval);
        row.appendChild(timeCol);

        // Create columns for each day
        days.forEach(day => {
            const col = document.createElement('div');
            col.className = 'col';
            col.id = `${cuatriKey}_${day}_${interval}`;
            row.appendChild(col);
        });

        gridContainer.appendChild(row);
    }

    container.appendChild(gridContainer);

    // Populate the grid with class information
    populateGrid(cuatriKey);
}

function populateGrid(cuatriKey) {
    const days = ["L", "M", "X", "J", "V"];
    const horario = horario_current[cuatriKey];

    days.forEach(day => {
        const clases = horario[day];
        clases.forEach(clase => {
            const [inicio, fin] = clase.intervalos;
            const colId = `${cuatriKey}_${day}_${inicio}`;
            const col = document.getElementById(colId);

            if (col) {
                col.rowSpan = fin - inicio;
                col.innerHTML = `
                    <div class="tipo">${clase.tipo}</div>
                    <div class="nombre">${clase.nombre}</div>
                    <div class="aula">${clase.aula}</div>
                `;

                // Hide the cells that are merged
                for (let i = inicio + 1; i < fin; i++) {
                    const hideColId = `${cuatriKey}_${day}_${i}`;
                    const hideCol = document.getElementById(hideColId);
                    if (hideCol) {
                        hideCol.style.display = 'none';
                    }
                }
            }
        });
    });
}

// Example usage
document.addEventListener("DOMContentLoaded", () => {
    update_horario_html();
});


async function update_horario_current() {
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    horario_current.nombre = nombre;
    horario_current.apellidos = apellidos;

    const asignaturasResponse = await fetch('asignaturas.json');
    const asignaturas = await asignaturasResponse.json();

    const dataResponse = await fetch('data.json');
    const horarios = await dataResponse.json();

    const asignaturas_escogidas = document.querySelectorAll('.form-check-input.asignatura-checkbox:checked');
    asignaturas_escogidas.forEach(escogida => {
        const asignatura_id = escogida.id; // e.g., "ASIGNATURA_1"
        // const asignatura_id_num = asignatura_id.split('_')[1]; // e.g., "1"

        const info_asignatura = asignaturas[asignatura_id];

        if (info_asignatura) {
            horario_current.Asignaturas.push(asignatura_id);
            horario_current.grupo_por_asignatura.push(obtener_grupo(info_asignatura.curso, info_asignatura.num_grupos));
        }
    });

    for (let index = 0; index < horario_current.Asignaturas.length; index++) {
        let asignatura_id = horario_current.Asignaturas[index];
        const info_asignatura = asignaturas[asignatura_id];
        let interactiva = {
            "tipo": "Interactiva",
            "asignatura": asignatura_id,
            "nombre": info_asignatura.asignatura,
            "dia": horarios[asignatura_id].Interactivas.Dia[horario_current.grupo_por_asignatura[index]],
            "intervalos": intervalo_from_horas(horarios[asignatura_id].Interactivas.Inicio[horario_current.grupo_por_asignatura[index]], 
                horarios[asignatura_id].Interactivas.Fin[horario_current.grupo_por_asignatura[index]]),
            "aula": horarios[asignatura_id].Interactivas.Aula[horario_current.grupo_por_asignatura[index]],
        };
        console.log(typeof horarios[asignatura_id].Interactivas.Fin[horario_current.grupo_por_asignatura[index]]);

        if(info_asignatura.cuatrimestre == 1){
            horario_current.clases_primer_cuatri[interactiva.dia].push(interactiva);

        }else if(info_asignatura.cuatrimestre == 2){
            horario_current.clases_segundo_cuatri[interactiva.dia].push(interactiva);
        }

        for (let j = 0; j < horarios[asignatura_id].Expositivas.length; j++) {

            let expositiva = {
                "tipo": "Expositiva",
                "asignatura": asignatura_id,
                "nombre": info_asignatura.asignatura,
                "dia":    horarios[asignatura_id].Expositivas.Dia[j],
                "intervalos": intervalo_from_horas(horarios[asignatura_id].Expositivas.Inicio[j], 
                    horarios[asignatura_id].Expositivas.Fin[j]),
                "aula":   horarios[asignatura_id].Expositivas.Aula[j],
            };
            horario_current.clases[expositiva.dia].push(expositiva);
            
            if(info_asignatura.cuatrimestre == 1){
                horario_current.clases_primer_cuatri[expositiva.dia].push(expositiva);

            }else if(info_asignatura.cuatrimestre == 2){
                horario_current.clases_segundo_cuatri[expositiva.dia].push(expositiva);
            }

        }
        for (let j = 0; j < horarios[asignatura_id].Seminarios.length; j++) {

            let seminario = {
                "tipo": "Seminario",
                "asignatura": asignatura_id,
                "nombre": info_asignatura.asignatura,
                "dia":    horarios[asignatura_id].Seminarios.Dia[j],
                "intervalos": intervalo_from_horas(horarios[asignatura_id].Seminarios.Inicio[j], 
                    horarios[asignatura_id].Seminarios.Fin[j]),
                "aula":   horarios[asignatura_id].Seminarios.Aula[j],
            };
            if(info_asignatura.cuatrimestre == 1){
                horario_current.clases_primer_cuatri[seminario.dia].push(seminario);

            }else if(info_asignatura.cuatrimestre == 2){
                horario_current.clases_segundo_cuatri[seminario.dia].push(seminario);
            }                
        }


    }
    console.log(horario_current.clases_primer_cuatri);
    
    console.log(horario_current.clases_segundo_cuatri);
}


// function update_horario_html() {
//     let intervalo_ultimo = (21*60)/30;
    
//     for (let interval = 0; interval < intervalo_ultimo; interval++) {
        

//         const element = array[interval];
        
//     }


//     for(let i = 0; i < horario_current.clases_primer_cuatri.length; i++){
//         let dia = horario_current.clases_primer_cuatri[i];
//         let div_dia = document.getElementById(dia);
//         let clases = horario_current.clases_primer_cuatri[dia];
//         for(let j = 0; j < clases.length; j++){
//             let clase = clases[j];
//             let div_clase = document.createElement('div');
//             div_clase.className = 'clase';
//             div_clase.innerHTML = `
//                 <div class="tipo">${clase.tipo}</div>
//                 <div class="nombre">${clase.nombre}</div>
//                 <div class="intervalos">${hora_from_intervalo(clase.intervalos[0])} - ${hora_from_intervalo(clase.intervalos[1])}</div>
//                 <div class="aula">${clase.aula}</div>
//             `;
//             div_dia.appendChild(div_clase);
//         }
//     }


// }


