// Liste des citations avec balises HTML pour styliser certains mots

const citations = [
	"Du pire (1) au meilleur (100) plat à prendre en bivouac",
	"Du pire (1) au meilleur (100) rêve/cauchemar",
	"Du pire (1) au meilleur (100) entretien d'embauche",
	"Du pire (1) au meilleur (100) rencard",
	"De la pire (1) à la meilleure (100) façon de tricher à un examen",
	"De la pire (1) à la meilleure (100) façon de quitter quelqu’un",
	"De la pire (1) à la meilleure (100) demande en mariage",
	"Du pire (1) au meilleur (100) plat à cuisiner pour être en bonne santé",
	"Du pire (1) au meilleur (100) objet pour caler une table",
	"Du pire (1) au meilleur (100) objet pour commettre un meurtre",
	"Du pire (1) au meilleur (100) sujet de philo",
	"De la pire (1) à la meilleure (100) raison de mentir sur son âge",
	"Du pire (1) au meilleur (100) ami célèbre",
	"Du pire (1) au meilleur (100) animal avec qui se bagarrer",
	"De la pire (1) à la pire (100) douleur",
	"De la pire (1) à la meilleure (100) couverture pour un espion",
	"Du pire (1) au meilleur (100) souvenir d’enfance",
	"Du pire (1) au meilleur (100) chose à trouver dans un frigo",
	"De la pire (1) à la meilleure (100) résolution pour la nouvelle année",
	"Du pire (1) au meilleur (100) ingrédient à mettre sur une pizza",
	"Du pire (1) au meilleur (100) film à regarder lors d’un premier date",
	"Du pire (1) au meilleur (100) plat à cuisiner pour un premier date",
	"De la pire (1) à la meilleure (100) chanson d’enterrement",
	"De la pire (1) à la meilleure (100) activité à la plage",
	"Du pire (1) au meilleur (100) objet à prendre sur une île déserte",
	"Du pire (1) au meilleur (100) plat de cantine",
	"Du pire (1) au meilleur (100) mot dans le carnet",
	"Du pire (1) au meilleur (100) cadeau d’anniversaire",
	"De la pire (1) à la meilleure (100) situation d’être en garde à vue",
	"Du pire (1) au meilleur (100) partenaire de crime",
	"Du pire (1) au meilleur (100) cadeau de naissance",
	"Du pire (1) au meilleur (100) goût en croquant dans un chocolat",
	"Du pire (1) au meilleur (100) truc à utiliser quand tu n’as plus de papier toilette",
	"Du pire (1) au meilleur (100) endroit où être quand tu as envie d’aller aux toilettes",
	"Du pire (1) au meilleur (100) objet à utiliser comme couverture",
	"Du pire (1) au meilleur (100) objet à utiliser comme brosse à dents",
	"Du pire (1) au meilleur (100) tatouage",
	"Du pire (1) au meilleur (100) thème de musée",
	"De la pire (1) à la meilleure (100) chose à faire pour calmer un bébé qui pleure",
	"Du pire (1) au meilleur (100) discours de mariage",
	"Du pire (1) au meilleur (100) scénario de vacances",
	"De la pire (1) à la meilleure (100) chose à perdre",
	"De la pire (1) à la meilleure (100) chose à gagner",
	"De la pire (1) à la meilleure (100) chose à oublier",
	"De la pire (1) à la meilleure (100) raison d’être en retard à un entretien d’embauche",
	"Du pire (1) au meilleur (100) aliment à manger avec du ketchup",
	"Du pire (1) au meilleur (100) chose à trouver dans un grenier",
	"De la pire (1) à la meilleure (100) disquette",
	"De la pire (1) à la meilleure (100) personne (fictive ou non) pour cambrioler une banque",
	"Du pire (1) au meilleur (100) véhicule pour une course-poursuite",
	"Du pire (1) au meilleur (100) plat à manger avant de mourir",
	"Du pire (1) au meilleur (100) animal de compagnie",
	"Du pire (1) au meilleur (100) titre de film français",
	"Du pire (1) au meilleur (100) duo de célébrités pour faire un feat de rap",
	"De la pire (1) à la meilleure (100) raison d’être en colère",
	"De la pire (1) à la meilleure (100) chose à exposer dans son salon",
	"De la pire (1) à la meilleure (100) chose probable à voir dans le ciel",
	"De la pire (1) à la meilleure (100) chose à faire pour se faire pardonner",
	"Du pire (1) au meilleur (100) sujet de stage",
	"De la pire (1) à la meilleure (100) raison pour faire une heure de colle",
	"Du pire (1) au meilleur (100) cadeau pour la fête des mères",
	"Du pire (1) au meilleur (100) cadeau pour la fête des pères",
	"Du pire (1) au meilleur (100) matériau pour construire une maison",
	"Du pire (1) au meilleur (100) signe de gang",
	"Du pire (1) au meilleur (100) thème de soirée déguisée",
	"Du pire (1) au meilleur (100) association universitaire",
	"De la société la plus confuse (1) à la plus structurée (100)",
	"De la pire (1) à la meilleure (100) tendance de mode",
	"Du pire (1) au meilleur (100) compagnon de voyage fictif",
	"De la pire (1) à la meilleure (100) grimace",
	"Du plus petit (1) au plus gros (100) moyen de transport",
	"Du pire (1) au meilleur (100) déguisement pour une soirée",
];


// Fonction pour choisir une citation aléatoire et l'afficher avec les styles intégrés
function citationAleatoire() {
	const index = Math.floor(Math.random() * citations.length);
	document.getElementById("citation").innerHTML = citations[index];
}

// Fonction pour générer une couleur pastel aléatoire
function couleurPastelAleatoire() {
	const r = Math.floor(200 + Math.random() * 55); // Valeur entre 200 et 255
	const g = Math.floor(200 + Math.random() * 55); // Valeur entre 200 et 255
	const b = Math.floor(200 + Math.random() * 55); // Valeur entre 200 et 255
	return `rgb(${r}, ${g}, ${b})`;
}

// Fonction pour changer la citation et la couleur de fond
function actualiserCitation() {
	citationAleatoire();
	document.body.style.backgroundColor = couleurPastelAleatoire();
}

// Affiche une citation aléatoire et change la couleur de fond au chargement de la page
window.onload = actualiserCitation;
