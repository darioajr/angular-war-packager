#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');
const yargs = require('yargs');

const argv = yargs
  .option('output', {
    alias: 'o',
    description: 'Output WAR file name',
    type: 'string',
    default: 'dist/app.war'
  })
  .option('context', {
    alias: 'c',
    description: 'Context name (web-app)',
    type: 'string',
    default: 'AngularApp'
  })
  .option('dist-folder', {
    alias: 'd',
    description: 'Angular build folder path (default: dist/)',
    type: 'string',
    default: 'dist'
  })
  .help()
  .argv;

const buildAndPackage = async () => {
  const distRoot = argv['dist-folder'];

  // check if the dist folder exists
  if (!fs.existsSync(distRoot)) {
    throw new Error(`The folder '${distRoot}' does not exist. Run 'ng build' first or use --dist-folder to specify the path.`);
  }

  // detect project subdirectory inside dist/
  const projects = fs.readdirSync(distRoot).filter(f => fs.statSync(path.join(distRoot, f)).isDirectory());
  if (projects.length === 0) {
    throw new Error(`No subdirectory found in '${distRoot}/'.`);
  }

  const projectName = projects[0]; // use the first project found
  const rootDist = path.join(distRoot, projectName);

  // if 'browser' folder exists, it should be packaged
  const buildDir = fs.existsSync(path.join(rootDist, 'browser'))
    ? path.join(rootDist, 'browser')
    : rootDist;

  const webInfDir = path.join(buildDir, 'WEB-INF');

  console.log('📁 Creating WAR structure...');
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

  console.log('📦 Packaging to WAR...');
  await fs.ensureDir(path.dirname(argv.output));

  const output = fs.createWriteStream(argv.output);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`✅ WAR successfully generated: ${argv.output} (${archive.pointer()} bytes)`);
  });

  archive.on('error', err => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(buildDir, false);
  await archive.finalize();
};

buildAndPackage().catch(err => {
  console.error('❌ Error packaging WAR:', err.message || err);
  process.exit(1);
});
