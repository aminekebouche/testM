# Utilisez une image Node.js comme base
FROM node:16


# Créez un répertoire de travail dans l'image
WORKDIR /usr/src/app

# Installez les dépendances nécessaires (y compris Chromium)
RUN apt-get update && apt-get install -y \
    chromium \
    && rm -rf /var/lib/apt/lists/*





# Copiez les fichiers nécessaires dans l'image
COPY package*.json ./

# Installez les dépendances
RUN npm ci
RUN npm install puppeteer

#RUN chmod -R o+rwx node_modules/puppeteer/.local-chromium

# Copiez le reste des fichiers dans l'image
COPY . .

# Exposez le port sur lequel votre application écoute
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["npm", "start"]
