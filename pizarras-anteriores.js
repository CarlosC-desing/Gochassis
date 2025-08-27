import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBWbXtxxdSGXpt3oJ-3uZLxdrNFkrTO7lg",
    authDomain: "pizarra-digital-175f3.firebaseapp.com",
    projectId: "pizarra-digital-175f3",
    storageBucket: "pizarra-digital-175f3.firebasestorage.app",
    messagingSenderId: "72108406674",
    appId: "1:72108406674:web:56b160187c31ba66ffb34b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const pizarrasContainer = document.getElementById('pizarras-container');

    const loadPizarras = async () => {
        pizarrasContainer.innerHTML = 'Cargando el historial...';
        try {
            const q = query(collection(db, "novedades"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);

            pizarrasContainer.innerHTML = '';
            if (querySnapshot.empty) {
                pizarrasContainer.innerHTML = '<p>No se encontraron pizarras anteriores.</p>';
            } else {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const timestamp = data.timestamp.toDate();
                    const formattedDate = timestamp.toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    });

                    const card = document.createElement('div');
                    card.className = 'pizarra-card';
                    card.innerHTML = `
                        <h2>Pizarra del Grupo ${data.grupo}</h2>
                        <p><strong>Fecha:</strong> ${formattedDate}</p>
                        <hr>
                        <p><strong>Irwindale:</strong> ${data.irwindale}</p>
                        <p><strong>Perris:</strong> ${data.perris}</p>
                        <p><strong>Boyle:</strong> ${data.boyle}</p>
                        <p><strong>Vernon:</strong> ${data.vernon}</p>
                        <p><strong>Tulare:</strong> ${data.tulare}</p>
                        <p><strong>Gualan:</strong> ${data.gualan}</p>
                        <p><strong>Venezuela:</strong> ${data.venezuela}</p>
                    `;
                    pizarrasContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error("Error al obtener las pizarras:", error);
            pizarrasContainer.innerHTML = '<p>Ocurrió un error al cargar las pizarras.</p>';
        }
    };
    loadPizarras();
});