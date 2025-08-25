function initPlayer() {
	view.setAttribute('data-view', 'player');
	let viewHTML = getPlayerViewHeader();
	viewHTML += `
			${getPlayerHeader()}
			<div id="infos">
				<div id="playerInfos">
					<p><b>Player Position :</b> <span id="ppx"></span><span id="ppy"></span><span id="pri"></span></p>
					<p><b>Cursor Position :</b> <span id="cpx"></span><span id="cpy"></span><span id="cri"></span></p>
				</div>
			</div>
			`;
	view.innerHTML = viewHTML;
};

function getPlayerViewHeader() {
	return `
		<h1>
			Player 
			
		</h1>`;
};

function updatePlayer() {
	updatePlayerPos();
	updateCursorPos();
};

function updatePlayerPos() {
	const x = $.$gamePlayer.x;
	const y = $.$gamePlayer.y;
	const ri = $.$dataMap ? $.$gameMap.regionId(x, y) : 0;
	
	document.getElementById("ppx").innerHTML = "x: " + x;
	document.getElementById("ppy").innerHTML = ", y: " + y;
	document.getElementById("pri").innerHTML = ", region ID: " + ri;
};

function updateCursorPos() {
	if (!$.$dataMap || !$.$dataSystem)
		return;
	
	const x = $.$gameMap.canvasToMapX($.TouchInput.x);
	const y = $.$gameMap.canvasToMapY($.TouchInput.y);
	const ri = $.$gameMap.regionId(x, y);
	
	document.getElementById("cpx").innerHTML = "x: " + x;
	document.getElementById("cpy").innerHTML = ", y: " + y;
	document.getElementById("cri").innerHTML = ", region ID: " + ri;
};