//---------------------------------------------------------------------------------
// Self Switches View

function initSelfSwitches(keepFilteringInputValues = false) {
	view.setAttribute('data-view', 'selfswitches');
	let mapId = $.$gameMap.mapId();
	if (keepFilteringInputValues)
		var currentFilteringInputValues = getResultFilterValues();
	let viewHTML = getSelfSwitchViewHeader() + getFilteringInputs() + getMapHeader(mapId);
	viewHTML += `
		<div data-mapID="${mapId}" id="content">
			<ul>`;
	let letters = ["A", "B", "C", "D"]
	if ($.$gameMap.events().length < 1) 
		viewHTML += "<p><b>No event was detected.</b></p>";
	else 
		viewHTML += `<p><b>${$.$gameMap.events().length} event(s) detected :</b>`;
	for (event of $.$gameMap.events()) {
		let eventId = event._eventId;
		let eventName = $.$gameMap.event(eventId).event().name;
		viewHTML += `
				<li data-eventId="${eventId}" class="evData marginB05EM" id="event${eventId}">
					<div class="grid2row">
						${getEventHeader(eventId, eventName)}
						<span class="textRight mBottom05">
							${getEventsHyperlink(eventId)}
							${getInterpreterHyperlink(eventId)}	
						</span>
						<div class="grid4">`;
		for (letter of letters) {
			let selfSwitchIndex = `${mapId},${eventId},${letter}`;
			let switchValue = $.$gameSelfSwitches.value(selfSwitchIndex);
			let color = switchValue === true ? "bgGreen" : "bgRed";
			switchValue = switchValue === true ? "checked" : "";
			viewHTML += getSelfSwitchElem(selfSwitchIndex, letter, switchValue, color);
		}
		viewHTML += `
						</div>
					</div>
				</li>`;
	}
	viewHTML += `
			</ul>
		</div>`;
	view.innerHTML = viewHTML;
	if (keepFilteringInputValues)
		setInputValues(currentFilteringInputValues);
};

function getSelfSwitchViewHeader() {
	return `
		<h1>Self Switches <span onmouseenter="showTooltip()" onmouseleave="hideTooltip()" class="showInfoTooltip">&#x2139;</span></h1>
		<div class="info invisible">
			<p><span style="color: steelblue; font-size: 18px; font-weight: bold">Self Switches</span> are <b>boolean value (on:true</b> or <b>off:false)</b> that can be toggled at any time using the <i>Control Self Switches</i> event command.</p>
			<p>Contrary to <span style="color: steelblue; font-size: 18px; font-weight: bold">Game Switches</span>, <span style="color: steelblue; font-size: 18px; font-weight: bold">Self Switches</span> are linked to their respective events.
			<p>You can manipulate up to four self switch by event and are defined by a letter (A, B, C, D).
			<p>You can also use a <i>script call</i> to access them :</p>
			<p>- <b>$.$gameSelfSwitches.value("mId,evId,sLetter")</b> to get the value of a specific self switch, where <i>mId is the map ID the event belong to</i>, <i>evId is the event ID your switch belong to</i>, <i>sLetter is the self switch letter</i>.</p>
			<p> <i>e.g.</i> <b>$.$gameSelfSwitches.value("1,1,A")</b>
			<p>- <b>$.$gameSelfSwitches.set("mId,evId,sLetter", value)</b> to set a specific self switch to on or off, where <i>value is either true or false</i>.</p>
			<p> <i>e.g.</i> <b>$.$gameSelfSwitches.set("1,1,A", true)</b>
		</div>
	`;
};

function getFilteringInputs() {
	return `
		<div id="resultFilter">
			<form id="form-slider" onchange="saveConfig()">
				<button type="submit" disabled style="display: none" aria-hidden="true"></button>
				<div>
					<span id="slider-title">Show ON / OFF</span>
					<div id="slider">
						<input data-default="false" onclick="updateSliderPos(this); updateSelfSwitches();" type="radio" name="slider-option" id="showONOnly" value="1" required>
						<label for="showONOnly" data-slider-option="Has Switch ON"></label>
						<input data-default="true" onclick="updateSliderPos(this); updateSelfSwitches();" type="radio" name="slider-option" id="noFilterState" value="2" required checked>
						<label for="noFilterState" data-slider-option="No Filter"></label>
						<input data-default="false" onclick="updateSliderPos(this); updateSelfSwitches();" type="radio" name="slider-option" id="showOFFOnly" value="3" required>
						<label for="showOFFOnly" data-slider-option="Has Switch OFF"></label>
						<div id="slider-pos"></div>
					</div>
				</div>
			</form>
			<form onchange="saveConfig()">
				<button type="submit" disabled style="display: none" aria-hidden="true"></button>
				<label class="form-control-filter">
					<span>Filter</span>
					<input data-default="" onchange="updateSelfSwitches()" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
						type="text" placeholder="Enter event ID or name" id="filterSelfSwitches" name="filterSelfSwitches"
					>
				</label>
			</form>
		</div>
		<div class="textRight">
			<span class="hyperlink" onclick="resetFilters()">Reset filters</span>
		</div>
	`;
};

function getCurrentFilteringInputs() {
	return document.querySelector('#resultFilter').outerHTML;
};

function getSelfSwitchElem(selfSwitchIndex, letter, switchValue, color) {
	return `
		<span data-self-switches="${selfSwitchIndex}" onclick="toggleSelfSwitch('${selfSwitchIndex}')" class="selfSwitch ${switchValue ? 'selfSwitchOn' : 'selfSwitchOff'}"> 
			<span class="switchHeader block marginB5">
				<span class="square marginAuto block w15 bgWhite">${letter}</span>
			</span>
			<input class="toggle val block marginAuto" type="checkbox" ${switchValue}/>
		</span>`;
};

function updateSelfSwitches() {	
	const mapAvailable = isMapAvailable();
	if (!mapAvailable) 
		return;
	let currentMapId = parseInt(document.getElementById("content").getAttribute("data-mapID"));
	let mapId = $.$gameMap.mapId();
	if (currentMapId !== mapId) {
		if ($.$dataMap.mapId !== currentMapId)
			initSelfSwitches(true);
	} else {
		let eEvents = document.querySelectorAll('#content .evData');
		if (!(eEvents.length > 0))
			return;
		let showONOnly = document.getElementById('showONOnly').checked;
		let showOFFOnly = document.getElementById('showOFFOnly').checked;
		let filterSelfSwitches = document.getElementById("filterSelfSwitches").value.toLowerCase();
		for (eEvent of eEvents) {
			let eSwitchs = eEvent.querySelectorAll('.selfSwitch');
			if (!(eSwitchs.length > 0))
				return;
			let eventId = parseInt(eEvent.getAttribute('data-eventId'));
			let gameEvent = $.$gameMap.event(eventId);
			let dataEvent = gameEvent.event();
			if (!gameEvent || !dataEvent)
				return;
			let eventName = dataEvent.name;
			let hasSwitchOn = false;
			let hasSwitchOFF = false;
			for (eSwitch of eSwitchs) {
				let selfSwitchIndex = eSwitch.getAttribute("data-self-switches");
				let switchValue = $.$gameSelfSwitches.value(selfSwitchIndex);
				if (switchValue) {
					eSwitch.classList.remove("selfSwitchOff");
					eSwitch.classList.add("selfSwitchOn");
					hasSwitchOn = true;
				} else {
					eSwitch.classList.remove("selfSwitchOn");
					eSwitch.classList.add("selfSwitchOff");
					hasSwitchOFF = true;
				}
				eSwitch.querySelectorAll('.val')[0].checked = switchValue;
			}
			
			if (
			(!hasSwitchOn && showONOnly)
			|| (!hasSwitchOFF && showOFFOnly)
			|| (eventId != filterSelfSwitches && !eventName.toLowerCase().includes(filterSelfSwitches))
			)
				eEvent.classList.add("hidden");
			else
				eEvent.classList.remove("hidden");
		}
	}
};

function toggleSelfSwitch(switchId) {
	if (!switchId)
		return;
	$.$gameSelfSwitches.setValue(switchId, !$.$gameSelfSwitches.value(switchId));
	refreshView();
};