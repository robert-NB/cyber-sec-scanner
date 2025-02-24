document.getElementById('scan-btn').addEventListener('click', async () => {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = '<p>Escaneando...</p>';

    try {
        const results = await window.electronAPI.runSecurityScan();
        resultsElement.innerHTML = `
            <p><b>Sistema Operativo:</b> ${results.os}</p>
            <p><b>Antivirus (Windows Defender):</b> ${results.antivirus}</p>
            <p><b>Firewall:</b> ${results.firewall}</p>
            <p><b>Puertos Abiertos:</b> ${results.openPorts}</p>
            <p><b>Actualizaciones de Windows:</b> ${results.windowsUpdates}</p>
            <p><b>Ejecutado como Administrador:</b> ${results.admin}</p>
        `;
    } catch (error) {
        resultsElement.innerHTML = `<p style="color: red;">Error: ${error.message || 'Ocurrió un error durante el escaneo.'}</p>`;
    }
});