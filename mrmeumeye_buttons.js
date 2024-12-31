
resetbutton.addEventListener('click', function () {
	resetData();
	refreshHome();
	console.log("here is the new data : ");
	console.log(getData());
})

// Add a player
nameinputokbutton.addEventListener('click', function () {
	let playersData = getData();
	if (nameinput.value == "") {
		alert("Vérivier le formulaire !");
	} else {
		let newPlayerIndex;
		if (playersData.length == 0) {
			newPlayerIndex = 0;
		} else {
			newPlayerIndex = playersData[playersData.length - 1].index + 1;
		}
		playersData.push({ index: newPlayerIndex, playername: nameinput.value, score: 0 });
		setData(playersData);
		showPlayerList();
		nameinput.value = "";
	}
})

// Show the cards ! Set vars and get the various randoms first
startbutton.addEventListener('click', function () {
	let nbundercovers = Number(nbfalsewordsinput.value);
	let nbmrwhites = Number(nbmrwhitesinput.value);
	let mrwhitecanstart = mrwhitecanstartinput.checked;
	let nbjoueurs = getData().length;
	if (nbjoueurs < 4) {
		alert("Il doit y avoir au moins 4 joueurs, lis la règle enculé");
		return;
	}
	if (nbjoueurs - nbmrwhites - nbundercovers < 2) {
		alert("Il doit y avoir au moins 2 civils, lis la règle enculé");
		return;
	}
	if (nbmrwhites + nbundercovers < 1) {
		alert("Il doit y avoir au moins 1 undercover ou mr white, t'es con ou t'en fais exprès ??");
		return;
	}
	fillPlayersData(nbundercovers, nbmrwhites, mrwhitecanstart);
	refreshReveal();
})

// Reveal the word
revealbutton.addEventListener('click', function () {
	let playersData = getData();
	actualworddiv.innerHTML = playersData[g_actualindex].word;
})

// Show the next playerData, except is the playerData show is over !
nextplayerbutton.addEventListener('click', function () {
	let playersData = getData();
	if (g_actualindex < playersData.length - 1) {
		g_actualindex++;
		actualnamediv.innerHTML = "joueur : " + playersData[g_actualindex].playername;
		actualworddiv.innerHTML = "clique sur révéler pour révéler";
	} else {  // let's play !
		refreshGame();
	}
})

recoverbutton.addEventListener('click', function () {
	refreshReveal();
})

// Restart
restartbutton.addEventListener('click', function () {
	refreshHome();
})
