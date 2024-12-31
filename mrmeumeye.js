let g_synonymes;
let g_actualindex = 0;

function fillPlayersData(nbundercovers = 0, nbmrwhites = 0, mrwhitecanstart = 0) {
	console.log("fillPlayersData");
	// Reset table and get reseted table
	resetParty();
	let playersData = getData();
	console.log("generate table : Here is the input data : ", playersData);
	console.log("g_nbundercovers = ", nbundercovers, "nbmrwhites = ", nbmrwhites);

	// Chose and store a synonyme
	setSynonyme(g_synonymes[randIntBetween(0, g_synonymes.length)]);

	// Give roles
	var specialIndexes = nRandIntBetween(nbmrwhites + nbundercovers, playersData.length)
	var mrWhiteIndexes = specialIndexes.slice(0, nbmrwhites);  //indexes zero to g_nbmrwhites - 1
	var mrFalseWordsIndexes = specialIndexes.slice(nbmrwhites);  //indexes g_nbmrwhites to end
	for (let playerData of playersData) {
		if (mrWhiteIndexes.includes(playerData.index)) {
			playerData.word = "Tu es mr white !";
			playerData.role = "mr white";
		}
		else if (mrFalseWordsIndexes.includes(playerData.index)) {
			playerData.word = getSynonyme()[1];
			playerData.role = "under cover";
		}
		else {
			playerData.word = getSynonyme()[0];
			playerData.role = "civil";
		}
	}

	// Set starting player
	console.log("setStartingPlayer");
	let listOfPotentialFirstPlayers = [];
	for (playerData of playersData) {
		if (playerData.role != "mr white" || mrwhitecanstart == 1)
			listOfPotentialFirstPlayers.push(playerData.index);
	}
	if (listOfPotentialFirstPlayers.length == 0)
		alert("impossible de trouver un permier joueur ! Réduisez le nombre de mr white.")
	let firstToPlayIndex = listOfPotentialFirstPlayers[randIntBetween(0, listOfPotentialFirstPlayers.length - 1)];
	playersData[firstToPlayIndex].isfirst = 1;

	console.log("generate table : Here is the output data : ", playersData);
	setData(playersData);
}

function showPlayerList() {
	console.log("showPlayerList");
	let playersData = getData();
	playerlistdiv.innerHTML = "";

	while (playerlistdiv.firstChild) {
		playerlistdiv.removeChild(playerlistdiv.firstChild);
	}

	for (let playerData of playersData) {
		let newElem = document.createElement("textinbox");
		newElem.innerHTML = playerData.playername + " (" + playerData.score + " points)";
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
	let playersData = getData();
	for (let playerData of playersData) {
		if (playerData.status == "vivant") {
			let newbutton = document.createElement("button");
			newbutton.innerHTML = playerData.playername;
			newbutton.addEventListener('click', function () {
				updateGame(this.innerHTML);  // The button will send his value to update function
			})
			eliminationcontainer.appendChild(newbutton);
		}
	}
}

function addPoints(nb, role) {
	console.log("addPoints");
	let playersData = getData();
	for (let playerData of playersData) {
		if (playerData.role == role)
			playerData.score += nb;
	}
	setData(playersData);
}

function displayScores() {
	console.log("displayScores");
	let playersData = getData();
	while (resultsdiv.firstChild) {
		resultsdiv.removeChild(resultsdiv.firstChild);
	}
	for (playerData of playersData) {
		let newElem = document.createElement("textinbox");
		newElem.innerHTML = playerData.playername + " était " + playerData.role + " et il est " + playerData.status + ". Il a " + playerData.score + " points.";
		resultsdiv.appendChild(newElem);
	}
}

// Check if there are remaining players, if normal player wins...
// Prompt if an eliminated people was undercover
function updateGame(killedPlayer = "none") {
	console.log("updateGame with data");
	let playersData = getData();
	console.log(playersData);
	let gameEnd = 0;
	infodiv.innerHTML = "";

	if (killedPlayer != "none") { // a player has just been killed
		let killedCard = playersData.find(playerData => playerData.playername == killedPlayer);
		infodiv.innerHTML += killedPlayer + " a été éliminé ! Il était " + killedCard.role + ". ";
		killedCard.status = "mort";

		if (killedCard.role == "mr white") {
			let tentative = prompt("Il s'agit d'un Mr White ! Il a le droit à une tentative !");
			// Le mr white qui trouve le mot gagne la partie
			if (tentative.toLowerCase() == getSynonyme()[0].toLowerCase()) {
				infodiv.innerHTML += "Et mr white a trouvé le mot : " + getSynonyme()[0] + ". Il gagne 6 points ! ";
				gameEnd = 1;
				killedCard.status = "vivant";
				killedCard.score += 6;
			} else {
				infodiv.innerHTML += "Il n'a pas trouvé le mot. ";
			}
		}
	}

	setData(playersData);

	var nbOfUndercover = playersData.filter(playerData => playerData.role == "under cover" && playerData.status == "vivant").length;
	var nbOfMrWhite = playersData.filter(playerData => playerData.role == "mr white" && playerData.status == "vivant").length;
	var nbOfCivils = playersData.filter(playerData => playerData.role == "civil" && playerData.status == "vivant").length;
	var nbOfPlayers = playersData.filter(playerData => playerData.status == "vivant").length;

	console.log("nbOfUndercover " + nbOfUndercover + " nbOfMrWhite " + nbOfMrWhite + " nbOfCivils " + nbOfCivils + " nbOfPlayers " + nbOfPlayers);

	// Normal rules game ending conditions
	// les civils gagnent si ils ont éliminé tous les undercover et les mr white
	if (gameEnd == 0 && nbOfCivils >= 1 && (nbOfMrWhite + nbOfUndercover) == 0) {
		infodiv.innerHTML += "Il n'y a plus aucun undercover ni mr white ! Les civils gagnent 2 points ! "
		gameEnd = 1;
		addPoints(2, "civil");
	}
	// les imposteurs gagnent si il ne reste plus qu'un seul civil et qu'il y a au moins 1 undercover
	if (gameEnd == 0 && (nbOfUndercover >= 1 || nbOfMrWhite >= 1) && nbOfCivils == 1) {
		infodiv.innerHTML += "Il n'y a plus qu'un civil ! Les undercover gagnent 10 points et mr white gagne 6 points ! "
		gameEnd = 1;
		addPoints(10, "under cover");
		addPoints(6, "mr white");
	}

	// Guards for wrong game configuration
	if (gameEnd == 0 && nbOfPlayers == nbOfCivils) {
		infodiv.innerHTML += "Bizarre : Il n'y a QUE des civils ! ";
		gameEnd = 1;
	}
	if (gameEnd == 0 && nbOfPlayers == 0) {
		infodiv.innerHTML += "Bizarre : Il n'y a plus de joueur ! ";
		gameEnd = 1;
	}
	if (gameEnd == 0 && nbOfCivils == 0) {
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
		infodiv.innerHTML += "Il reste " + nbOfCivils + " normaux, " + nbOfUndercover + " undercover et " + nbOfMrWhite + " mr white. ";
		document.body.className = "partyongoingbody";
	}
}

function showStartingPlayer() {
	playerdiv.innerHTML = "";
	let playerData = getData();
	for (playerData of playerData) {
		if (playerData.isfirst == 1)
			playerdiv.innerHTML = playerData.playername;
	}
}

function refreshLogo() {
	superlogodiv.innerHTML = g_logo;
	console.log("g_logo");
}

function refreshReveal() {
	let playersData = getData();
	initcontainer.style.display = "none";
	revelationcontainer.style.display = "block";
	playcontainer.style.display = "none";
	g_actualindex = 0;
	actualnamediv.innerHTML = playersData[0].playername;
	actualworddiv.innerHTML = "clique sur révéler pour révéler";
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
	refreshLogo();
	showPlayerList();
	console.log("here is the actual data : ");
	console.log(getData());
	detectOngoingParty();
}

function detectOngoingParty() {
	let playersData = getData();

	console.log("playersData[0].word");
	playongoingdiv.style.display = "none";
	if (playersData.length > 0)
		if (typeof playersData[0].word !== 'undefined')
			playongoingdiv.style.display = "block";
}

refreshHome();
