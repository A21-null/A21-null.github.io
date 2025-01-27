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


var horario_current = {
    nombre: "",
    apellidos: "",
    Cursos: [],
    Asignaturas: [],
    grupo_por_asignatura: [],
    interactivas: [],
    expositivas: [],
    seminarios: []
};
}

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

    // aplicarCambiosButton.addEventListener('click', () => {
    //     console.log("wow");
    //     const getFormData = () => {
    //         const nombre = document.getElementById('nombre').value;
    //         const apellidos = document.getElementById('apellidos').value;
    //         console.log(`Nombre: ${nombre}, Apellidos: ${apellidos}`);
    //     };




    // });

    // cancelarCambiosButton.addEventListener('click', () => {
    //     console.log("no");
    // });
});


document.addEventListener("DOMContentLoaded", () => {
    const getFormData = () => {
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        horario_current.nombre = nombre;
        horario_current.apellidos = apellidos;
        // console.log(`Nombre: ${nombre}, Apellidos: ${apellidos}`);
    };

    const getCourseData = async () => {
        const asignaturasResponse = await fetch('asignaturas.json');
        const asignaturas = await asignaturasResponse.json();

        const dataResponse = await fetch('data.json');
        const horarios = await dataResponse.json();

        const asignaturas_escogidas = document.querySelectorAll('.form-check-input.asignatura-checkbox');
        asignaturas_escogidas.forEach(escogida => {
            const asignatura_id = escogida.id; // e.g., "ASIGNATURA_1"
            // const asignatura_id_num = asignatura_id.split('_')[1]; // e.g., "1"
            horario_current.Asignaturas.push(asignatura_id);
            
            const info_asignatura = asignaturas[asignatura_id];

            if(info_asignatura){

                // console.log(info_asignatura.num_grupos);
                // console.log(info_asignatura.curso);
                console.log(obtener_grupo(info_asignatura.curso, info_asignatura.num_grupos));
                var interactiva
            }
            // console.log(data[asignatura_id]);     
            

            // for (const key in horario_current.Asignaturas) {
            //     console.log(horario_current.Asignaturas[key]);
                
            // }

            // if (courseInfo && courseData) {
            //     const courseName = courseData.Nombre;
            //     const numGroups = courseInfo.num_grupos;

            //     console.log(`Course: ${courseName}`);
            //     console.log(`Number of Groups: ${numGroups}`);

            //     const groupNumber = parseInt(courseCheckbox.dataset.group); // Assuming group number is stored in data-group attribute

            //     if (groupNumber >= 0 && groupNumber < numGroups) {
            //         const interactivas = courseData.Interactivas;
            //         const expositivas = courseData.Expositivas;
            //         const seminarios = courseData.Seminarios;

            //         console.log(`Interactivas: ${interactivas.Dia[groupNumber]} from ${interactivas.Inicio[groupNumber]} to ${interactivas.Fin[groupNumber]}`);
            //         console.log(`Expositivas: ${expositivas.Dia[groupNumber]} from ${expositivas.Inicio[groupNumber]} to ${expositivas.Fin[groupNumber]}`);
            //         console.log(`Seminarios: ${seminarios.Dia[groupNumber]} from ${seminarios.Inicio[groupNumber]} to ${seminarios.Fin[groupNumber]}`);
            //     } else {
            //         console.log(`Invalid group number for course ${courseName}`);
            //     }
            // } else {
            //     console.log(`Course data not found for ID: ${courseId}`);
            // }
        });
    };

    document.querySelector('button.btn-success').addEventListener('click', () => {
        getFormData();
        getCourseData();
    });
});