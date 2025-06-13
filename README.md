# BeTN

- Nicolò Bellè - unitn mail: nicolo.belle@studenti.unitn.it - ID: 238178
- Riccardo Bassan - unitn mail: riccardo.bassan@studenti.unitn.it - ID: 238793
- Andrea Costantino - unitn mail: andrea.costantino-1@studenti.unitn.it - ID: 237768

### ACCESSO ALLA WEB APP

- Render: https://betn-qt7a.onrender.com
- Account 
   - admin:  email: comuneditrento@gmail.com    password: Comune1@
   - utente:  email: utenteprova@gmail.com          password: Prova1@


### ESECUZIONE DEL CODICE PER PROVARE LE API CON SWAGGER

### Tools and Libraries
- Node.js

Copiare il link della repository:
```bash
https://github.com/app-BeTN/BeTN/
```

Aprire il terminale (su macOS o Linux) oppure Prompt dei comandi (su Windows).

Usare il comando cd per spostarti nella cartella dove vuoi clonare la repo in locale:
```bash
cd /percorso/della/cartella
```

Clonare la repository:
```bash
git clone https://github.com/app-BeTN/BeTN/
```

Entrare nella cartella clonata e muoversi dentro `backend`:
```bash
cd BeTN/BeTN_swagger/backend
```

Eseguire i seguenti comandi:
```bash
npm install
npm install cors swagger-ui-express yamljs
```

Eseguire il codice con il seguente comando:
```bash
node server.js
```

Per visualizzare la GUI di swagger nel browser copiare il link presente nel terminale, o quello qua sotto prestando attenzione se viene modificata la porta `3006`:
```bash
http://localhost:3006/api-docs
```







