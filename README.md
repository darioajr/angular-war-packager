# 📦 angular-war-packager

Packages Angular applications (v18+) as `.war` files ready for Java EE servers, including an automatic `WEB-INF/web.xml`.

---

## 🚀 Installation

### Global:

```bash
npm install -g angular-war-packager
```

### Or local (dev dependency):

```bash
npm install --save-dev angular-war-packager
```

### 🔽 Or download the `.tgz` package directly:

[⬇️ Download angular-war-packager-x.x.x.tgz](https://github.com/darioajr/angular-war-packager/releases)


---

## ⚙️ Usage

```bash
npx ng-war
```

### Full example:

```bash
npx ng-war --output dist/myapp.war --context MyAngularApp --dist-folder dist
```

---

## 🔧 Available options

| Parameter             | Description                                                               |
|-----------------------|---------------------------------------------------------------------------|
| `--output`, `-o`      | Name of the generated WAR (default: `dist/app.war`)                       |
| `--context`, `-c`     | Context name used in `web.xml` (default: `AngularApp`)                    |
| `--dist-folder`, `-d` | Path to the output folder from `ng build` (default: `dist/`)              |

---

## 📂 Generated structure

```
dist/
└── app.war
    ├── index.html
    ├── assets/
    └── WEB-INF/
        └── web.xml
```

---

## 🧪 Quick test

```bash
ng new angular-war-test
cd angular-war-test
ng build
npx ng-war
```

---

## 🛡️ Requirements

- Node.js 16+
- Angular CLI with `ng build` executed

---

## 🧬 Automation with GitHub Actions

This project can be published automatically to npm with a `v*` tag push. See the workflow at:

```yaml
.github/workflows/publish-npm.yml
```

---

## 📄 License

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) ©Dario Alves
