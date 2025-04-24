# CL&IHM 2024-2025 : CC 1 

## AVANT TOUT

Veuillez renseigner ici votre numéro d'anonymat :

* Numéro d'anonymat :

Une fois cela fait
* Sauver ce fichier
* Ouvrez un terminal **indépendamment de vsCode**
* Dans ce terminal, placez vous dans le répertoire du CC et saisissez les commandes suivantes
  * git add README.md
  * git commit -m "numéro d'anonymat"
  * git push

Au cours du CC, vous pourrez utiliser l'interface de vsCode pour faire vos commits.

**MAIS** vous **devrez** utiliser un terminal indépendant de vsCode pour **pousser** votre code sur le dépôt GitHub (commande `git push`).

Vérifiez bien dans l'onglet "source control" puis via le bouton "view git graph" que votre code a bien été poussé sur le dépôt d'origine.

## Objectifs

Vous devez coder une petite application qui permet de visualiser des données géographiques sur une carte. Cette application utilisera les services Web de d'une API publique pour récupérer des données géographiques (coordonnées spatiales, contours de communes, départements, régions, etc.) et les afficher sur une carte. Les API qui sont mises à disposition ne fonctionnent que pour le territoire français.

L'application suivante permet de visualiser le résultat attendu, elle est donnée à titre indicatif : https://alexdmr.github.io/l3m-2024-2025-clihm-cc-01/

Comportement attendu de l'application :
* Lorsque l'utilisateur clique sur la carte à gauche :
  * si le clic est sur une commune du territoire français, alors les informations de la commune sont affichées, ainsi que les départements de la région dans laquelle se trouve la commune.
  * si le clic est ailleurs que sur le territoire français, alors un message d'erreur est affiché.
* L'utilisateur peut changer la couleur associé à un des département affiché en cliquant sur le champs de spécification de couleur dans la liste des départements (en bas à droite par rapport à la carte principale).

Le composant racine est constituée de :

* une carte (la carte à gauche), qui peut afficher les départements correspondants à la région de la commune sur laquelle on a cliqué.
* un composant `app-commune` est affiché en haut à droite de la carte principale. Il affiche une autre carte qui est centrée sur la commune, affiche les contours de celle-ci et un marqueur qui indique la position de la mairie. Ce composant se met à jour à chaque clic sur la carte principale.
* un composant `app-region` est affiché en bas à droite de la carte principale. Il affiche une liste de départements, chacun avec une couleur associée. Lorsque l'utilisateur clique sur un département, la couleur associée à celui-ci est modifiée.

## Code fourni

### Composants
Les composants précédemment cités sont déjà créés et sont disponibles dans le dossier `src/app/components`. Vous devrez les compléter.

### Structures de données

Les structures de données ainsi que des fonctions utilitaires sont disponibles dans le répertoire `src/app/data`.

* `communes.ts` : contient la définition de l'interface `Commune` ainsi que le schéma `Zod` associé.
* `departements.ts` : contient la définition de l'interface `Departement` ainsi que le schéma `Zod` associé.
* `regions.ts` : contient la définition de l'interface `Region` ainsi que le schéma `Zod` associé.
* `mock.ts` : contient des données de test pour les communes, départements et régions. Ces données sont utilisées par le service afin que vous puissiez travailler sur les composants sans avoir complètement codé le service.
* `geometrie.ts` : contient des fonctions utilitaires pour convertir des données géographiques en données utilisables par `ngx-leaflet` (`Marker`, `Polygon`, `Layer`, etc.).
* `data.carto.ts` : contient des définition d'interfaces combinant les données de découpage administratif (département, région, commune) avec les données géographiques associées (contours, positions).

### Services

Un service `CartoService` est disponible dans le répertoire `src/app/services`. Ce service doit permettre de récupérer des informations sur les communes, départements et régions. Il sera à compléter en utilisant les fonctions définies dans le fichier `api.gouv.ts` du même répertoire, notez qu'il ne faut pas modifier ces fonctions.

## Exercices

Pour démarrer, injectez le service `CartoService` dans le composant racine `app.component.ts` et utilisez-le pour récupérer les données dont vous aurez besoin.

### A) Composant `app-commune` (5 points)

Compléter le composant `app-commune` pour qu'il affiche les contours de la commune et un marqueur pour la mairie. Vous devez coder un **composant pur** ayant pour entrées :

* **`communeCarto`** une entrée requise acceptant des données de type `CommuneCarto`.
* **`couleur`** une entrée non requise acceptant une couleur sous forme de chaîne de caractères. La couleur par défaut est `#FF0000` (rouge).

N'oubliez pas que **vous devez ajouter ce composant dans le composant racine** afin de la tester (vous devrez aussi l'importer, décommenter au niveau des imports du décorateur `@Components` la ligne correspondante dans `app.component.ts`).

#### A.1) Dérivation de données

Dérivez un signal `private` nommé `_marker` et produisant des données de type `Marker`. Le marqueur doit être positionné sur la mairie de la commune. (voir la fonction `getLeafletMarkerFromCoords` de `geometrie.ts`).

Dérivez un signal `private` nommé `_contour` et produisant des données de type `Layer`. Le contour doit être celui de la commune et de la couleur spécifiée par le composant. (voir la fonction `getLayerFromGeoJSON` de `geometrie.ts`).

Dérivez un signal `protected` nommé `state`, produisant des données de type `CommuneState` à partir des entrées (L'interface `CommuneState` est définie au début du fichier `app-commune.component.ts`). 
* Le tableau `layers` doit contenir dans l'ordre : le fond de carte (voir l'attribut `baseLayer`), le contour de la commune et le marqueur de la mairie. 
* Vous pouvez utiliser la fonction `latLng` pour convertir les coordonnées de la commune (de type `LatLngTuple`) en `LatLng`.

**Attention** : Notez bien que `CommuneState` étend `CommuneCarto`.

#### A.2) Vue

Complétez la vue du composant pour afficher le contour de la commune et le marqueur de la mairie, centrez la carte sur le centre de la commune. Ajoutez le nom de la commune à l'endroit prévu (balise `<div class="name">`).

**Attention** :
* Utilisez l'attribut `leafletOptions` de la carte pour définir les options de la carte (voir l'attribut options de la classe `CommuneState`).
* Utilisez l'attribut `leafletLayers` de la carte pour afficher les couches de la carte.
* Utilisez l'attribut `leafletCenter` de la carte pour centrer la carte sur le centre de la commune. Cet attribut demande une donnée de type `LatLng`, que vous trouverez dans l'attribut `options.center`...

N'oubliez pas d'ajouter le nom de la commune avant la carte.

### B) Composant `app-region` (5 points)

Vous devez coder un **composant pur** ayant :

* une entrée **`regionCarto`** requise acceptant des données de type `RegionCarto`.
* une entrée/sortie **`couleurs`** acceptant des tableaux immuables de couleurs sous forme de chaînes de caractères (`readonly string[]`). La valeur par défaut est `[]`.

Complétez la vue et la vue-modèle du composant afin d'afficher le nom de la région puis la liste des départements avec la couleur associée (le département d'indice `i` aura la couleur d'indice `i` dans le tableau `couleurs`). Si cette couleur n'est pas définie, le département doit être affiché avec la couleur par défaut (bleue) `#0000FF`. Utilisez des balise `<ul>` et `<li>` pour afficher la liste des départements.

La couleur doit être éditable, lorsque l'utilisateur modifie la couleur associée à un département, il faut émettre en sortie du composant le nouveau tableau de couleurs. Utilisez une balise `<input type="color" />` pour permettre à l'utilisateur de choisir une couleur.

Pour chaque département, on affichera la couleur, son numéro de département (code) et son nom.

**Attention** : N'oubliez pas d'inclure votre composant dans le composant racine pour le tester.

### C) Service `CartoService` (7 points)

Complétez la méthode `updateDataFromCoord` de ce service.
Appuyez vous sur les fonctions (à l'extérieur de la classe) définies dans `geometrie.ts` et `api.gouv.ts`: `searchCommune`, `getGeometrieCommune`, `searchRegion`, `getDepartementCodesFromRegion`, `getGeometrieDepartement`, `getLatLngCentre`, `getLatLngMairie`. Lisez bien la définition de cette fonction dans les commentaires du code.

**Indications** : Vous pouvez implémenter et utiliser les fonctions suivantes :
* **`getCommuneCarto`**
    ```typescript
    function getCommuneCarto(commune: Commune): Promise<CommuneCarto>
    ```
* **`getDepartementCarto`**
    ```typescript
    function getDepartementCarto(departement: Departement): Promise<DepartementCarto>
    ```
* **`getRegionCarto`**
    ```typescript
    function getRegionCarto(commune: Commune): Promise<RegionCarto>
    ```

### D) Composant `app-root` (7 points)

Complétez la vue et la vue-modèle du composant racine `app-root` afin de respecter le comportement attendu de l'application (revoir les objectifs au début du sujet).

Indications :

* Assurez-vous de bien avoir injecté le service `CartoService` (ça devrait déjà être le cas si vous avez répondu aux questions précédentes).
* Utilisez l'attribut `leafletLayers` de la carte pour afficher les couches de la carte, en particulier les contours des départements (voir `getLayerFromGeoJSON`).
* Utilisez `leafletClick` pour détecter les clics sur la carte. Les événements renvoyés sont de type `LeafletMouseEvent`.
* Utilisez le signal `_errorMsg` pour afficher un message d'erreur si il n'y a pas de commune à l'endroit du clic.
* Vérifiez que vous transmettez les bonnes couleurs aux composants `app-commune` et `app-region` et que vous maintenez bien à jour les couleurs lorsqu'elles sont modifiées par le composant `app-region`.

### E) Bonus (2 points)

Modifiez le service `CartoService` pour vérifiez la conformité des données reçues via les API en utilisant les schémas `Zod` correspondants (définis dans les fichiers `communes.ts`, `departements.ts` et `regions.ts`).

### F) Bonus (1 points)

Modifier le code du service `CartoService` pour ne pas réinitialiser les couleurs associées aux départements.
