// ==========================================
// ESTADO GLOBAL DE LA APLICACIÓN (EN MEMORIA)
// ==========================================
let equipos = [];
// Estructura de cada equipo: { id: number, nombre: string }

let partidos = [];
// Estructura de cada partido:
// { id: number, equipo1Id: number, equipo2Id: number, goles1: number|null, goles2: number|null, jugado: boolean }

// ==========================================
// ALUMNO 1: REGISTRO Y GENERACIÓN DE CALENDARIO
// ==========================================

/**
 * Añade un equipo al array global 'equipos' previa validación.
 * @param {string} nombre
 * @returns {boolean} true si se añadió con éxito, false si hubo error.
 */
function agregarEquipo(nombre) {
  // TODO (Alumno 1):
  // 1. Validar que el nombre no esté vacío o compuesto solo por espacios.
  // 2. Validar que el equipo no exista ya en el array 'equipos'.
  // 3. Crear el objeto { id: Date.now(), nombre: nombre.trim() } y hacer push a 'equipos'.
  // 4. Retornar true si todo salió bien.
  return false;
}

/**
 * Genera los enfrentamientos (todos contra todos) y llena el array global 'partidos'.
 */
function generarEnfrentamientos() {
  // TODO (Alumno 1):
  // 1. Limpiar el array 'partidos' previo.
  // 2. Comprobar que hay al menos 2 equipos.
  // 3. Crear un bucle anidado para cruzar cada equipo con los demás (sin repetirse contra sí mismo).
  // 4. Guardar cada partido con la estructura:
  //    { id: i, equipo1Id: e1.id, equipo2Id: e2.id, goles1: null, goles2: null, jugado: false }
}

// ==========================================
// ALUMNO 2: LÓGICA DE NEGOCIO Y CLASIFICACIÓN
// ==========================================

/**
 * Actualiza el marcador de un partido específico en el array 'partidos'.
 * @param {number} partidoId
 * @param {number} goles1
 * @param {number} goles2
 */
function registrarResultado(partidoId, goles1, goles2) {
  // TODO (Alumno 2):
  // 1. Buscar el partido por partidoId en el array 'partidos'.
  // 2. Validar que los goles sean números enteros >= 0.
  // 3. Asignar goles1, goles2 y cambiar 'jugado' a true.
}

/**
 * Recorre 'equipos' y 'partidos' para calcular la tabla de posiciones.
 * @returns {Array} Array de objetos ordenado por Puntos (descendente) y Diferencia de Goles.
 */
function calcularTablaPosiciones() {
  // TODO (Alumno 2):
  // 1. Mapear el array 'equipos' para inicializar estadísticas por equipo:
  //    { id, nombre, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, puntos: 0 }
  // 2. Recorrer el array 'partidos' que estén 'jugados'.
  // 3. Sumar PJ, GF, GC, PG/PE/PP y Puntos (3 ptos victoria, 1 pto empate).
  // 4. Ordenar el array resultante por puntos (y secundariamente por GF - GC).
  // 5. Retornar la lista calculada.
  return [];
}

// ==========================================
// ALUMNO 3: RENDERIZADO E INTERFAZ (DOM)
// ==========================================

/**
 * Renderiza el listado simple de equipos registrados.
 */
function pintarListaEquipos() {
  // TODO (Alumno 3):
  // 1. Obtener el elemento HTML #listaEquipos.
  // 2. Limpiar su contenido.
  // 3. Recorrer 'equipos' y renderizar un <li> por cada equipo.
}

/**
 * Renderiza los partidos programados con sus inputs de goles y botón de guardar.
 */
function pintarPartidos() {
  // TODO (Alumno 3):
  // 1. Obtener el contenedor #contenedorPartidos.
  // 2. Limpiar su contenido.
  // 3. Recorrer 'partidos' generando controles para ingresar resultado y guardar.
}

/**
 * Renderiza las filas <tr> de la tabla de clasificación.
 */
// ==========================================
// ALUMNO 3: RENDERIZADO E INTERFAZ (DOM)
// ==========================================

/**
 * Renderiza las filas <tr> de la tabla de clasificación.
 */
function pintarTablaClasificacion() {
  // 1. Llamar a calcularTablaPosiciones() (Función del Alumno 2).
  const posiciones = calcularTablaPosiciones();

  // 2. Obtener #tablaClasificacion y construir los <tr> y <td> con los datos.
  const contenedor = document.getElementById("tablaClasificacion");
  if (!contenedor) return;

  // Limpiar contenido previo
  contenedor.innerHTML = "";

  // Recorrer las posiciones ordenadas y generar las filas
  posiciones.forEach((equipo, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${equipo.nombre}</td>
      <td>${equipo.pj}</td>
      <td>${equipo.pg}</td>
      <td>${equipo.pe}</td>
      <td>${equipo.pp}</td>
      <td>${equipo.gf}</td>
      <td>${equipo.gc}</td>
      <td><b>${equipo.puntos}</b></td>
    `;

    contenedor.appendChild(fila);
  });
}

// ==========================================
// ALUMNO 4: ESTADÍSTICAS Y CONTROL GENERAL
// ==========================================

/**
 * Calcula el total de goles anotados y busca el equipo con más goles a favor.
 * @returns {Object} { totalGoles: number, maxGoleador: string }
 */
function obtenerEstadisticas() {
  // 1. Recorrer 'partidos' para sumar los goles totales del torneo.
  let totalGoles = 0;
  partidos.forEach(partido => {
    if (partido.jugado && partido.goles1 !== null && partido.goles2 !== null) {
      totalGoles += partido.goles1 + partido.goles2;
    }
  });

  // 2. Usar la tabla de posiciones de Alumno 2 para buscar el equipo con mayor GF (Goles a Favor).
  let maxGoleador = "-";
  const tabla = calcularTablaPosiciones();

  if (tabla.length > 0) {
    let maxGf = -1;
    tabla.forEach(equipo => {
      if (equipo.gf > maxGf) {
        maxGf = equipo.gf;
        maxGoleador = equipo.nombre;
      }
    });
    // Si nadie ha marcado goles todavía, se mantiene "-"
    if (maxGf === 0) {
      maxGoleador = "-";
    }
  }

  // 3. Retornar el objeto con los datos.
  return { totalGoles, maxGoleador };
}

/**
 * Limpia las variables globales y refresca toda la interfaz a su estado inicial.
 */
function reiniciarTorneo() {
  // TODO (Alumno 4):
  // 1. Vaciar arrays: equipos = []; partidos = [];
  // 2. Volver a pintar todas las secciones (usando funciones de Alumno 3).
  // 3. Actualizar panel de estadísticas a 0.
}

// ==========================================
// MANEJADORES DE EVENTOS (HANDLERS HTML)
// ==========================================
function handlerAgregarEquipo() {
  const input = document.getElementById("inputEquipo");
  if (agregarEquipo(input.value)) {
    input.value = "";
    pintarListaEquipos();
  } else {
    alert("Nombre de equipo inválido o duplicado.");
  }
}

function handlerGenerarTorneo() {
  generarEnfrentamientos();
  pintarPartidos();
  pintarTablaClasificacion();
}

function handlerGuardarResultado(partidoId, inputId1, inputId2) {
  const g1 = parseInt(document.getElementById(inputId1).value);
  const g2 = parseInt(document.getElementById(inputId2).value);

  registrarResultado(partidoId, g1, g2);
  pintarTablaClasificacion();

  // Actualizar estadísticas (Alumno 4)
  const stats = obtenerEstadisticas();
  document.getElementById("txtTotalGoles").innerText = stats.totalGoles;
  document.getElementById("txtMaxGoleador").innerText = stats.maxGoleador;
}

function handlerReiniciarTorneo() {
  if (confirm("¿Seguro que deseas reiniciar todo el torneo?")) {
    reiniciarTorneo();
  }
}
