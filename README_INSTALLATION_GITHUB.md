# Installation MesHeures V3

## Méthode la plus sûre : GitHub Web

1. Ouvrir le dépôt GitHub.
2. Pour chaque fichier, utiliser **Add file / Upload files** ou ouvrir le fichier puis **Edit**.
3. Remplacer uniquement :
   - index.html
   - sw.js
   - style/v3.css
   - scripts/v3.js
4. Ne pas remplacer `scripts/app.js`.
5. Committer directement sur une branche `v3-real-redesign`.
6. Tester GitHub Pages / PWA avant fusion vers `main`.

## Pourquoi une branche ?
Ton application actuelle reste intacte. Si un problème apparaît, tu peux revenir immédiatement sur `main`.

## Vérification après déploiement
Sur Android/PWA :
- fermer complètement l'application ;
- vider le cache du site si nécessaire ;
- recharger ;
- vérifier Accueil, Jour, Mois, Paie, Audit, Bulletin, ROMI1 et Réglages.
