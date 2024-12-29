
function setData(playersData) {
	localStorage.setItem('playersData', JSON.stringify(playersData));
}

function getData() {
	return JSON.parse(localStorage.getItem('playersData'));
}

function setSynonyme(synonyme) {
	localStorage.setItem('synonyme', JSON.stringify(synonyme));
}

function getSynonyme() {
	return JSON.parse(localStorage.getItem('synonyme'));
}

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

function resetData() {
	setData([]);
}

function resetParty() {
	console.log("resetParty");
	let playersData = getData();
	g_actualindex = 0;

	for (playerData of playersData) {
		playerData.status = "vivant";
		playerData.word = "";
		playerData.role = "";
		playerData.isfirst = 0;
		// index, name and score are maintained;
	}
	setData(playersData);
	console.log("playdata after resetParty : ");
	console.log(getData());
	showPlayerList()
}