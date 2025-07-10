#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');
const yargs = require('yargs');

const argv = yargs
  .option('output', {
    alias: 'o',
    description: 'Nome do arquivo WAR de saída',
    type: 'string',
    default: 'dist/app.war'
  })
  .option('context', {
    alias: 'c',
    description: 'Nome do contexto (web-app)',
    type: 'string',
    default: 'AngularApp'
  })
  .option('dist-folder', {
    alias: 'd',
    description: 'Caminho da pasta de build do Angular (por padrão: dist/)',
    type: 'string',
    default: 'dist'
  })
  .help()
  .argv;

const buildAndPackage = async () => {
  const distRoot = argv['dist-folder'];

  // verifica se a pasta dist existe
  if (!fs.existsSync(distRoot)) {
    throw new Error(`A pasta '${distRoot}' não existe. Execute 'ng build' primeiro ou use --dist-folder para informar o caminho.`);
  }

  // detecta subdiretório do projeto dentro do dist/
  const projects = fs.readdirSync(distRoot).filter(f => fs.statSync(path.join(distRoot, f)).isDirectory());
  if (projects.length === 0) {
    throw new Error(`Nenhum subdiretório encontrado em '${distRoot}/'.`);
  }

  const projectName = projects[0]; // usa o primeiro projeto encontrado
  const rootDist = path.join(distRoot, projectName);

  // se existir pasta 'browser', é a que deve ser empacotada
  const buildDir = fs.existsSync(path.join(rootDist, 'browser'))
    ? path.join(rootDist, 'browser')
    : rootDist;

  const webInfDir = path.join(buildDir, 'WEB-INF');

  console.log('📁 Criando estrutura WAR...');
  await fs.ensureDir(webInfDir);

  const webXml = `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         version="4.0"
         metadata-complete="true">
  <display-name>${argv.context}</display-name>
  <welcome-file-list>
    <welcome-file>index.html</welcome-file>
  </welcome-file-list>
  <error-page>
    <error-code>404</error-code>
    <location>/index.html</location>
  </error-page>
</web-app>`;

  await fs.writeFile(path.join(webInfDir, 'web.xml'), webXml);

  console.log('📦 Compactando para WAR...');
  await fs.ensureDir(path.dirname(argv.output));

  const output = fs.createWriteStream(argv.output);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`✅ WAR gerado com sucesso: ${argv.output} (${archive.pointer()} bytes)`);
  });

  archive.on('error', err => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(buildDir, false);
  await archive.finalize();
};

buildAndPackage().catch(err => {
  console.error('❌ Erro ao empacotar WAR:', err.message || err);
  process.exit(1);
});
