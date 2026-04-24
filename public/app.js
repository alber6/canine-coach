document.getElementById('dogForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página recargue

    // 1. Recogemos los datos del formulario
    const perfilPerro = {
        raza: document.getElementById('raza').value,
        edad: document.getElementById('edad').value,
        peso: document.getElementById('peso').value,
        nivelActividad: document.getElementById('actividad').value,
        problemaPrincipal: document.getElementById('problema').value
    };

    // 2. Preparamos la interfaz (Mostramos carga, ocultamos resultados)
    const btn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');
    const resultados = document.getElementById('resultados');
    
    btn.disabled = true;
    loader.classList.remove('hidden');
    resultados.classList.add('hidden');

    document.querySelector('.dashboard').classList.add('modo-resultados');
    try {
        // 3. Enviamos los datos a nuestro propio backend (Node.js)
        const response = await fetch('/api/consultar-perro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(perfilPerro)
        });

        const data = await response.json(); // Atrapamos el JSON de Gemini

        // 4. Pintamos los datos en la web
        document.getElementById('res-psico').textContent = data.analisis_psicologico;
        document.getElementById('res-nutri').textContent = data.recomendacion_nutricional;
        
        // Pintamos el array de pasos del adiestramiento como una lista
        const listaPlan = document.getElementById('res-plan');
        listaPlan.innerHTML = ''; // Limpiamos listas anteriores
        data.plan_adiestramiento.forEach(paso => {
            const li = document.createElement('li');
            li.textContent = paso;
            listaPlan.appendChild(li);
        });

        // 5. Mostramos los resultados
        resultados.classList.remove('hidden');

    } catch (error) {
        alert("Hubo un error conectando con el servidor. Revisa la consola.");
        console.error(error);
    } finally {
        // Restauramos el botón y ocultamos la carga
        btn.disabled = false;
        loader.classList.add('hidden');
    }
});