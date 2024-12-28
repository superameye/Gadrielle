let g_synonymes;
let g_synonyme;
let g_cards = []; //index, playername, word, role, status, score: 0
let g_nbundercovers = 2;
let g_nbmrwhites = 2;
let g_mrwhitecanstart = 0;
let g_actualindex = 0;
let g_nbofplayers = 0;


function randIntBetween(min, max) {
	return (Math.floor(Math.random() * (max - min) + min));
}

function nRandIntBetween(nb, max) {
	console.log("nRandIntBetween is going no generate ", nb, "nb from 0 to ", max);
	var res = [];
	if (nb > max) {
		alert("Mauvais paramétrage !");
		return res;
	}
	while (res.length < nb) {
		var newElem = randIntBetween(0, max);
		if (!(res.includes(newElem)))
			res.push(newElem);
	}
	console.log("result of randIntBetween : ", res);
	return (res);
}

function resetParty() {
	g_actualindex = 0;

	for (let g_card of g_cards) {
		g_card.status = "alive";
		g_card.word = "";
		g_card.role = "";
		// index, name and score are maintained;
	}
	showPlayerList()
}

function generateTable() {
	resetParty();
	console.log("g_nbundercovers = ", g_nbundercovers, "g_nbmrwhites = ", g_nbmrwhites);
	g_synonyme = g_synonymes[randIntBetween(0, g_synonymes.length)];
	var specialIndexes = nRandIntBetween(g_nbmrwhites + g_nbundercovers, g_cards.length)
	var mrWhiteIndexes = specialIndexes.slice(0, g_nbmrwhites);  //indexes zero to g_nbmrwhites - 1
	var mrFalseWordsIndexes = specialIndexes.slice(g_nbmrwhites);  //indexes g_nbmrwhites to end
	for (let g_card of g_cards) {
		if (mrWhiteIndexes.includes(g_card.index)) {
			g_card.word = "Tu es mr white !";
			g_card.role = "mr white";
		}
		else if (mrFalseWordsIndexes.includes(g_card.index)) {
			g_card.word = g_synonyme[1];
			g_card.role = "under cover";
		}
		else {
			g_card.word = g_synonyme[0];
			g_card.role = "civil";
		}
	}
	console.log("Here is the data : ", g_cards);
}

function showPlayerList() {
	playerlist.innerHTML = "";

	while (playerlist.firstChild) {
		playerlist.removeChild(playerlist.firstChild);
	}

	for (let card of g_cards) {
		let newElem = document.createElement("p");
		newElem.innerHTML = card.playername;
		playerlist.appendChild(newElem);
	}
}

function setStartingPlayer() {
	let listOfPotentialFirstPlayers = [];
	for (card of g_cards) {
		if (card.role != "mr white" || g_mrwhitecanstart == 1)
			listOfPotentialFirstPlayers.push(card.index);
	}
	if (listOfPotentialFirstPlayers.length == 0)
		alert("impossible de trouver un permier joueur ! Réduisez le nombre de mr white.")
	let firstToPlayIndex = listOfPotentialFirstPlayers[randIntBetween(0, listOfPotentialFirstPlayers.length - 1)];
	let firstToPlayName = g_cards[firstToPlayIndex].playername;
	playerdiv.innerHTML = firstToPlayName;
}

function removeDeathButtons() {
	while (eliminationcontainer.firstChild) {
		eliminationcontainer.removeChild(eliminationcontainer.firstChild);
	}
}

function createDeathButtons() {
	for (let card of g_cards) {
		if (card.status == "alive") {
			let newbutton = document.createElement("button");
			newbutton.innerHTML = card.playername;
			newbutton.addEventListener('click', function () {
				updateGame(this.innerHTML);  // The button will send his value to update function
			})
			eliminationcontainer.appendChild(newbutton);
		}
	}
}

function addPoints(nb, role) {
	for (let card of g_cards) {
		if (card.role == role)
			card.score += nb;
	}
}

function displayScores() {
	while (resultsdiv.firstChild) {
		resultsdiv.removeChild(resultsdiv.firstChild);
	}
	for (card of g_cards) {
		let newElem = document.createElement("p");
		newElem.innerHTML = card.playername + " était " + card.role + " et il est " + card.status + ". Il a " + card.score + " points.";
		resultsdiv.appendChild(newElem);
	}
}

// Check if there are remaining players, if normal player wins...
// Prompt if an eliminated people was undercover
function updateGame(killedPlayer = "none") {
	let gameEnd = 0;
	infodiv.innerHTML = "";

	if (killedPlayer != "none") { // a player has just been killed
		let killedCard = g_cards.find(card => card.playername == killedPlayer);
		infodiv.innerHTML += killedPlayer + " a été éliminé ! Il était " + killedCard.role + ". ";
		killedCard.status = "dead";

		if (killedCard.role == "mr white") {
			let tentative = prompt("Il s'agit d'un Mr White ! Il a le droit à une tentative !");
			// Le mr white qui trouve le mot gagne la partie
			if (tentative.toLowerCase() == g_synonyme[0].toLowerCase()) {
				infodiv.innerHTML += "Et mr white a trouvé le mot : " + g_synonyme[0] + ". Il gagne 6 points ! ";
				gameEnd = 1;
				killedCard.status = "alive";
				killedCard.score += 6;
			} else {
				infodiv.innerHTML += "Il n'a pas trouvé le mot. ";
			}
		}
	}

	var nbOfUndercover = g_cards.filter(card => card.role == "under cover" && card.status == "alive").length;
	var nbOfMrWhite = g_cards.filter(card => card.role == "mr white" && card.status == "alive").length;
	var nbOfNormal = g_cards.filter(card => card.role == "civil" && card.status == "alive").length;
	var nbOfPlayers = g_cards.filter(card => card.status == "alive").length;

	// Normal rules game ending conditions
	// les civils gagnent si ils ont éliminé tous les undercover et les mr white
	if (gameEnd == 0 && nbOfNormal == 1 && (nbOfMrWhite + nbOfUndercover) == 0) {
		infodiv.innerHTML += "Il n'y a plus aucun undercover ni mr white ! Les civils gagnent 2 points ! "
		gameEnd = 1;
		addPoints(2, "civil");
	}
	// les imposteurs gagnent si il ne reste plus qu'un seul civil et qu'il y a au moins 1 undercover
	if (gameEnd == 0 && (nbOfUndercover >= 1 || nbOfMrWhite >= 1) && nbOfNormal == 1) {
		infodiv.innerHTML += "Il n'y a plus qu'un civil ! Les undercover gagnent 10 points et mr white gagne 6 points ! "
		gameEnd = 1;
		addPoints(10, "under cover");
		addPoints(6, "mr white");
	}

	// Guards for wrong game configuration
	if (gameEnd == 0 && nbOfPlayers == 0) {
		infodiv.innerHTML += "Bizarre : Il n'y a plus de joueur ! ";
		gameEnd = 1;
	}
	if (gameEnd == 0 && nbOfNormal == 0) {
		infodiv.innerHTML += "Bizarre : Il n'y a plus de civil ! Les under cover ont gagné ! ";
		gameEnd = 1;
	}
	if (gameEnd == 0 && nbOfMrWhite == 0 && nbOfUndercover == 0) {
		infodiv.innerHTML += "Bizarre : Il n'y a plus de joueurs spéciaux ! C'est fini ! ";
		gameEnd = 1;
	}

	if (gameEnd == 1) {  // display scores
		displayScores();
		removeDeathButtons();
		document.body.className = "partyoverbody";
	} else {
		removeDeathButtons();
		createDeathButtons();
		infodiv.innerHTML += "Il reste " + nbOfNormal + " normaux, " + nbOfUndercover + " undercover et " + nbOfMrWhite + " mr white. ";
		document.body.className = "partyongoingbody";
	}
}

// Get the names of players
nameinputokbutton.addEventListener('click', function () {
	if (nameinput.value != "") {
		g_cards.push({ index: g_nbofplayers, playername: nameinput.value, word: "", role: "", status: "", score: 0 });
		g_nbofplayers++;
		showPlayerList();
		nameinput.value = "";
	} else {
		alert("Vérivier le formulaire !");
	}
})

// Show the cards ! Set vars and get the various randoms first
startbutton.addEventListener('click', function () {
	g_nbundercovers = Number(nbfalsewordsinput.value);
	g_nbmrwhites = Number(nbmrwhitesinput.value);
	g_mrwhitecanstart = mrwhitecanstartinput.checked;
	generateTable();
	initcontainer.style.display = "none";
	revelationcontainer.style.display = "block";
	playcontainer.style.display = "none";
	actualnamediv.innerHTML = g_cards[0].playername;
	actualworddiv.innerHTML = "clique sur révéler pour révéler";
})

// Reveal the word
revealbutton.addEventListener('click', function () {
	actualworddiv.innerHTML = g_cards[g_actualindex].word;
})

// Show the next card, except is the card show is over !
nextplayerbutton.addEventListener('click', function () {
	if (g_actualindex < g_cards.length - 1) {
		g_actualindex++;
		actualnamediv.innerHTML = "joueur : " + g_cards[g_actualindex].playername;
		actualworddiv.innerHTML = "clique sur révéler pour révéler";
	} else {  // let's play !
		initcontainer.style.display = "none";
		revelationcontainer.style.display = "none";
		playcontainer.style.display = "block";
		setStartingPlayer();
		infodiv.innerHTML = "";
		while (resultsdiv.firstChild) {
			resultsdiv.removeChild(resultsdiv.firstChild);
		}
		updateGame();
	}
})

// Restart
restartbutton.addEventListener('click', function () {
	initcontainer.style.display = "block";
	revelationcontainer.style.display = "none";
	playcontainer.style.display = "none";
	document.body.className = "partyresetbody";
	resetParty();
})

document.body.className = "partyresetbody";
initcontainer.style.display = "block";
revelationcontainer.style.display = "none";
playcontainer.style.display = "none";

