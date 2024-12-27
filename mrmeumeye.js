let g_playerlist = [];
let g_synonymes;
let g_synonyme;
let g_cards = [];
let g_nbfalsewords = 2;
let g_nbmrwhites = 2;
let g_actualindex = 0;


function randIntBetween(min, max) {
	return (Math.floor(Math.random() * (max - min) + min));
}

function nRandIntBetween(nb, max) {
	console.log("nRandIntBetween is going no generate ", nb, "nb from 0 to ", max);
	var res = [];
	if (nb > max) {
		alert("You are trying to generate ", nb, " differents ints in a range from 0 to ", max, " !");
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

function generateTable() {
	console.log("g_nbfalsewords = ", g_nbfalsewords, "g_nbmrwhites = ", g_nbmrwhites);
	g_synonyme = g_synonymes[randIntBetween(0, g_synonymes.length)];
	var firstplayerindex = randIntBetween(0, g_playerlist.length);
	var specialIndexes = nRandIntBetween(g_nbmrwhites + g_nbfalsewords, g_playerlist.length)
	var mrWhiteIndexes = specialIndexes.slice(0, g_nbmrwhites);  //indexes zero to g_nbmrwhites - 1
	var mrFalseWordsIndexes = specialIndexes.slice(g_nbmrwhites);  //indexes g_nbmrwhites to end
	for (let i = 0; i < g_playerlist.length; i++) {
		let playerindex = (firstplayerindex + i) % g_playerlist.length;
		let playername = g_playerlist[playerindex];
		let word, role;
		if (mrWhiteIndexes.includes(playerindex)) {
			word = "Démerdes toi bro";
			role = "mr white";
		}
		else if (mrFalseWordsIndexes.includes(playerindex)) {
			word = g_synonyme[1];
			role = "under cover";
		}
		else {
			word = g_synonyme[0];
			role = "joueur normal";
		}
		g_cards[i] = { playername: playername, word: word, role: role, status: "alive" };
	}
	console.log("Here are the cards : ", g_cards);
}

function createDeathButtons() {
	while (eliminationcontainer.firstChild) {
		eliminationcontainer.removeChild(eliminationcontainer.firstChild);
	}

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

// Check if there are remaining players, if normal player wins...
// Prompt if an eliminated people was undercover
function updateGame(killedPlayer = "none") {
	let gameEnd = 0;

	if (killedPlayer != "none") { // a player has just been killed
		let killedCard = g_cards.find(card => card.playername == killedPlayer);
		infodiv.innerHTML = killedPlayer + " a été éliminé ! Il était " + killedCard.role;
		killedCard.status = "dead";
		if (killedCard.role == "mr white") {
			initcontainer.style.display = "none";
			revelationcontainer.style.display = "none";
			playcontainer.style.display = "none";
			tentativecontainer.style.display = "block";
			tentativeplayerdiv.innerHTML = killedPlayer;
			tentativeokbutton.addEventListener('click', function () {
				if (tentativeinput.value.toLowerCase() == g_synonyme[0].toLowerCase()) {
					infodiv.innerHTML += " Et c'est gagné pour mr white !";
					initcontainer.style.display = "none";
					revelationcontainer.style.display = "none";
					playcontainer.style.display = "block";
					tentativecontainer.style.display = "none";
				} else {
					infodiv.innerHTML += " Et c'est perdu pour mr white !";
					initcontainer.style.display = "none";
					revelationcontainer.style.display = "none";
					playcontainer.style.display = "block";
					tentativecontainer.style.display = "none";
				}
			})
		}
	}

	var nbOfUndercover = g_cards.filter(card => card.role == "under cover" && card.status == "alive").length;
	var nbOfMrWhite = g_cards.filter(card => card.role == "mr white" && card.status == "alive").length;
	var nbOfNormal = g_cards.filter(card => card.role == "joueur normal" && card.status == "alive").length;
	var nbOfPlayers = g_cards.filter(card => card.status == "alive").length;

	if (nbOfPlayers == 0) {
		infodiv.innerHTML = "Il n'y a plus de joueur !";
		gameEnd = 1;
	}
	if (nbOfNormal == 0) {
		infodiv.innerHTML = "Il n'y a plus de joueur normal ! Les under cover ont gagné !";
		gameEnd = 1;
	}
	if (nbOfPlayers <= 2) {
		infodiv.innerHTML = "Il n'y a plus que 2 joueurs ! C'est les spéciaux qui gagnent !";
		gameEnd = 1;
	}
	if (nbOfMrWhite == 0 && nbOfUndercover == 0) {
		infodiv.innerHTML = "Il n'y a plus de joueurs spéciaux ! C'est fini !";
		gameEnd = 1;
	}
	if (gameEnd == 1) {  // display scores
		while (resultsdiv.firstChild) {
			resultsdiv.removeChild(resultsdiv.firstChild);
		}
		for (card of g_cards) {
			let newElem = document.createElement("p");
			newElem.innerHTML = card.playername + " était " + card.role + " et il est " + card.status;
			resultsdiv.appendChild(newElem);
		}
	}
	createDeathButtons();

}

// Get the names of players
nameinputokbutton.addEventListener('click', function () {
	if (nameinput.value != "" && !(g_playerlist.includes(nameinput.value))) {
		g_playerlist.push(nameinput.value);
		playerlist.innerHTML = g_playerlist;
		nameinput.value = "";
	} else {
		alert("Vérivier l'input");
	}
})

// Show the cards ! Set vars and get the various randoms first
startbutton.addEventListener('click', function () {
	g_nbfalsewords = Number(nbfalsewordsinput.value);
	g_nbmrwhites = Number(nbmrwhitesinput.value);
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
	if (g_actualindex < g_playerlist.length - 1) {
		g_actualindex++;
		actualnamediv.innerHTML = "joueur : " + g_cards[g_actualindex].playername;
		actualworddiv.innerHTML = "clique sur révéler pour révéler";
	} else {  // let's play !
		initcontainer.style.display = "none";
		revelationcontainer.style.display = "none";
		playcontainer.style.display = "block";
		tentativecontainer.style.display = "none";
		playerdiv.innerHTML = g_cards[0].playername;
		infodiv.innerHTML = "";
		while (resultsdiv.firstChild) {
			resultsdiv.removeChild(resultsdiv.firstChild);
		}
		updateGame();
	}
})

// Restart
restartbutton.addEventListener('click', function () {
	g_actualindex = 0;
	initcontainer.style.display = "block";
	revelationcontainer.style.display = "none";
	playcontainer.style.display = "none";
	tentativecontainer.style.display = "none";
})

initcontainer.style.display = "block";
revelationcontainer.style.display = "none";
playcontainer.style.display = "none";
tentativecontainer.style.display = "none";

