import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, where, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

async function deleteOldPizarras() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14);

    const q = query(collection(db, "novedades"), where("timestamp", "<", cutoffDate));
    const querySnapshot = await getDocs(q);

    let deletedCount = 0;
    querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        deletedCount++;
    });

    if (deletedCount > 0) {
        console.log(`Se eliminaron ${deletedCount} pizarras antiguas.`);
    }
}

function savePizarra(event) {
    event.preventDefault();

    const form = document.querySelector('form');
    const grupo = form.querySelector('#grupo').value;
    const irwindale = form.querySelector('#Irwindale').value;
    const perris = form.querySelector('#Perris').value;
    const bonnie = form.querySelector('#Bonnie').value;
    const vernon = form.querySelector('#Vernon').value;
    const tulare = form.querySelector('#Tulare').value;
    const gualan = form.querySelector('#Gualan').value;
    const venezuela = form.querySelector('#Venezuela').value;

    if (grupo.trim() === '' || irwindale.trim() === '' || perris.trim() === '' || bonnie.trim() === '' || vernon.trim() === '' || tulare.trim() === '' || gualan.trim() === '' || venezuela.trim() === '') {
        alert("Por favor, llena todos los campos antes de guardar la pizarra.");
        return;
    }

    const data = {
        grupo: grupo,
        irwindale: irwindale,
        perris: perris,
        bonnie: bonnie,
        vernon: vernon,
        tulare: tulare,
        gualan: gualan,
        venezuela: venezuela,
        timestamp: new Date()
    };

    addDoc(collection(db, "novedades"), data)
        .then((docRef) => {
            console.log("Documento escrito con éxito con ID:", docRef.id);
            alert("¡Pizarra guardada con éxito!");
            form.reset();
            loadLastPizarra();
        })
        .catch((error) => {
            console.error("Error al escribir el documento:", error);
            alert("Ocurrió un error al guardar. Por favor, inténtalo de nuevo.");
        });
}

async function loadLastPizarra() {
    const displayElement = document.getElementById("displayLastPizarra");
    displayElement.innerHTML = "Cargando la última novedad...";

    try {
        const q = query(collection(db, "novedades"), orderBy("timestamp", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const lastPizarra = querySnapshot.docs[0].data();
            
            const timestamp = lastPizarra.timestamp.toDate();
            const formattedDate = timestamp.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const lastPizarraContent = `
                <h3>Grupo: ${lastPizarra.grupo}</h3>
                <p><strong>Fecha:</strong> ${formattedDate}</p>
                <hr>
                <p><strong>Irwindale:</strong> ${lastPizarra.irwindale}</p>
                <p><strong>Perris:</strong> ${lastPizarra.perris}</p>
                <p><strong>Bonnie:</strong> ${lastPizarra.bonnie}</p>
                <p><strong>Vernon:</strong> ${lastPizarra.vernon}</p>
                <p><strong>Tulare:</strong> ${lastPizarra.tulare}</p>
                <p><strong>Gualan:</strong> ${lastPizarra.gualan}</p>
                <p><strong>Venezuela:</strong> ${lastPizarra.venezuela}</p>
            `;
            displayElement.innerHTML = lastPizarraContent;
        } else {
            displayElement.innerHTML = "No hay pizarras para mostrar.";
        }
    } catch (error) {
        console.error("Error al obtener la pizarra:", error);
        displayElement.innerHTML = "Error al cargar la última pizarra.";
    }
}

async function reuseLastPizarra() {
    try {
        const q = query(collection(db, "novedades"), orderBy("timestamp", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const lastPizarra = querySnapshot.docs[0].data();
            
            const form = document.querySelector('form');
            form.querySelector('#grupo').value = lastPizarra.grupo;
            form.querySelector('#Irwindale').value = lastPizarra.irwindale;
            form.querySelector('#Perris').value = lastPizarra.perris;
            form.querySelector('#Bonnie').value = lastPizarra.bonnie;
            form.querySelector('#Vernon').value = lastPizarra.vernon;
            form.querySelector('#Tulare').value = lastPizarra.tulare;
            form.querySelector('#Gualan').value = lastPizarra.gualan;
            form.querySelector('#Venezuela').value = lastPizarra.venezuela;
            
            alert("¡Pizarra cargada en los campos de novedades!");
        } else {
            alert("No hay una pizarra anterior para cargar.");
        }
    } catch (error) {
        console.error("Error al cargar la pizarra para reutilizar:", error);
        alert("Ocurrió un error al cargar la pizarra. Por favor, revisa la consola.");
    }
}

document.getElementById('copyPizarraButton').addEventListener('click', async () => {
    try {
        const q = query(collection(db, "novedades"), orderBy("timestamp", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const lastPizarra = querySnapshot.docs[0].data();
            
            const timestamp = lastPizarra.timestamp.toDate();
            const formattedDate = timestamp.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Se ha modificado esta sección para usar tu formato deseado
            const textToCopy = `
*Grupo*: ${lastPizarra.grupo}

*Fecha*: ${formattedDate}

*Irwindale*: ${lastPizarra.irwindale}

*Perris*: ${lastPizarra.perris}

*Bonnie*: ${lastPizarra.bonnie}

*Vernon*: ${lastPizarra.vernon}

*Tulare*: ${lastPizarra.tulare}

*Gualan*: ${lastPizarra.gualan}

*Venezuela*: ${lastPizarra.venezuela}
            `.trim();

            await navigator.clipboard.writeText(textToCopy);
            alert("Pizarra copiada al portapapeles!");
        } else {
            alert("No hay contenido para copiar.");
        }
    } catch (err) {
        console.error('Error al copiar el texto: ', err);
        alert("Error al copiar. Por favor, intenta de nuevo.");
    }
});

document.getElementById('reusePizarraButton').addEventListener('click', reuseLastPizarra);

window.onload = async () => {
    await deleteOldPizarras();
    loadLastPizarra();
};

window.savePizarra = savePizarra;
