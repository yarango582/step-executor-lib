#!/usr/bin/env node

/**
 * Script para ejecutar los ejemplos de step-executor-lib
 * 
 * Uso:
 *   npm run examples sequential
 *   npm run examples mixed
 *   npm run examples all
 */

const { exec } = require('child_process');
const path = require('path');

const examples = {
    sequential: 'src/examples/sequential-pipeline.ts',
    mixed: 'src/examples/mixed-pipeline.ts'
};

async function runExample(type) {
    return new Promise((resolve, reject) => {
        const examplePath = examples[type];
        if (!examplePath) {
            reject(new Error(`Ejemplo "${type}" no encontrado. Disponibles: ${Object.keys(examples).join(', ')}`));
            return;
        }

        console.log(`\n🚀 Ejecutando ejemplo: ${type}`);
        console.log(`📁 Archivo: ${examplePath}`);
        console.log('─'.repeat(50));

        const command = `npx ts-node ${examplePath}`;
        const child = exec(command, { cwd: __dirname });

        child.stdout.on('data', (data) => {
            process.stdout.write(data);
        });

        child.stderr.on('data', (data) => {
            process.stderr.write(data);
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log('─'.repeat(50));
                console.log(`✅ Ejemplo "${type}" completado exitosamente\n`);
                resolve();
            } else {
                reject(new Error(`Ejemplo "${type}" falló con código ${code}`));
            }
        });
    });
}

async function main() {
    const arg = process.argv[2];
    
    if (!arg) {
        console.log('📚 Ejemplos disponibles:');
        console.log('  sequential - Pipeline CI/CD secuencial');
        console.log('  mixed      - Deployment de microservicios mixto');
        console.log('  all        - Ejecutar todos los ejemplos');
        console.log('\nUso: npm run examples <tipo>');
        return;
    }

    try {
        if (arg === 'all') {
            for (const type of Object.keys(examples)) {
                await runExample(type);
                // Pausa entre ejemplos
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            console.log('🎉 Todos los ejemplos ejecutados exitosamente!');
        } else {
            await runExample(arg);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
