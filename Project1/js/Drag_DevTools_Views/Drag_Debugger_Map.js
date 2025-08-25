function initMap() {
	view.setAttribute('data-view', 'map');
	let viewHTML = getMapViewHeader();
	const mapAvailable = isMapAvailable();
	viewHTML += `
		<div data-mapID="${$.$gameMap.mapId()}" id="content">
			${getMapHeader()}
			<h3 class="textCenter">Map Tools :</h3>
			<div id="mapTools" class="textCenter">
				<button id="buttonGrid" data-grid="${$.Drag.Debugger.grid !== null ? 'true' : 'false'}" onclick="toggleGrid(); updateMap();" ${isMapAvailable() ? '' : 'disabled'}></button>
				<button id="buttonCollisions" data-collisions="${$.Drag.Debugger.collisions !== null ? 'true' : 'false'}" onclick="toggleCollisions(); updateMap();" ${isMapAvailable() ? '' : 'disabled'}></button>
				<button id="buttonRegionsId" data-regionsId="${$.Drag.Debugger.regionsId !== null ? 'true' : 'false'}" onclick="toggleRegionIds(); updateMap();" ${isMapAvailable() ? '' : 'disabled'}></button>
			</div>
			<h3 class="textCenter">Minimap Tools :</h3>
			<div id="mapTools" class="textCenter">
				<button id="buttonMinimapZoomIn" onclick="zoomInMinimap(this);" ${isMapAvailable() ? '' : 'disabled'}>Zoom In</button>
				<button id="buttonMinimapZoomOut" onclick="zoomOutMinimap(this);" ${isMapAvailable() ? '' : 'disabled'}>Zoom Out</button>
				<button id="buttonMinimapCollision" data-collisions="false" onclick="toggleMinimapCollisions(this);" ${isMapAvailable() ? '' : 'disabled'}></button>
				<button id="buttonMinimapRegionsId" data-regionsId="false" onclick="toggleMinimapRegionIds(this);" ${isMapAvailable() ? '' : 'disabled'}></button>
			</div>
			<h3 class="textCenter">Minimap :</h3>
			<div id="minimapContainer" data-isMapAvailable="${mapAvailable}">
				${mapAvailable ? getMinimap() : 'No map detected.'}
			</div>
			<div id="tileSelectedData" class="hidden mBottom2"></div>
		</div>`;
	view.innerHTML = viewHTML;
};

function getMapViewHeader() {
	return `
		<h1>
			Map 
			
		</h1>`;
};

function getMinimap() {
	let minimap = "";
	const mapWidth = $.$gameMap.width();
	const mapHeight = $.$gameMap.height();
	for (let x = 0; x < mapWidth; x++) {
		for (let y = 0; y < mapHeight; y++) {
			const hasEvent = $.$gameMap.eventsXy(x, y).map(obj => obj.eventId()).toString() || 0; 
			const hasEventId = $.$gameMap.eventIdXy(x, y);
			const hasPlayer = $.$gamePlayer.x === x && $.$gamePlayer.y === y;
			const bottomPassable = $.Drag.Debugger.isPassable(x, y, 2);
			const leftPassable = $.Drag.Debugger.isPassable(x, y, 4);
			const rightPassable = $.Drag.Debugger.isPassable(x, y, 6);
			const topPassable = $.Drag.Debugger.isPassable(x, y, 8);
			const regionId = $.$gameMap.regionId(x, y);
			minimap += `
				<div class="minimapTile" onmouseover="showMinimapData(this);" onmouseout="hideMinimapData();" onclick="selectMiniMapTile(this);"
					data-bPassable="${bottomPassable}" data-lPassable="${leftPassable}" data-rPassable="${rightPassable}" data-tPassable="${topPassable}"
					data-regionId="${regionId}"
					data-x="${x}" data-y="${y}" data-hasPlayer="${hasPlayer}" data-hasEvent="${hasEvent}" data-selected="false"
					style="--x: ${x}; --y: ${y}; --regionId-background-color: ${regionId > 0 ? $.Drag.Debugger.regionsIdsColours[regionId % $.Drag.Debugger.regionsIdsColours.length] : 'var(--color)'}">
				</div>`;
		}
	}
	return `
		<div id="minimap" style="--map-width: ${mapWidth}; --map-height: ${mapHeight};">
			<span id="minimapData"></span>
			${minimap}
		</div>
	`;
};

function updateMap() {				
	const mapAvailable = isMapAvailable();
	for (toolButton of view.querySelectorAll("#mapTools button")) {
		toolButton.disabled = !mapAvailable;
		if (toolButton.id === "buttonGrid") {
			let currentDataGrid = toolButton.getAttribute('data-grid') === "true";
			let dataGrid = $.Drag.Debugger.grid !== null;
			if (dataGrid !== currentDataGrid)
				toolButton.setAttribute('data-grid', dataGrid);
		}
		
		if (toolButton.id === "buttonCollisions") {
			let currentDataCollisions = toolButton.getAttribute('data-collisions') === "true";
			let dataCollisions = $.Drag.Debugger.collisions !== null;
			if (dataCollisions !== currentDataCollisions)
				toolButton.setAttribute('data-collisions', dataCollisions);
		}
		
		if (toolButton.id === "buttonRegionsId") {
			let currentDataRegionsId = toolButton.getAttribute('data-regionsId') === "true";
			let dataRegionsId = $.Drag.Debugger.regionsId !== null;
			if (dataRegionsId !== currentDataRegionsId)
				toolButton.setAttribute('data-regionsId', dataRegionsId);
		}
	}
	
	let minimapContainer = view.querySelector("#minimapContainer");
	let currentMapAvailable = minimapContainer.getAttribute('data-isMapAvailable') === 'true';
	if (currentMapAvailable !== mapAvailable) {
		minimapContainer.setAttribute('data-isMapAvailable', mapAvailable);
		if (mapAvailable)
			minimapContainer.innerHTML = getMinimap();
		else 
			`No map detected.`;
	}
	if (mapAvailable)
		updateMinimap();
	
	let tileSelectedData = view.querySelector('#tileSelectedData:not(.hidden)');
	if (tileSelectedData) {
		let eEvents = document.querySelectorAll('#content .evData');
		if (!(eEvents.length > 0))
			return;
		for (eEvent of eEvents)
			updateEvent(eEvent);
	}
};

function updateMinimap() {
	let minimap = view.querySelector('#minimap');
	
	for (ev of $.$gameMap.events()) {
		let currentEvTile = minimap.querySelector(`.minimapTile[data-x="${ev.x}"][data-y="${ev.y}"]`);
		if (!currentEvTile)
			continue;
		const currentHasEvent = currentEvTile.getAttribute('data-hasEvent').split(",").map(obj => Number(obj));
		if (!currentHasEvent.includes(ev.eventId())) {
			for (minimapTile of minimap.querySelectorAll(`.minimapTile[data-hasEvent]:not([data-hasEvent="0"])`)) {
				let minimapTileHasEvent = minimapTile.getAttribute('data-hasEvent').split(",").map(obj => Number(obj));
				if (minimapTileHasEvent.includes(ev.eventId())) {
					minimapTileHasEvent.splice(minimapTileHasEvent.indexOf(ev.eventId()), 1);
					if (minimapTileHasEvent.length === 0)
						minimapTileHasEvent = [0];
					minimapTile.setAttribute('data-hasEvent', minimapTileHasEvent.toString());
				}
			}
			const hasEvent = $.$gameMap.eventsXy(ev.x, ev.y).map(obj => obj.eventId()).toString() || 0; 
			currentEvTile.setAttribute('data-hasEvent', hasEvent);
		}
	}
	
	let currentPlayerTile = minimap.querySelector(`.minimapTile[data-hasPlayer="true"]`);
	if (!currentPlayerTile)
		return;
	let playerHasMoved = ($.$gamePlayer.x !== parseInt(currentPlayerTile.getAttribute('data-x'))) || ($.$gamePlayer.y !== parseInt(currentPlayerTile.getAttribute('data-y')));
	if (playerHasMoved) {
		currentPlayerTile.setAttribute('data-hasPlayer', "false");
		let newPlayerTile = minimap.querySelector(`.minimapTile[data-x="${$.$gamePlayer.x}"][data-y="${$.$gamePlayer.y}"]`);
		newPlayerTile.setAttribute('data-hasPlayer', "true");
	}
	
	if (!minimap.classList.contains('collisionEnabled') && !minimap.classList.contains('regionIdEnabled'))
		return;
	for (minimapTile of minimap.querySelectorAll('.minimapTile')) {
		const x = parseInt(minimapTile.getAttribute('data-x'));
		const y = parseInt(minimapTile.getAttribute('data-y'));
		
		if (minimap.classList.contains('collisionEnabled')) {
			const bottomPassable = $.Drag.Debugger.isPassable(x, y, 2);
			const leftPassable = $.Drag.Debugger.isPassable(x, y, 4);
			const rightPassable = $.Drag.Debugger.isPassable(x, y, 6);
			const topPassable = $.Drag.Debugger.isPassable(x, y, 8);
			
			if (bottomPassable !== (minimapTile.getAttribute('data-bPassable') === true))
				minimapTile.setAttribute('data-bPassable', bottomPassable);
			if (leftPassable !== (minimapTile.getAttribute('data-lPassable') === true))
				minimapTile.setAttribute('data-lPassable', leftPassable);
			if (rightPassable !== (minimapTile.getAttribute('data-rPassable') === true))
				minimapTile.setAttribute('data-rPassable', rightPassable);
			if (topPassable !== (minimapTile.getAttribute('data-tPassable') === true))
				minimapTile.setAttribute('data-tPassable', topPassable);
		}
		
		if (minimap.classList.contains('regionIdEnabled')) {
			const regionId = $.$gameMap.regionId(x, y);
			if (regionId !== parseInt(minimapTile.getAttribute('data-regionId')))
				minimapTile.setAttribute('data-regionId', regionId);
		}
	}
};

function selectMiniMapTile(minimapTile) {
	let minimap = view.querySelector('#minimap');
	let currentSelectedMinimapTile = minimap.querySelector('.minimapTile[data-selected="true"]');
	if (currentSelectedMinimapTile)
		currentSelectedMinimapTile.setAttribute('data-selected', false);
	minimapTile.setAttribute('data-selected', true);
	
	let tileSelectedData = view.querySelector('#tileSelectedData');
	tileSelectedData.classList.remove("hidden");
	const xMinimapTile = parseInt(minimapTile.getAttribute('data-x')); 
	const yMinimapTile = parseInt(minimapTile.getAttribute('data-y'));
	let tileSelectedDataHTML = `<h3 class='textCenter'>Data Minimap Selected Tile :</h3>`;
	
	const bottomPassable = $.Drag.Debugger.isPassable(xMinimapTile, yMinimapTile, 2);
	const leftPassable = $.Drag.Debugger.isPassable(xMinimapTile, yMinimapTile, 4);
	const rightPassable = $.Drag.Debugger.isPassable(xMinimapTile, yMinimapTile, 6);
	const topPassable = $.Drag.Debugger.isPassable(xMinimapTile, yMinimapTile, 8);
	const regionId = $.$gameMap.regionId(xMinimapTile, yMinimapTile);
	tileSelectedDataHTML += `
		<div class="textCenter fRight w30P">
			<span>
				<b>Position : </b>
			</span>
			<br>
			<span class="fSize20 xy">[x: ${xMinimapTile}, y: ${yMinimapTile}]</span>
			<br>
			<button class="bTpEvent button mTop1" data-xy="${xMinimapTile},${yMinimapTile}" onclick="teleportPlayerTo(this); refreshView();">Teleport To</button>
		</div>
		<div class="tileData fRight" 
			data-bPassable="${bottomPassable}" data-lPassable="${leftPassable}" data-rPassable="${rightPassable}" data-tPassable="${topPassable}"
			data-regionId="${regionId}" style="background-color: ${regionId > 0 ? $.Drag.Debugger.regionsIdsColours[regionId % $.Drag.Debugger.regionsIdsColours.length] : 'transparent'}">
		</div>
		<div class="clearfix"></div>
		`;
	
	let minimapTileHasEvent = minimapTile.getAttribute('data-hasEvent').split(",").map(obj => Number(obj));
	for (eventId of minimapTileHasEvent) {
		if (eventId === 0)
			continue;
		let event = $.$gameMap.event(eventId);
		let eventName = event.event().name;
		let activePage = $.Drag.Debugger.getActivePage(eventId);
		tileSelectedDataHTML += `
			<div data-eventId="${eventId}" class="evData">
				<div class="grid2row">
					${getEventHeader(eventId, eventName)}
					<div>
						${getEventGeneralInfos($.$gameMap.event(eventId), true, true)}
		`;
		let status = [];
		if ($.Drag.Debugger.getPagesByTrigger(3, event).length > 0)
			status = $.Drag.Debugger.checkAutorunEvent(event);
		for (let i = 0; i <  $.$gameMap.event(eventId).event().pages.length; i++)
			tileSelectedDataHTML += `
						<div data-pageId="${i}" class="evPages evPage${i}">
							${getEventElemPageHeader(i, event)}
							<div class="transitionAll025 ${(i === activePage ) ? '' : 'uncollapsed'}">
								${getEventElemOptions(i, event)}
								${getEventElemConditions(i, $.$gameMap.mapId(), event)}
							</div>
							${(status.length > 0 && status[1] === i)? 
							'<div data-warnCode="' + status[0] + '" data-warnPageId="' + status[1] + '" class="warnAutorun">' + getAutorunEventHelp(status) + '</div>'
							: 
							''}
						</div>`;
		tileSelectedDataHTML += `
					</div>
				</div>
			</div>
		`;
	}
	tileSelectedData.innerHTML = tileSelectedDataHTML;
};

function showMinimapData(minimapTile) {
	let minimap = view.querySelector('#minimap');
	let minimapData = minimap.querySelector("#minimapData");
	const xMinimapTile = parseInt(minimapTile.getAttribute('data-x'));
	const yMinimapTile = parseInt(minimapTile.getAttribute('data-y'));
	const hasEventMinimapTile = minimapTile.getAttribute('data-hasEvent');
	minimapData.innerHTML = `[x: ${xMinimapTile}, y: ${yMinimapTile}]<br>Events : ${hasEventMinimapTile}`;
	minimapData.style.visibility = "visible";
	minimapData.style.opacity = 255;
	let left = minimapTile.offsetLeft + 20;
	let top = minimapTile.offsetTop + 20;
	if (left + minimapData.offsetWidth > minimap.offsetWidth)
		left = left - minimapData.offsetWidth - 20;
	if (top + minimapData.offsetHeight > minimap.offsetHeight)
		top = top - minimapData.offsetHeight - 20;
	minimapData.style.left = left + "px";
	minimapData.style.top = top + "px";
};

function hideMinimapData() {
	let minimap = view.querySelector('#minimap');
	let minimapData = minimap.querySelector("#minimapData");
	minimapData.style.visibility = "hidden";
	minimapData.style.opacity = 0;
};

function toggleGrid() {
	$.Drag.Debugger.toggleGrid();
};

function toggleCollisions() {
	$.Drag.Debugger.toggleCollisions();
};

function toggleMinimapCollisions(button) {
	view.querySelector('#minimap').classList.toggle('collisionEnabled');
	button.setAttribute('data-collisions', !(button.getAttribute('data-collisions') === "true"));
};

function toggleRegionIds() {
	$.Drag.Debugger.toggleRegionIds();
};

function toggleMinimapRegionIds(button) {
	view.querySelector('#minimap').classList.toggle('regionIdEnabled');
	button.setAttribute('data-regionsId', !(button.getAttribute('data-regionsId') === "true"));
};

function isMapAvailable() {
	return String($.SceneManager.getCurrentScene().constructor.name) === "Scene_Map" && $.$gameMap && $.$gameMap.mapId() > 0 && $.$dataMap && $.$dataMap.mapId > 0;
};

function zoomInMinimap(button) {
	let minimap = view.querySelector('#minimap');
	let minimapTileSize = parseInt(window.getComputedStyle(minimap).getPropertyValue('--minimap-tile-size'));  
	if (minimapTileSize < 30) {
		minimapTileSize++;
		minimap.style.setProperty('--minimap-tile-size', minimapTileSize + 'px');
	}
};

function zoomOutMinimap(button) {
	let minimap = view.querySelector('#minimap');
	let minimapTileSize = parseInt(window.getComputedStyle(minimap).getPropertyValue('--minimap-tile-size'));  
	if (minimapTileSize > 10) {
		minimapTileSize--;
		minimap.style.setProperty('--minimap-tile-size', minimapTileSize + 'px');
	}
};