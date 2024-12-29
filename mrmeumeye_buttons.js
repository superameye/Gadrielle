
resetbutton.addEventListener('click', function () {
	resetData();
	refreshHome();
	console.log("here is the new data : ");
	console.log(getData());
})

// Add a player
nameinputokbutton.addEventListener('click', function () {
	let playData = getData();
	if (nameinput.value != "") {
		let newPlayerIndex;
		if (playData.length == 0) {
			newPlayerIndex = 0;
		} else {
			newPlayerIndex = playData[playData.length - 1].index + 1;
		}
		playData.push({ index: newPlayerIndex, playername: nameinput.value, score: 0 });
		setData(playData);
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
	generateTable(nbundercovers, nbmrwhites, mrwhitecanstart);
	refreshReveal();
})

// Reveal the word
revealbutton.addEventListener('click', function () {
	let playData = getData();
	actualworddiv.innerHTML = playData[g_actualindex].word;
})

// Show the next card, except is the card show is over !
nextplayerbutton.addEventListener('click', function () {
	let playData = getData();
	if (g_actualindex < playData.length - 1) {
		g_actualindex++;
		actualnamediv.innerHTML = "joueur : " + playData[g_actualindex].playername;
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

