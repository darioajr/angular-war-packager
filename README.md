# 📦 angular-war-packager

Empacota aplicações Angular (v18+) como arquivos `.war` prontos para servidores Java EE, incluindo um `WEB-INF/web.xml` automaticamente.

---

## 🚀 Instalação

### Global:

```bash
npm install -g angular-war-packager
```

### Ou local (dev dependency):

```bash
npm install --save-dev angular-war-packager
```

### 🔽 Ou baixe diretamente o pacote `.tgz`:

[⬇️ Download angular-war-packager-1.0.0.tgz](https://github.com/darioajr/angular-war-packager/releases/download/v1.0.0/angular-war-packager-1.0.0.tgz)

> Substitua o link acima após criar um release no GitHub com o arquivo `.tgz` anexado.

---

## ⚙️ Uso

```bash
npx ng-war
```

### Exemplo completo:

```bash
npx ng-war --output dist/meuapp.war --context MeuAppAngular --dist-folder dist
```

---

## 🔧 Opções disponíveis

| Parâmetro             | Descrição                                                                  |
|-----------------------|---------------------------------------------------------------------------|
| `--output`, `-o`      | Nome do WAR gerado (default: `dist/app.war`)                               |
| `--context`, `-c`     | Nome do contexto usado no `web.xml` (default: `AngularApp`)                |
| `--dist-folder`, `-d` | Caminho para a pasta de saída do `ng build` (default: `dist/`)             |

---

## 📂 Estrutura gerada

```
dist/
└── app.war
    ├── index.html
    ├── assets/
    └── WEB-INF/
        └── web.xml
```

---

## 🧪 Teste rápido

```bash
ng new angular-war-test
cd angular-war-test
ng build
npx ng-war
```

---

## 🛡️ Requisitos

- Node.js 16+
- Angular CLI com `ng build` executado

---

## 📄 Licença

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) © [Seu Nome]
