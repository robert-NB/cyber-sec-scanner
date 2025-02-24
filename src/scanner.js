const { exec } = require('child_process');
const os = require('os');

async function getOSName() {
    const osNameModule = await import('os-name');
    const osName = osNameModule.default;
    return osName(os.platform(), os.release());
}

async function checkWindowsDefender() {
    return new Promise((resolve) => {
        exec('powershell "Get-MpComputerStatus | Select-Object -ExpandProperty AntivirusEnabled"', (error, stdout) => {
            const isActive = stdout.trim() === 'True';
            exec('powershell "Get-MpComputerStatus | Select-Object -ExpandProperty AntivirusSignatureVersion"', (error, version) => {
                exec('powershell "Get-MpComputerStatus | Select-Object -ExpandProperty AntivirusSignatureLastUpdated"', (error, lastUpdated) => {
                    resolve(isActive ? `Activo (Versión: ${version.trim()}, Última actualización: ${lastUpdated.trim()})` : 'Desactivado');
                });
            });
        });
    });
}

async function checkFirewall() {
    return new Promise((resolve) => {
        exec('powershell "Get-NetFirewallProfile | Select-Object Name, Enabled"', (error, stdout) => {
            const profiles = stdout.split('\n').filter(line => line.trim() !== '').map(line => {
                const [name, enabled] = line.trim().split(/\s+/);
                return `${name}: ${enabled === 'True' ? 'Activo' : 'Desactivado'}`;
            });
            resolve(profiles.join(', '));
        });
    });
}

async function checkOpenPorts() {
    return new Promise((resolve) => {
        exec('netstat -ano | findstr LISTENING', (error, stdout) => {
            const ports = stdout.match(/:\d+/g)
                .map(p => p.replace(':', ''))
                .filter(p => p > 0 && p <= 65535); // Filtra puertos válidos
            resolve([...new Set(ports)].join(', ') || 'Ninguno');
        });
    });
}

async function checkWindowsUpdates() {
    return new Promise((resolve) => {
        exec('powershell "Get-WmiObject -Query \'SELECT * FROM SoftwareUpdate\' | Measure-Object | Select-Object -ExpandProperty Count"', (error, stdout) => {
            if (error || stdout.trim() === '') {
                resolve('No se puede verificar');
            } else {
                resolve(stdout.trim() > 0 ? 'Pendientes' : 'Actualizado');
            }
        });
    });
}

async function checkAdmin() {
    return new Promise((resolve) => {
        exec('powershell "([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)"', (error, stdout) => {
            resolve(stdout.trim() === 'True' ? 'Sí' : 'No');
        });
    });
}

async function runScan() {
    return {
        os: await getOSName(),
        antivirus: await checkWindowsDefender(),
        firewall: await checkFirewall(),
        openPorts: await checkOpenPorts(),
        windowsUpdates: await checkWindowsUpdates(),
        admin: await checkAdmin(),
    };
}

module.exports = { runScan };