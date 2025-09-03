import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBWbXtxxdSGXpt3oJ-3uZLxdrNFkrTO7lg",
    authDomain: "pizarra-digital-175f3.firebaseapp.com",
    projectId: "pizarra-digital-175f3",
    storageBucket: "pizarra-digital-175f3.appspot.com",
    messagingSenderId: "72108406674",
    appId: "1:72108406674:web:56b160187c31ba66ffb34b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('generar-reporte').addEventListener('click', async function() {
    const form = document.getElementById('reporte-form');
    const asistente1 = form.elements['nombre1'].value;
    const asistente2 = form.elements['nombre2'].value;
    const grupo = form.elements['grupo'].value;

    if (!asistente1 || !grupo) {
        alert("Por favor, ingresa al menos el Asistente 1 y selecciona un Grupo.");
        return;
    }

    const offlineCameras = document.querySelectorAll('input[name="offline"]:checked');
    const lowBatteryCameras = document.querySelectorAll('input[name="low-battery"]:checked');

    let reporteTexto = `Inspección Cámaras Soliom Grupo ${grupo}\n\n`;
    let problemasDetectados = false;
    let listaProblemas = [];

    if (offlineCameras.length > 0) {
        problemasDetectados = true;
        offlineCameras.forEach(camara => {
            const problema = `🚫${camara.value} - Fuera de línea`;
            reporteTexto += problema + '\n';
            listaProblemas.push(problema);
        });
    }

    if (lowBatteryCameras.length > 0) {
        problemasDetectados = true;
        lowBatteryCameras.forEach(camara => {
            const problema = `🪫${camara.value} - Batería baja`;
            reporteTexto += problema + '\n';
            listaProblemas.push(problema);
        });
    }

    // Lógica nueva: un mensaje siempre se agrega
    if (problemasDetectados) {
        reporteTexto += `\n🛜 El resto de las cámaras Soliom funcionando correctamente\n\n`;
        listaProblemas.push("El resto de las cámaras Soliom funcionando correctamente");
    } else {
        reporteTexto += `\n🛜 Cámaras Soliom funcionando correctamente\n\n`;
        listaProblemas.push("Todas las cámaras Soliom funcionando correctamente.");
    }

    const now = new Date();
    const fecha = `${now.getDate()}/${now.getMonth() + 1}/${String(now.getFullYear()).slice(-2)}`;
    
    const horaVenezuelaStr = now.toLocaleTimeString("es-VE", { timeZone: "America/Caracas", hour: '2-digit', minute: '2-digit' });
    const horaCaliforniaStr = now.toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: '2-digit', minute: '2-digit' });
    
    reporteTexto += `\nAsistentes de Monitoreo:\n`;
    reporteTexto += `${asistente1}\n`;
    if (asistente2) {
        reporteTexto += `${asistente2}\n`;
    }

    reporteTexto += `\nFecha: ${fecha}\n`;
    reporteTexto += `Hora: 🇻🇪 ${horaVenezuelaStr} , 🇺🇸 ${horaCaliforniaStr}`;

    const data = {
        grupo: grupo,
        asistente1: asistente1,
        asistente2: asistente2,
        problemas: listaProblemas,
        texto_reporte: reporteTexto,
        timestamp: new Date()
    };

    try {
        const docRef = await addDoc(collection(db, "reportes_soliom"), data);
        console.log("Reporte guardado con éxito con ID:", docRef.id);
        alert("¡Reporte guardado en la base de datos!");
    } catch (error) {
        console.error("Error al guardar el reporte:", error);
        alert("Ocurrió un error al guardar el reporte. Por favor, inténtalo de nuevo.");
    }

    const reporteSalida = document.getElementById('reporte-salida');
    reporteSalida.innerHTML = `
        <pre>${reporteTexto}</pre>
    `;

    navigator.clipboard.writeText(reporteTexto)
        .then(() => {
            console.log("Reporte copiado al portapapeles!");
        })
        .catch(err => {
            console.error('Error al copiar el texto: ', err);
        });
});

window.copiarReporte = function() {
    const reporteTexto = document.querySelector('#reporte-salida pre').innerText;
    navigator.clipboard.writeText(reporteTexto).then(() => {
        alert('Reporte copiado al portapapeles!');
    }).catch(err => {
        console.error('Error al copiar el texto: ', err);
    });
};