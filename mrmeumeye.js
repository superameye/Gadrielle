let g_synonymes;
let g_actualindex = 0;

function generateTable(nbundercovers = 0, nbmrwhites = 0, mrwhitecanstart = 0) {
	console.log("generateTable");
	// Reset table and get reseted table
	resetParty();
	let playData = getData();
	console.log("generate table : Here is the input data : ", playData);
	console.log("g_nbundercovers = ", nbundercovers, "nbmrwhites = ", nbmrwhites);

	// Chose and store a synonyme
	setSynonyme(g_synonymes[randIntBetween(0, g_synonymes.length)]);

	// Give roles
	var specialIndexes = nRandIntBetween(nbmrwhites + nbundercovers, playData.length)
	var mrWhiteIndexes = specialIndexes.slice(0, nbmrwhites);  //indexes zero to g_nbmrwhites - 1
	var mrFalseWordsIndexes = specialIndexes.slice(nbmrwhites);  //indexes g_nbmrwhites to end
	for (let card of playData) {
		if (mrWhiteIndexes.includes(card.index)) {
			card.word = "Tu es mr white !";
			card.role = "mr white";
		}
		else if (mrFalseWordsIndexes.includes(card.index)) {
			card.word = getSynonyme()[1];
			card.role = "under cover";
		}
		else {
			card.word = getSynonyme()[0];
			card.role = "civil";
		}
	}

	// Set starting player
	console.log("setStartingPlayer");
	let listOfPotentialFirstPlayers = [];
	for (card of playData) {
		if (card.role != "mr white" || mrwhitecanstart == 1)
			listOfPotentialFirstPlayers.push(card.index);
	}
	if (listOfPotentialFirstPlayers.length == 0)
		alert("impossible de trouver un permier joueur ! Réduisez le nombre de mr white.")
	let firstToPlayIndex = listOfPotentialFirstPlayers[randIntBetween(0, listOfPotentialFirstPlayers.length - 1)];
	playData[firstToPlayIndex].isfirst = 1;

	console.log("generate table : Here is the output data : ", playData);
	setData(playData);
}

function showPlayerList() {
	console.log("showPlayerList");
	let playData = getData();
	playerlistdiv.innerHTML = "";

	while (playerlistdiv.firstChild) {
		playerlistdiv.removeChild(playerlistdiv.firstChild);
	}

	for (let card of playData) {
		let newElem = document.createElement("textinbox");
		newElem.innerHTML = card.playername + " " + card.score + " points";
		playerlistdiv.appendChild(newElem);
	}
}

function removeDeathButtons() {
	console.log("removeDeathButtons");
	while (eliminationcontainer.firstChild) {
		eliminationcontainer.removeChild(eliminationcontainer.firstChild);
	}
}

function createDeathButtons() {
	console.log("createDeathButtons");
	let playData = getData();
	for (let card of playData) {
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
	console.log("addPoints");
	let playData = getData();
	for (let card of playData) {
		if (card.role == role)
			card.score += nb;
	}
	setData(playData);
}

function displayScores() {
	console.log("displayScores");
	let playData = getData();
	while (resultsdiv.firstChild) {
		resultsdiv.removeChild(resultsdiv.firstChild);
	}
	for (card of playData) {
		let newElem = document.createElement("textinbox");
		newElem.innerHTML = card.playername + " était " + card.role + " et il est " + card.status + ". Il a " + card.score + " points.";
		resultsdiv.appendChild(newElem);
	}
}

// Check if there are remaining players, if normal player wins...
// Prompt if an eliminated people was undercover
function updateGame(killedPlayer = "none") {
	console.log("updateGame with data");
	let playData = getData();
	console.log(playData);
	let gameEnd = 0;
	infodiv.innerHTML = "";

	if (killedPlayer != "none") { // a player has just been killed
		let killedCard = playData.find(card => card.playername == killedPlayer);
		infodiv.innerHTML += killedPlayer + " a été éliminé ! Il était " + killedCard.role + ". ";
		killedCard.status = "dead";

		if (killedCard.role == "mr white") {
			let tentative = prompt("Il s'agit d'un Mr White ! Il a le droit à une tentative !");
			// Le mr white qui trouve le mot gagne la partie
			if (tentative.toLowerCase() == getSynonyme()[0].toLowerCase()) {
				infodiv.innerHTML += "Et mr white a trouvé le mot : " + getSynonyme()[0] + ". Il gagne 6 points ! ";
				gameEnd = 1;
				killedCard.status = "alive";
				killedCard.score += 6;
			} else {
				infodiv.innerHTML += "Il n'a pas trouvé le mot. ";
			}
		}
	}

	setData(playData);

	var nbOfUndercover = playData.filter(card => card.role == "under cover" && card.status == "alive").length;
	var nbOfMrWhite = playData.filter(card => card.role == "mr white" && card.status == "alive").length;
	var nbOfNormal = playData.filter(card => card.role == "civil" && card.status == "alive").length;
	var nbOfPlayers = playData.filter(card => card.status == "alive").length;

	console.log("nbOfUndercover " + nbOfUndercover + " nbOfMrWhite " + nbOfMrWhite + " nbOfNormal " + nbOfNormal + " nbOfPlayers " + nbOfPlayers);

	// Normal rules game ending conditions
	// les civils gagnent si ils ont éliminé tous les undercover et les mr white
	if (gameEnd == 0 && nbOfNormal >= 1 && (nbOfMrWhite + nbOfUndercover) == 0) {
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
	if (gameEnd == 0 && nbOfPlayers == nbOfNormal) {
		infodiv.innerHTML += "Bizarre : Il n'y a QUE des civils ! ";
		gameEnd = 1;
	}
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

function refreshReveal() {
	let playData = getData();
	initcontainer.style.display = "none";
	revelationcontainer.style.display = "block";
	playcontainer.style.display = "none";
	g_actualindex = 0;
	actualnamediv.innerHTML = playData[0].playername;
	actualworddiv.innerHTML = "clique sur révéler pour révéler";
}

function showStartingPlayer() {
	playerdiv.innerHTML = "";
	let playerData = getData();
	for (card of playerData) {
		if (card.isfirst == 1)
			playerdiv.innerHTML = card.playername;
	}
}

function refreshGame() {
	initcontainer.style.display = "none";
	revelationcontainer.style.display = "none";
	playcontainer.style.display = "block";
	showStartingPlayer();
	infodiv.innerHTML = "";
	while (resultsdiv.firstChild) {
		resultsdiv.removeChild(resultsdiv.firstChild);
	}
	console.log("stored data : " + getData());
	console.log("here is the actual synonnyme : ");
	console.log(getSynonyme());
	updateGame();
}

function refreshHome() {
	document.body.className = "partyresetbody";
	initcontainer.style.display = "block";
	revelationcontainer.style.display = "none";
	playcontainer.style.display = "none";
	showPlayerList();
	console.log("here is the actual data : ");
	console.log(getData());
}

function detectOngoingParty() {
	let playData = getData();

	if (playData[0].word != "")
		alert("Il semble qu'il y ait une partie en cours !");
}

refreshHome();
detectOngoingParty();
