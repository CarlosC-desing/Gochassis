import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', () => {
    const reportesContainer = document.getElementById('reportes-container');

    const loadReports = async () => {
        reportesContainer.innerHTML = 'Cargando el historial...';
        try {
            const q = query(collection(db, "reportes_soliom"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);

            reportesContainer.innerHTML = '';
            if (querySnapshot.empty) {
                reportesContainer.innerHTML = '<p>No se encontraron reportes anteriores.</p>';
            } else {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const timestamp = data.timestamp.toDate();
                    const formattedDate = timestamp.toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    });
                    const formattedTime = timestamp.toLocaleTimeString('es-ES', {
                        hour: '2-digit', minute: '2-digit'
                    });

                    const card = document.createElement('div');
                    card.className = 'reporte-card';
                    card.innerHTML = `
                        <h2>Reporte del Grupo ${data.grupo}</h2>
                        <p><strong>Fecha y Hora:</strong> ${formattedDate}, ${formattedTime}</p>
                        <p><strong>Asistentes:</strong> ${data.asistente1} ${data.asistente2 ? 'y ' + data.asistente2 : ''}</p>
                        <hr>
                        <pre>${data.texto_reporte}</pre>
                        <button onclick="copiarReporte(this)">Copiar Reporte</button>
                    `;
                    reportesContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error("Error al obtener los reportes:", error);
            reportesContainer.innerHTML = '<p>Ocurrió un error al cargar los reportes.</p>';
        }
    };
    
    // Función para copiar el reporte
    window.copiarReporte = function(button) {
        const reporteTexto = button.parentElement.querySelector('pre').innerText;
        navigator.clipboard.writeText(reporteTexto).then(() => {
            alert('Reporte copiado al portapapeles!');
        }).catch(err => {
            console.error('Error al copiar el texto: ', err);
        });
    };

    loadReports();
});