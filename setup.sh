#!/bin/bash

# Nom du projet (par défaut le dossier courant)
PROJECT_NAME=${PWD##*/}

echo "🚀 Initialisation du projet $PROJECT_NAME ..."

# 1. Initialiser npm
npm init -y > /dev/null 2>&1

# 2. Installer Sass
npm install sass --save-dev

# 3. Créer l’arborescence
mkdir -p scss css assets

# 4. Créer les fichiers de base
cat > scss/styles.scss <<EOL
/* SCSS principal pour $PROJECT_NAME */

body {
  font-family: sans-serif;
  background: #fafafa;
  color: #333;
}
EOL

cat > index.php <<EOL
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>$PROJECT_NAME</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <h1>Bienvenue sur $PROJECT_NAME 🎯</h1>
  <p>Projet headless simple avec SCSS.</p>
</body>
</html>
EOL

cat > readme.md <<EOL
# $PROJECT_NAME

Projet simple avec SCSS compilé via \`npm run sass\`.

## Commandes

- \`npm run sass\` → compiler SCSS vers CSS (mode watch).
- Ouvrir le site via Valet : https://$PROJECT_NAME.test
EOL

# 5. Modifier package.json pour ajouter le script npm
npx json -I -f package.json -e 'this.scripts={ "sass":"sass --watch scss:css" }'

# 6. Valet setup
echo "🔗 Liaison du projet avec Valet..."
valet link "$PROJECT_NAME"
valet secure "$PROJECT_NAME"

# 7. Message final
echo "✅ Projet $PROJECT_NAME prêt !"
echo "👉 Lance la compilation SCSS avec : npm run sass"
echo "👉 Ouvre ton site sur : https://$PROJECT_NAME.test"
