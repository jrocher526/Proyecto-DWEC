// ==========================================
// ESTADO GLOBAL DE LA APLICACIÓN (EN MEMORIA)
// ==========================================
let equipos = [];
// Estructura de cada equipo: { id: number, nombre: string }

let partidos = [];
// Estructura de cada partido:
// { id: number, equipo1Id: number, equipo2Id: number, goles1: number|null, goles2: number|null, jugado: boolean }

// ==========================================
// ALUMNO 1 - Jhonal Roca: REGISTRO Y GENERACIÓN DE CALENDARIO
// ==========================================

/**
 * Añade un equipo al array global 'equipos' previa validación.
 * @param {string} nombre
 * @returns {boolean} true si se añadió con éxito, false si hubo error.
 */
function agregarEquipo(nombre) {
  // Eliminamos los espacios del principio y del final.
  let nombreLimpio = nombre.trim();

  // Si no queda ningún carácter, rechazamos el nombre.
  if (nombreLimpio === "") {
    return false;
  }

  // Recorremos los equipos para comprobar si el nombre ya existe.
  for (let i = 0; i < equipos.length; i++) {
    // Comparamos en mayúsculas para considerar iguales
    // nombres como "Tigres" y "tigres".
    if (equipos[i].nombre.toUpperCase() === nombreLimpio.toUpperCase()) {
      return false;
    }
  }

  // Creamos un objeto con la estructura indicada en la plantilla.
  // Date.now() devuelve los milisegundos desde el 1 de enero de 1970.
  let nuevoEquipo = {
    id: Date.now(),
    nombre: nombreLimpio
  };

  // Añadimos el nuevo equipo al final del array global.
  equipos.push(nuevoEquipo);

  // Indicamos al handler que el equipo se añadió correctamente.
  return true;
}

/**
 * Genera los enfrentamientos (todos contra todos) y llena el array global 'partidos'.
 */
function generarEnfrentamientos() {
  // Borramos los partidos anteriores antes de generar el calendario.
  // Si se vuelve a ejecutar, también se eliminan sus resultados.
  partidos = [];

  // Con menos de dos equipos no podemos crear enfrentamientos.
  // return termina la función sin continuar con los bucles.
  if (equipos.length < 2) {
    return;
  }

  // Asignamos un identificador diferente a cada partido.
  let idPartido = 0;

  // El primer bucle selecciona el primer equipo.
  for (let i = 0; i < equipos.length; i++) {
    // El segundo selecciona los equipos situados después del primero.
    // Empezar en i + 1 evita enfrentar un equipo consigo mismo
    // y repetir cruces: si existe A-B, no creamos también B-A.
    for (let j = i + 1; j < equipos.length; j++) {
      // Creamos un partido todavía pendiente de jugar.
      let nuevoPartido = {
        id: idPartido,
        equipo1Id: equipos[i].id,
        equipo2Id: equipos[j].id,
        goles1: null,
        goles2: null,
        jugado: false
      };

      // Guardamos el partido en el array global.
      partidos.push(nuevoPartido);

      // Incrementamos el identificador para el siguiente partido.
      idPartido++;
    }
  }
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

  // Buscamos el partido por su ID.
  for (let i = 0; i < partidos.length; i++) {

    if (partidos[i].id == partidoId) {

      // Comprobamos que los goles sean números enteros y positivos.
      if (!Number.isInteger(goles1) || !Number.isInteger(goles2) || goles1 < 0 || goles2 < 0) {
        return;
      }

      // Guardamos los goles.
      partidos[i].goles1 = goles1;
      partidos[i].goles2 = goles2;

      // Indicamos que el partido ya se ha jugado.
      partidos[i].jugado = true;

      return;
    }
  }
}
/**
 * Recorre 'equipos' y 'partidos' para calcular la tabla de posiciones.
 * @returns {Array} Array de objetos ordenado por Puntos (descendente) y Diferencia de Goles.
 */
function calcularTablaPosiciones() {

  // Creamos las estadísticas de cada equipo.
  let tabla = [];

  for (let i = 0; i < equipos.length; i++) {

    let equipo = {
      id: equipos[i].id,
      nombre: equipos[i].nombre,
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      gf: 0,
      gc: 0,
      puntos: 0
    };

    tabla.push(equipo);
  }

  // Recorremos todos los partidos.
  for (let i = 0; i < partidos.length; i++) {

    if (partidos[i].jugado == true) {

      // Buscamos los dos equipos del partido.
      let equipo1;
      let equipo2;

      for (let j = 0; j < tabla.length; j++) {

        if (tabla[j].id == partidos[i].equipo1Id) {
          equipo1 = tabla[j];
        }

        if (tabla[j].id == partidos[i].equipo2Id) {
          equipo2 = tabla[j];
        }
      }

      // Sumamos partidos jugados.
      equipo1.pj++;
      equipo2.pj++;

      // Sumamos goles a favor y en contra.
      equipo1.gf += partidos[i].goles1;
      equipo1.gc += partidos[i].goles2;

      equipo2.gf += partidos[i].goles2;
      equipo2.gc += partidos[i].goles1;

      // Comprobamos quién ha ganado o si han empatado.
      if (partidos[i].goles1 > partidos[i].goles2) {

        equipo1.pg++;
        equipo2.pp++;

        equipo1.puntos += 3;

      } else if (partidos[i].goles1 < partidos[i].goles2) {

        equipo2.pg++;
        equipo1.pp++;

        equipo2.puntos += 3;

      } else {

        equipo1.pe++;
        equipo2.pe++;

        equipo1.puntos++;
        equipo2.puntos++;
      }
    }
  }

  // Ordenamos por puntos y después por diferencia de goles.
  tabla.sort(function(a, b) {

    if (b.puntos != a.puntos) {
      return b.puntos - a.puntos;
    }

    return (b.gf - b.gc) - (a.gf - a.gc);
  });

  return tabla;
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
