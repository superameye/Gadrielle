
resetbutton.addEventListener('click', function () {
	resetData();
	refreshHome();
	console.log("here is the new data : ");
	console.log(getData());
})

// Add a player
nameinputokbutton.addEventListener('click', function () {
	let playersData = getData();
	if (nameinput.value != "") {
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
	} else {
		alert("Vérivier le formulaire !");
	}
})

// Show the cards ! Set vars and get the various randoms first
startbutton.addEventListener('click', function () {
	let nbundercovers = Number(nbfalsewordsinput.value);
	let nbmrwhites = Number(nbmrwhitesinput.value);
	let mrwhitecanstart = mrwhitecanstartinput.checked;
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
	initcontainer.style.display = "block";
	revelationcontainer.style.display = "none";
	playcontainer.style.display = "none";
	document.body.className = "partyresetbody";
	resetParty();
})

