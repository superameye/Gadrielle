let g_playerlist = [];
let g_synonymes;
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
	var synonyme = g_synonymes[randIntBetween(0, g_synonymes.length)];
	var firstplayerindex = randIntBetween(0, g_playerlist.length);
	var specialIndexes = nRandIntBetween(g_nbmrwhites + g_nbfalsewords, g_playerlist.length)
	var mrWhiteIndexes = specialIndexes.slice(0, g_nbmrwhites);  //indexes zero to g_nbmrwhites - 1
	var mrFalseWordsIndexes = specialIndexes.slice(g_nbmrwhites);  //indexes g_nbmrwhites to end
	for (let i = 0; i < g_playerlist.length; i++) {
		let playerindex = (firstplayerindex + i) % g_playerlist.length;
		let playername = g_playerlist[playerindex];
		let word;
		if (mrWhiteIndexes.includes(playerindex))
			word = "Démerdes toi bro";
		else if (mrFalseWordsIndexes.includes(playerindex))
			word = synonyme[1];
		else
			word = synonyme[0];
		g_cards[i] = { playername: playername, word: word };
	}
	console.log("Here are the cards : ", g_cards);
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
	revelationcontainer.style.display = "block";
	getnamescontainer.style.display = "none";
	actualnamediv.innerHTML = "premier joueur : " + g_cards[0].playername;
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
	} else {
		revelationcontainer.style.display = "none";
		playcontainer.style.display = "block";
		playerdiv.innerHTML = g_cards[0].playername;
	}
})

getnamescontainer.style.display = "block";
revelationcontainer.style.display = "none";
playcontainer.style.display = "none";

