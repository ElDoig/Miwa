function initEvents(keepFilteringInputValues = false) {
	view.setAttribute('data-view', 'events');
	const mapId = $.$gameMap.mapId();
	if (keepFilteringInputValues)
		var currentFilteringInputValues = getResultFilterValues();
	let viewHTML = getEventsViewHeader() + getMapHeader(mapId);		
	
	viewHTML += `
	<div data-mapID="${mapId}" id="content">
		<ul>`;
	if ($.$gameMap.events().length < 1)
		viewHTML += `
			<p><b>No event was detected.</b></p>`;
	else 
		viewHTML += `
			<p><b>${$.$gameMap.events().length} event(s) detected :</b>`;
	
	for (event of $.$gameMap.events()) {
		let eventId = event.eventId();
		let dataEvent = event.event();
		let eventName = dataEvent.name;
		let activePage = $.Drag.Debugger.getActivePage(eventId);
		viewHTML += `
			<li data-eventId="${eventId}" class="evData" id="event${eventId}">
				<div class="grid2row">
					${getEventHeader(eventId, eventName)}
					<div>`;
					
		let status = [];
		if ($.Drag.Debugger.getPagesByTrigger(3, event).length > 0)
			status = $.Drag.Debugger.checkAutorunEvent(event);
	
		viewHTML += getEventGeneralInfos(event, true, false, true);
		for (let i = 0; i < dataEvent.pages.length; i++)
			viewHTML += `
						<div data-pageId="${i}" class="evPages evPage${i}">
							${getEventElemPageHeader(i, event)}
							<div class="transitionAll025 ${(i === activePage ) ? '' : 'uncollapsed'}">
								${getEventElemOptions(i, event)}
								${getEventElemConditions(i, mapId, event)}
							</div>
							${(status.length > 0 && status[1] === i)? 
							'<div data-warnCode="' + status[0] + '" data-warnPageId="' + status[1] + '" class="warnAutorun">' + getAutorunEventHelp(status) + '</div>'
							: 
							''}
						</div>`;
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

function getEventsViewHeader() {
	return `
		<h1>
			Events
		</h1>
		<div class="info invisible">
			<p><span style="color: steelblue; font-size: 18px; font-weight: bold">Game Events</span> are objects in your game </p>
			<p>You can also use a <i>script call</i> to access them :</p>
			<p>- <b>$gameSwitches.value(switchID)</b> to get the value of a specific switch, where <i>switchID is the switch ID in your switch list</i>.</p>
			<p> <i>e.g.</i> <b>$gameSwitches.value(2)</b>
			<p>- <b>$gameSwitches.set(switchID, value)</b> to set a specific switch to on or off, where <i>switchID is the switch ID in your switch list</i> and <i>value is either true or false</i>.</p>
			<p> <i>e.g.</i> <b>$gameSwitches.set(2, true)</b>
		</div>
		<br>
		<div id="resultFilter">
			<form id="form-slider" onchange="saveConfig()">
				<button type="submit" disabled style="display: none" aria-hidden="true"></button>
				<div>
					<span id="slider-title">Filter By State</span>
					<div id="slider">
						<input data-default="false" onclick="updateSliderPos(this); updateEvents();" type="radio" name="slider-option" id="showRunningOnly" value="1" required>
						<label for="showRunningOnly" data-slider-option="Running"></label>
						<input data-default="true" onclick="updateSliderPos(this); updateEvents();" type="radio" name="slider-option" id="noFilterRunning" value="2" required checked>
						<label for="noFilterRunning" data-slider-option="No Filter"></label>
						<input data-default="false" onclick="updateSliderPos(this); updateEvents();" type="radio" name="slider-option" id="showNotRunningOnly" value="3" required>
						<label for="showNotRunningOnly" data-slider-option="Not Running"></label>
						<div id="slider-pos"></div>
					</div>
				</div>
			</form>
			<form id="form-slider" onchange="saveConfig()">
				<button type="submit" disabled style="display: none" aria-hidden="true"></button>
				<div>
					<span id="slider-title">Filter By Active Pages</span>
					<div id="slider">
						<input data-default="false" onclick="updateSliderPos(this); updateEvents();" type="radio" name="slider-option" id="showActiveOnly" value="1" required>
						<label for="showActiveOnly" data-slider-option="Have Active Pages"></label>
						<input data-default="true" onclick="updateSliderPos(this); updateEvents();" type="radio" name="slider-option" id="noFilterActive" value="2" required checked>
						<label for="noFilterActive" data-slider-option="No Filter"></label>
						<input data-default="false" onclick="updateSliderPos(this); updateEvents();" type="radio" name="slider-option" id="showNoActiveOnly" value="3" required>
						<label for="showNoActiveOnly" data-slider-option="No Active Pages"></label>
						<div id="slider-pos"></div>
					</div>
				</div>
			</form>
			<form onchange="saveConfig()">
				<button type="submit" disabled style="display: none" aria-hidden="true"></button>
				<label class="form-control-filter">
					<span>Filter</span>
					<input data-default="" onchange="updateEvents()" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
						type="text" placeholder="Enter event ID or name" id="filterEvents" name="filterEvents"
					>
				</label>
			</form>
		</div>
		<div class="textRight">
			<span class="hyperlink" onclick="resetFilters()">Reset filters</span>
		</div>
	`;
};

function updateEvents() {
	const mapAvailable = isMapAvailable();
	if (!mapAvailable) 
		return;
	
	let currentMapId = parseInt(document.getElementById("content").getAttribute("data-mapID"));
	let mapId = $.$gameMap.mapId();
	if (currentMapId !== mapId) {
		if ($.$dataMap.mapId !== currentMapId && $.$dataMap.mapId > 0)
			initEvents(true);
	} else {		
		let eEvents = document.querySelectorAll('#content .evData');
		if (!(eEvents.length > 0))
			return;
		
		let showRunningOnly = document.getElementById('showRunningOnly').checked;
		let showNotRunningOnly = document.getElementById('showNotRunningOnly').checked;
		let showActiveOnly = document.getElementById('showActiveOnly').checked;
		let showNoActiveOnly = document.getElementById('showNoActiveOnly').checked;
		let filterEvents = document.getElementById("filterEvents").value.toLowerCase();
		for (eEvent of eEvents) {
			updateEvent(eEvent, showRunningOnly, showNotRunningOnly, showActiveOnly, showNoActiveOnly, filterEvents);
		}
	}
};

function updateEvent(eEvent, showRunningOnly = false, showNotRunningOnly = false, showActiveOnly = false, showNoActiveOnly = false, filterEvents = '') {
	let mapId = $.$gameMap.mapId();
	let eventId = parseInt(eEvent.getAttribute('data-eventId'));
	let gameEvent = $.$gameMap.event(eventId);
	if (!gameEvent)
		return;
	let dataEvent = gameEvent.event();
	if (!dataEvent)
		return;
	
	let activePage = gameEvent.findProperPageIndex();
	if (activePage !== gameEvent._pageIndex)
		gameEvent.refresh();
	
	let isEventRunning = $.Drag.Debugger.isEventRunning(eventId);
	let pageRunning = $.Drag.Debugger.getPageRunning(eventId); 
	
	let evInfo = eEvent.querySelector('.evInfos');
	updateEventGeneralInfos(evInfo, gameEvent, isEventRunning, pageRunning);
	
	let evPages = eEvent.querySelectorAll('.evPages');
	for (evPage of evPages) {
		let pageId = parseInt(evPage.getAttribute('data-pageId'));
		let isPageRunning = pageId === pageRunning;
		
		let evPageHeader = evPage.querySelector('.evPageHeader');
		updateEventElemPageHeader(evPageHeader, gameEvent, isPageRunning, activePage);
	
		let evOptions = evPage.querySelector('.evOptions');
		updateEventElemOptions(evOptions, gameEvent);
		
		let conditions = $.Drag.Debugger.getEventConditions(dataEvent.pages[pageId], mapId, eventId);
		let evConditions = evPage.querySelector('.evConditions');
		updateEventElemConditions(evConditions, gameEvent, mapId, conditions);
	}
	
	let warnAutorun = eEvent.querySelector('.warnAutorun');						
	if (activePage > -1 && dataEvent.pages[activePage].trigger === 3) {
		let warnCode = warnAutorun ? parseInt(warnAutorun.getAttribute('data-warnCode')) : -1;
		let warnPageId = warnAutorun ? parseInt(warnAutorun.getAttribute('data-warnPageId')) : -1;									
		let status = $.Drag.Debugger.checkAutorunEvent(gameEvent);
		if (status.length > 0 && (warnCode !== status[0] || warnPageId !== status[1])) {
			if (!warnAutorun) {
				warnAutorun = document.createElement('div');
				warnAutorun.classList.add('warnAutorun');
			} else if (status[1] !== warnPageId) {
				warnAutorun.remove();
			}
			warnAutorun.setAttribute('data-warnCode', status[0]);
			warnAutorun.setAttribute('data-warnPageId', status[1]);
			warnAutorun.innerHTML = getAutorunEventHelp(status);
			eEvent.querySelector(`.evPage${status[1]}`).appendChild(warnAutorun);
		} else if (status.length === 0 && warnAutorun) {
			warnAutorun.remove();
		}
	} else if (warnAutorun) {
		warnAutorun.remove();
	}
	
	if (
		(!isEventRunning && showRunningOnly)
		|| (isEventRunning && showNotRunningOnly)
		|| (showActiveOnly && activePage === -1)
		|| (showNoActiveOnly && activePage > -1)
		|| (eventId != filterEvents && !dataEvent.name.toLowerCase().includes(filterEvents))
	)
		eEvent.classList.add("hidden");
	else
		eEvent.classList.remove("hidden");
};

function getEventGeneralInfos(gameEvent, includeInterpreterHyperLink = false, includeEventHyperLink = false, includeSelfSwitchHyperLink = false) {
	if (!gameEvent)
		return '';
	let isEventRunning = $.Drag.Debugger.isEventRunning(gameEvent.eventId());
	let isEventErased = gameEvent._erased;
	let pageRunning = $.Drag.Debugger.getPageRunning(gameEvent.eventId());
	let isPageRunningAutorunParallel = pageRunning > - 1 ? gameEvent.event().pages[pageRunning].trigger >= 3 : false;
	let transparency = gameEvent._transparent ? "checked" : "";
	let erased = gameEvent._erased ? "checked" : "";
	let note = gameEvent.event() ? gameEvent.event().note : "";
	return `
		<div data-xy="${gameEvent.x},${gameEvent.y}" data-isEventErased="${isEventErased}" data-isEventRunning="${isEventRunning}" data-pageRunning="${pageRunning}" class="grid2col rowGap1 mBottom1 evInfos">
			<span>
				${isEventErased ?
				'<b>State : </b><br><span class="block red bold state">[ERASED]</span>'
				:
				isEventRunning ? 
				'<b>State : </b><br><span class="block green bold state">[RUNNING PAGE ' + (pageRunning + 1) + '...]</span>' 
				:   
				'<b>State : </b><br><span class="block red bold state">[NOT RUNNING]</span>'
				}
				<button data-eventId="${gameEvent.eventId()}" class="button bStartStopEvent mTop1" type="button" onclick="toggleEvent(this); refreshView();" ${isPageRunningAutorunParallel ? 'disabled' : ''}>${isEventRunning ? 'Stop Event' : 'Start Event'}</button>
			</span>
			<span class="textRight">
				<span>
					<b>Position : </b>
				</span>
				<br>
				<span class="fSize20 xy">[x: ${gameEvent.x}, y: ${gameEvent.y}]</span>
				<br>
				<button class="bTpEvent button mTop1" data-xy="${gameEvent.x},${gameEvent.y}" onclick="teleportPlayerTo(this); refreshView();">Teleport To</button>
			</span>
			<div>
				<label class="form-control">
					<input data-eventId="${gameEvent.eventId()}" onchange="setEventTransparency(this); refreshView();" type="checkbox" class="transparency" name="transparency" ${transparency}>
					Transparent
				</label>
				<label class="form-control">
					<input data-eventId="${gameEvent.eventId()}" onchange="setEventErased(this); refreshView();" type="checkbox" class="erased" name="erased" ${erased}>
					Erased
				</label>
			</div>
			<span class="textRight">
				${includeEventHyperLink ? getEventsHyperlink(gameEvent.eventId()) : ''}
				${includeInterpreterHyperLink ? getInterpreterHyperlink(gameEvent.eventId()) : ''}
				${includeSelfSwitchHyperLink ? getSelfSwitchHyperlink(gameEvent.eventId()) : ''}
			</span>
			<div>
				${getEventNotetagElem(gameEvent.eventId())}
			</div>
		</div>`;
};

function getEventNotetagElem(eventId) {
	const note = $.$gameMap.event(eventId).event().note;
	const metas = $.$gameMap.event(eventId).event().meta;
	// let metas = $.Drag.Debugger.getMetaFromNote(note);
	const noMetaNote = escapeHTMLQuotes($.Drag.Debugger.getNoteWithoutMeta(note));
	let metasElem = ``;
	if (Object.keys(metas).length > 0)
		for (meta in metas)
			metasElem += `
				${getNotetagElem(meta, metas[meta])}
			`;
	else
		metasElem += `
			${getNotetagElem()}
		`;
	return `
		<span class="hyperlink block" onclick="showEventNotetagData(this)">Manage note(tags)</span>
		<div class="eventCommandData uncollapsed">
			<div class="gridGap15 padding20">
				<h3 class="margin0">Notes & Notetag</h3>
				<div>
					<span class="block hyperlink textRight" onclick="copyNotetagClipboard(this);">Copy to clipboard</span>
				</div>
				<div>
					<label for="eventNote">Note :</label>
					<input data-eventId="${eventId}" placeholder="Write a note" type="text" id="eventNote" name="eventNote" value="${noMetaNote}"
						onchange="setEventNote(this); refreshView();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
					>
				</div>
				<div>
					<span>Notetag(s) :</span>
					<form data-eventId="${eventId}" id="formEventMeta" onchange="setEventNotetag(this);" class="margin0">
						${metasElem}
					</form>
				</div>
				
				<span class="closeEventCommandData" onclick="hideEventNotetagData(this); refreshView();"></span>
			</div>
		</div>
	`;
	/*<div class="block textRight marginAuto" style="width: 75%;">
		<button data-eventId="${eventId}" id="saveButton" onclick="saveNotetag(this);">Save</button>
	</div>*/
};

function getNotetagElem(name = "", value = "") {
	name = escapeHTMLQuotes(name);
	value = escapeHTMLQuotes(value);
	return `
		<div class="margin0 customGrid gridColGap0 alignItemsCenter" style="--grid-col-nb: 3; --grid-row-nb: 3; grid-template-columns: 10px 1fr 10px; grid-template-rows: 30px auto 30px; row-gap: 5px;">
			<span><</span>
			<input placeholder="Name" type="text" id="notetagName" name="notetagName" value="${name}"/>
			<span>:</span>
			<span></span>
			<textarea placeholder="Value" type="text" id="notetagValue" class="verticalResize unfitTextArea" name="notetagValue" oninput="autoFitTextArea(this);">${value}</textarea>
			<span>></span>
			<span></span>
			<div class="marginAuto">
				<span id="buttonRemove" onclick="removeNotetag(this);"></span>
				<span id="buttonAdd" onclick="addNotetag(this);"></span>
			</div>
		</div>
	`;
};

function copyNotetagClipboard(elem) {
	let text = elem.parentNode.parentNode.querySelector('input#eventNote').value;
	let metas = getNotetagFromForm(elem.parentNode.parentNode.querySelector('form#formEventMeta'));
	text += $.Drag.Debugger.metaToString(metas);
	navigator.clipboard.writeText(text);
};

function setEventNote(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let note = elem.value;
	let meta = getNotetagFromForm(elem.parentNode.nextElementSibling.querySelector('form'));
	$.Drag.Debugger.setEventNote(eventId, (note + $.Drag.Debugger.metaToString(meta)));
	$.Drag.Debugger.setEventMeta(eventId, meta);
};

function setEventNotetag(form) {
	let eventId = parseInt(form.getAttribute('data-eventId'));
	let meta = getNotetagFromForm(form);
	let metaString = $.Drag.Debugger.metaToString(meta);
	let note = form.parentNode.previousElementSibling.querySelector('input#eventNote').value;
	
	$.Drag.Debugger.setEventNote(eventId, (note + metaString));
	$.Drag.Debugger.setEventMeta(eventId, meta);
};

function saveNotetag(elem) {
	let eventId = parseInt(elem.getAttribute('data-eventId'));
	let meta = getNotetagFromForm(elem.parentNode.parentNode.querySelector('form#formEventMeta'));
	console.log(meta);
	let metaString =  $.Drag.Debugger.metaToString(meta);
	console.log(metaString);
	let note = elem.parentNode.parentNode.querySelector('input#eventNote').value;
	
	let mapId = $.$gameMap.mapId();
	mapId = mapId < 10 ? `00${mapId}` : mapId < 100 ? `0${mapId}` : `${mapId}`;
	
	console.log(note + metaString);
	$.Drag.Debugger.editJSON(`./data/Map${mapId}.json`, ['events', eventId, 'note'], (note + metaString));
};

function getNotetagFromForm(form) {
	let meta = {};
	let eventNotetagNames = form.querySelectorAll('*[name="notetagName"]');
	let eventNotetagValues = form.querySelectorAll('*[name="notetagValue"]');
	for ([i, eventNotetagName] of eventNotetagNames.entries())
		if (eventNotetagName.value && eventNotetagName.value.trim() !== "" && eventNotetagValues[i].value && eventNotetagValues[i].value.trim() !== "") 
			meta[eventNotetagName.value.trim()] = eventNotetagValues[i].value.replace(/(\r\n|\n|\r)/gm, " ").trim();
	return meta;
};

function removeNotetag(elem) {
	elem.parentNode.parentNode.querySelector('#notetagName').value = "";
	elem.parentNode.parentNode.querySelector('#notetagValue').value = "";
	
	if (elem.parentNode.parentNode.parentNode.childElementCount > 1)
		elem.parentNode.parentNode.remove();
};

function addNotetag(elem) {
	elem.parentNode.parentNode.insertAdjacentHTML("afterend", `
		${getNotetagElem()}
	`);
};

function showEventNotetagData(elem) {
	elem.nextElementSibling.classList.remove("uncollapsed");
	document.documentElement.style.top = (-(document.documentElement.scrollTop) + 'px');
	document.documentElement.classList.add("noscroll");
};

function hideEventNotetagData(elem) {
	elem.parentNode.parentNode.classList.add("uncollapsed");
	let scrolltop = (-(parseInt(document.documentElement.style.top)));
	document.documentElement.classList.remove("noscroll");
	window.scrollTo(0, scrolltop);
};

function updateEventGeneralInfos(elem, gameEvent, isEventRunning, pageRunning) {
	if (!elem || !gameEvent)
		return;
	
	isEventRunning = isEventRunning ? isEventRunning : $.Drag.Debugger.isEventRunning(gameEvent.eventId());
	pageRunning = pageRunning ? pageRunning : $.Drag.Debugger.getPageRunning(gameEvent.eventId());
	let isEventErased = gameEvent._erased;
	let currentIsEventRunning = elem.getAttribute("data-isEventRunning") === "true";				
	let currentPageRunning = parseInt(elem.getAttribute("data-pageRunning"));
	let currentIsEventErased = elem.getAttribute("data-isEventErased") === "true";
	let isPageRunningAutorunParallel = pageRunning > -1 ? gameEvent.event().pages[pageRunning].trigger >= 3 : false;
	
	let state = elem.querySelector('.state');
	if (currentIsEventRunning !== isEventRunning || currentPageRunning !== pageRunning || currentIsEventErased !== isEventErased) {
		if (isEventRunning && pageRunning > -1) {
			elem.setAttribute('data-isEventRunning', isEventRunning);
			elem.setAttribute('data-pageRunning', pageRunning);
			elem.setAttribute('data-isEventErased', isEventErased);
			state.innerHTML = `[RUNNING PAGE ${(pageRunning + 1)}...]`;
			state.classList.remove('red');
			state.classList.add('green');
			state.nextElementSibling.innerHTML = `Stop Event`;
		} else if (isEventErased) {
			elem.setAttribute('data-isEventRunning', isEventRunning);
			elem.setAttribute('data-pageRunning', pageRunning);
			elem.setAttribute('data-isEventErased', isEventErased);
			state.innerHTML = `[ERASED]`;
			state.classList.remove('green');
			state.classList.add('red');
			state.nextElementSibling.innerHTML = `Start Event`;
		} else {
			elem.setAttribute('data-isEventRunning', isEventRunning);
			elem.setAttribute('data-pageRunning', pageRunning);
			elem.setAttribute('data-isEventErased', isEventErased);
			state.innerHTML = `[NOT RUNNING]`;
			state.classList.remove('green');
			state.classList.add('red');
			state.nextElementSibling.innerHTML = `Start Event`;
		}
	}
	
	let bStartStopEvent = elem.querySelector('.bStartStopEvent');
	bStartStopEvent.disabled = isPageRunningAutorunParallel;
	bStartStopEvent.title = isPageRunningAutorunParallel ? "Can't stop an autorun/parallel event." : '';
	
	let [x, y] = elem.getAttribute("data-xy").split(',').map(Number);
	if (gameEvent.x !== x || gameEvent.y !== y) {
		elem.setAttribute("data-xy", `${gameEvent.x},${gameEvent.y}`);
		let xy = elem.querySelector('.xy');
		xy.innerHTML = `[x: ${gameEvent.x}, y: ${gameEvent.y}]`;
		
		let bTpEvent = elem.querySelector('.bTpEvent');
		bTpEvent.setAttribute('data-xy', `${gameEvent.x},${gameEvent.y}`);
	}
	
	let transparencyElem = elem.querySelector('.transparency');
	let currentTransparency = transparencyElem.checked;
	let transparency = gameEvent._transparent;
	if (currentTransparency !== transparency)
		transparencyElem.checked = transparency;
	
	let erasedElem = elem.querySelector('.erased');
	let currentErased = erasedElem.checked;
	let erased = gameEvent._erased;
	if (currentErased !== erased)
		erasedElem.checked = erased;
};

function getEventElemPageHeader(pageId, gameEvent) {
	if (!gameEvent)
		return ``;
	let isPageRunning = $.Drag.Debugger.isPageRunning(gameEvent.eventId(), pageId);
	let activePage = $.Drag.Debugger.getActivePage(gameEvent.eventId());
	let isActive = pageId === activePage;
	let page = gameEvent.event().pages[pageId]
	return `
		<div class="evPageHeader">
			<div class="textCenter">
				<hr class="divider2">
				<h4 class="marginAuto pointer">
					<span data-pageId="${pageId}" data-isPageRunning="${isPageRunning}" data-isActive="${isActive}" data-open="${isActive}" onclick="toggleCollapse(this)" class="squareSubTitle">
						${isActive ? 'Hide' : 'Show'} Page ${(pageId + 1)} 
						<span class="state ${isPageRunning ? 'green' : isActive ? '' : 'red'}">[${isPageRunning ? 'RUNNING' : isActive ? 'ACTIVE' : 'INACTIVE'}]</span>
					</span>
				</h4>
			</div>
		</div>`;
};

function updateEventElemPageHeader(evPageHeader, gameEvent, isPageRunning, activePage) {
	if (!evPageHeader || !gameEvent)
		return;
			
	let pageHeader = evPageHeader.querySelector('.squareSubTitle');
	let pageId = parseInt(pageHeader.getAttribute('data-pageId'));
	
	let currentIsPageRunning = pageHeader.getAttribute('data-isPageRunning') === "true";
	isPageRunning = isPageRunning ? isPageRunning : $.Drag.Debugger.isPageRunning(gameEvent.eventId(), pageId);
	let currentIsActive = pageHeader.getAttribute('data-isActive') === "true";
	activePage = activePage ? activePage : $.Drag.Debugger.getActivePage(gameEvent.eventId());
	let isActive = pageId === activePage;
	
	if ((currentIsPageRunning !== isPageRunning) || (currentIsActive !== isActive)) {
		pageHeader.setAttribute('data-isPageRunning', isPageRunning);
		pageHeader.setAttribute('data-isActive', isActive);
		let state = pageHeader.querySelector('.state');
		if (isPageRunning) {
			state.classList.add("green");
			state.classList.remove("red");
			state.innerHTML = "[RUNNING]";
		} else if (isActive) {
			state.classList.remove("green");
			state.classList.remove("red");
			state.innerHTML = "[ACTIVE]";
		} else {
			state.classList.add("red");
			state.classList.remove("green");
			state.innerHTML = "[INACTIVE]";
		}
	}
};

function getEventElemOptions(pageId, gameEvent, includeCheckboxOptions = true) {
	let eventId = gameEvent.eventId();
	let dataEvent = gameEvent.event();
	let trigger = dataEvent.pages[pageId].trigger;
	let priorityType = dataEvent.pages[pageId].priorityType;
	let walking = dataEvent.pages[pageId].walkAnime === true ? "checked" : "";
	let stepping = dataEvent.pages[pageId].stepAnime === true ? "checked" : "";
	let directionFix = dataEvent.pages[pageId].directionFix === true ? "checked" : "";
	let through = dataEvent.pages[pageId].through === true ? "checked" : "";
	return `
		<div class="grid2col rowGap1 mBottom1 mTop1 evOptions">
			<div>
				<label for="standard-select"><b>Trigger :</b></label>
				<div class="select">
					<select data-eventId="${eventId}" data-pageId="${pageId}" onchange="setEventTrigger(this); refreshView();" id="standard-select" class="trigger">
						<option value="0" ${trigger === 0 ? 'selected="selected"' : ''}>Action Button</option>
						<option value="1" ${trigger === 1 ? 'selected="selected"' : ''}>Player Touch</option>
						<option value="2" ${trigger === 2 ? 'selected="selected"' : ''}>Event Touch</option>
						<option value="3" ${trigger === 3 ? 'selected="selected"' : ''}>Autorun</option>
						<option value="4" ${trigger === 4 ? 'selected="selected"' : ''}>Parallel</option>
					</select>
					<span class="focus"></span>
				</div>
			</div>
			<div class="textRight">
				<label for="standard-select"><b>Priority Type :</b></label>
				<div class="select">
					<select data-eventId="${eventId}" data-pageId="${pageId}" onchange="setEventPriorityType(this); refreshView();" id="standard-select" class="priorityType">
						<option value="0" ${priorityType === 0 ? 'selected="selected"' : ''}>Below characters</option>
						<option value="1" ${priorityType === 1 ? 'selected="selected"' : ''}>Same as characters</option>
						<option value="2" ${priorityType === 2 ? 'selected="selected"' : ''}>Above characters</option>
					</select>
					<span class="focus"></span>
				</div>
			</div>
			${includeCheckboxOptions ?
				`<div>
					<label class="form-control">
						<input data-eventId="${eventId}" data-pageId="${pageId}" onchange="setEventWalkAnime(this); refreshView();" type="checkbox" class="walking" name="walking" ${walking}>
						Walking
					</label>
					<label class="form-control">
						<input data-eventId="${eventId}" data-pageId="${pageId}" onchange="setEventStepAnime(this); refreshView();" type="checkbox" class="stepping" name="stepping" ${stepping}>
						Stepping
					</label>
					<label class="form-control">
						<input data-eventId="${eventId}" data-pageId="${pageId}" onchange="setEventDirectionFix(this); refreshView();" type="checkbox" class="directionFix" name="directionFix" ${directionFix}>
						Direction Fix
					</label>
					<label class="form-control">
						<input data-eventId="${eventId}" data-pageId="${pageId}" onchange="setEventThrough(this); refreshView();" type="checkbox" class="through" name="through" ${through}>
						Through
					</label>
				</div>`
			: ''}
		</div>`;
};

function updateEventElemOptions(elem, gameEvent, includeCheckboxOptions = true) {
	let dataEvent = gameEvent.event();
	if (!elem || !dataEvent)
		return;
	
	let triggerElem = elem.querySelector('.trigger');
	let pageId = parseInt(triggerElem.getAttribute('data-pageId'));
	
	let page = dataEvent.pages[pageId];
	if (!page)
		return;
	
	let currentTrigger = parseInt(triggerElem.value);
	let trigger = page.trigger;
	if (currentTrigger !== trigger)
		triggerElem.value = trigger;
	
	let priorityTypeElem = elem.querySelector('.priorityType');
	let currentPriorityType = parseInt(priorityTypeElem.value);
	let priorityType = page.priorityType;
	if (currentPriorityType !== priorityType)
		priorityTypeElem.value = priorityType;
	
	if (includeCheckboxOptions) {
		let walkingElem = elem.querySelector('.walking');
		let currentWalking = walkingElem.checked;
		let walkAnime = page.walkAnime;
		if (currentWalking !== walkAnime)
			walkingElem.checked = walkAnime;
		
		let steppingElem = elem.querySelector('.stepping');
		let currentStepping = steppingElem.checked;
		let stepAnime = page.stepAnime;
		if (currentStepping !== stepAnime)
			steppingElem.checked = stepAnime;
		
		let directionFixElem = elem.querySelector('.directionFix');
		let currentDirectionFix = directionFixElem.checked;
		let directionFix = page.directionFix;
		if (currentDirectionFix !== directionFix)
			directionFixElem.checked = directionFix;
		
		let throughElem = elem.querySelector('.through');
		let currentThrough = throughElem.checked;
		let through = page.through;
		if (currentThrough !== through)
			throughElem.checked = through;
	}
};

function getEventElemPages(currentPage, nbPage) {
	let html = `
		<div class="textRight">
			<label for="standard-select"><b>Show Page</b></label>
			<br>
			<div class="select fRight w25">
				<select id="standard-select">
				<option ${currentPage === -1 ? 'selected="selected"' : ''} value="-1"></option>`;
	for (let i = 0; i < nbPage; i++)
		html += `<option value="${i}" ${i === currentPage ? 'selected="selected"' : ''}>${i + 1}</option>`;
	html += `
				</select>
				<span class="focus"></span>
			</div>
		</div>`;
	return html;
};

function getEventElemConditions(pageId, mapId, gameEvent) {
	let eventId = gameEvent.eventId();
	let dataEvent = gameEvent.event();
	let page = dataEvent.pages[pageId];
	
	let conditions = $.Drag.Debugger.getEventConditions(page, mapId, eventId);
	if (!conditions)
		return ``;
	
	return `
		<div data-eventId="${eventId}" data-pageId="${pageId}" class="grid2col rowGap1 mBottom1 mTop1 evConditions">
			<label class="form-control">
				<input data-eventId="${eventId}" data-pageId="${pageId}" onchange="toggleEventSwitch1(this); refreshView();" 
					type="checkbox" class="alignSelfCenter" id="switch1" name="switch1" ${conditions[0].valid ? 'checked' : ''}
				/>
				<div class="grid2col gridTemColMin2 gridTemRowMinMax gridColGap relative">
					<span class="alignSelfCenter">Switch</span>
					<div class="wrapInputFilter ${conditions[0].valid ? '' : 'disabled'}" data-after="${$.$gameSwitches.getName(conditions[0].conditionId)}">
						<input data-filterType="switch" data-eventId="${eventId}" data-pageId="${pageId}"
							oninput="onSwitchFilterConditionFocus(this);" onfocus="this.oninput();" 
							onfocusout="onInputFilterConditionFocusOut(this)" onchange="verifyInputFilterConditionValue(this); updateDataAfter(this); changeEventSwitch1Id(this); refreshView();" 
							type="text" class="inputFilter ${conditions[0].valid ? conditions[0].conditionCheck ? 'borderForestGreen2' : 'borderIndianRed2' : 'disabled'}" id="switch1Id" name="switch1Id" 
							value="${conditions[0].valid ? conditions[0].conditionId : ''}" placeholder="0" ${conditions[0].valid ? '' : 'disabled'}
						/>
						<select onfocusout="onSelectFilteredConditionSelectFocusOut(this);" onchange="setValueInputFilterConditions(this);" onclick="this.onchange(); return false;"
							class="selectFiltered" disabled>
						</select>
					</div>
				</div>
			</label>
			<label class="form-control-right">
				<div class="grid2col gridTemCol2Max gridTemRowMaxMin gridColGap relative">
					<div class="wrapInputFilterRight ${conditions[1].valid ? '' : 'disabled'}" data-after="${$.$gameSwitches.getName(conditions[1].conditionId)}">
						<input data-filterType="switch" data-eventId="${eventId}" data-pageId="${pageId}" 
							oninput="onSwitchFilterConditionFocus(this);" onfocus="this.oninput();" 
							onfocusout="onInputFilterConditionFocusOut(this)" onchange="verifyInputFilterConditionValue(this); updateDataAfter(this); changeEventSwitch2Id(this); refreshView();" 
							type="text" class="inputFilter ${conditions[1].valid ? conditions[1].conditionCheck ? 'borderForestGreen2' : 'borderIndianRed2' : 'disabled'}" id="switch2Id" name="switch2Id"
							value="${conditions[1].valid ? conditions[1].conditionId : ''}" placeholder="0" ${conditions[1].valid ? '' : 'disabled'}
						/>
						<select onfocusout="onSelectFilteredConditionSelectFocusOut(this)" onchange="setValueInputFilterConditions(this);" onclick="this.onchange(); return false;"
							class="selectFiltered" disabled>
						</select>
					</div>
					<span class="alignSelfCenter">Switch</span>
				</div>
				<input data-eventId="${eventId}" data-pageId="${pageId}" onchange="toggleEventSwitch2(this); refreshView();" 
					type="checkbox" class="alignSelfCenter" id="switch2" name="switch2" ${conditions[1].valid ? 'checked' : ''}
				/>
			</label>
			<label class="form-control">
				<input data-eventId="${eventId}" data-pageId="${pageId}" onchange="toggleEventVariable1(this); refreshView();" 
					type="checkbox" class="alignSelfCenter" id="var1" name="var1" ${conditions[2].valid ? 'checked' : ''}
				/>
				<div class="grid2col gridTemColMin2 gridTemRowMinMax gridColGap gridRowGap5 relative alignItemsCenter">
					<span class="alignSelfCenter">Variable</span>
					<div class="wrapInputFilter ${conditions[0].valid ? '' : 'disabled'}" data-after="${$.$gameVariables.getName(conditions[2].conditionId)} (${$.$gameVariables.value(conditions[2].conditionId)})">
						<input data-eventId="${eventId}" data-pageId="${pageId}" data-filterType="var"
							oninput="onVariableFilterConditionFocus(this);" onfocus="this.oninput();" 
							onfocusout="onInputFilterConditionFocusOut(this)" onchange="verifyInputFilterConditionValue(this); updateDataAfter(this); changeEventVariable1Id(this); refreshView();"										
							type="text" class="inputFilter ${conditions[2].valid ? conditions[2].conditionCheck ? 'borderForestGreen2' : 'borderIndianRed2' : 'disabled'}" id="var1Id" name="var1Id" 
							value="${conditions[2].valid ? conditions[2].conditionId : ''}" placeholder="0" ${conditions[2].valid ? '' : 'disabled'}
						/>
						<select onfocusout="onSelectFilteredConditionSelectFocusOut(this)" onchange="setValueInputFilterConditions(this);" onclick="this.onchange(); return false;"
							class="selectFiltered" disabled>
						</select>
					</div>
					<span class="alignSelfCenter textCenter">>=</span>
					<input data-eventId="${eventId}" data-pageId="${pageId}"
						oninput="this.onchange();" onchange="verifyInputFilterConditionValue(this); changeEventVariable1Value(this); refreshView();"
						type="number"  class="${conditions[2].valid ? conditions[2].conditionCheck ? 'borderForestGreen2' : 'borderIndianRed2' : 'disabled'}" id="var1Value" name="var1Value"
						value="${conditions[2].valid ? conditions[2].value : ''}" placeholder="0" ${conditions[2].valid ? '' : 'disabled'}
					/>
				</div>
			</label>
			<label class="form-control-right">
				<div class="grid2col gridTemCol2Max gridTemRowMaxMin gridColGap alignSelfCenter">
					<div class="select ${conditions[3].valid ? conditions[3].conditionCheck ? 'borderForestGreen2' : 'borderIndianRed2' : 'disabled disabled'}">
						<select data-eventId="${eventId}" data-pageId="${pageId}" data-eventId="${eventId}"
							onfocus="updateSelfSwitchConditionOptionsColours(this);" onchange="changeEventSelfSwitch1Id(this); refreshView();" 
							id="selfSwitch1Id" ${conditions[3].valid ? '' : 'disabled'}
						>
							<option hidden disabled ${conditions[3].valid ? '' : 'selected'} value></option>
							<option value="A" ${conditions[3].valid ? conditions[3].conditionId === "A" ? 'selected="selected"' : '' : ''}>A</option>
							<option value="B" ${conditions[3].valid ? conditions[3].conditionId === "B" ? 'selected="selected"' : '' : ''}>B</option>
							<option value="C" ${conditions[3].valid ? conditions[3].conditionId === "C" ? 'selected="selected"' : '' : ''}>C</option>
							<option value="D" ${conditions[3].valid ? conditions[3].conditionId === "D" ? 'selected="selected"' : '' : ''}>D</option>
						</select>
						<span class="focus"></span>
					</div>
					<label for="standard-select" class="alignSelfCenter"><b>Self Switch</b></label>
				</div>
				<input data-eventId="${eventId}" data-pageId="${pageId}" onchange="toggleEventSelfSwitch1(this); refreshView();" 
					type="checkbox" class="alignSelfCenter" id="selfSwitch1" name="selfSwitch1" ${conditions[3].valid ? 'checked' : ''}
				/>
			</label>
			<label class="form-control">
				<input data-eventId="${eventId}" data-pageId="${pageId}" onchange="toggleEventItem1(this); refreshView();" 
					type="checkbox" class="alignSelfCenter" id="item1" name="item1" ${conditions[4].valid ? 'checked' : ''}
				/>
				<div class="grid2col gridTemColMin2 gridTemRowMinMax gridColGap relative">
					<span class="alignSelfCenter">Item</span>
					<div class="wrapInputFilter ${conditions[0].valid ? '' : 'disabled'}" data-after="${$.$dataItems[conditions[4].conditionId].name}">
						<input data-filterType="item" data-eventId="${eventId}" data-pageId="${pageId}" 
							oninput="onItemFilterConditionFocus(this);" onfocus="this.oninput();" 
							onfocusout="onInputFilterConditionFocusOut(this)" onchange="verifyInputFilterConditionValue(this); updateDataAfter(this); changeEventItem1Id(this); refreshView();"	
							type="text" class="inputFilter ${conditions[4].valid ? conditions[4].conditionCheck ? 'borderForestGreen2' : 'borderIndianRed2' : 'disabled'}" id="item1Id" name="item1Id" 
							value="${conditions[4].valid ? conditions[4].conditionId : ''}" placeholder="0" ${conditions[4].valid ? '' : 'disabled'}
						/>
						<select onfocusout="onSelectFilteredConditionSelectFocusOut(this)" onchange="setValueInputFilterConditions(this);" onclick="this.onchange(); return false;"
							class="selectFiltered" disabled>
						</select>
					</div>
				</div>
			</label>
			<label class="form-control-right">
				<div class="grid2col gridTemCol2Max gridTemRowMaxMin gridColGap relative">
					<div class="wrapInputFilterRight ${conditions[0].valid ? '' : 'disabled'}" data-after="${$.$dataActors[conditions[5].conditionId].name}">
						<input data-filterType="actor" data-eventId="${eventId}" data-pageId="${pageId}" 
							oninput="onActorFilterConditionFocus(this);" onfocus="this.oninput();" 
							onfocusout="onInputFilterConditionFocusOut(this)" onchange="verifyInputFilterConditionValue(this); updateDataAfter(this); changeEventActor1Id(this); refreshView();"	
							type="text" class="inputFilter ${conditions[5].valid ? conditions[5].conditionCheck ? 'borderForestGreen2' : 'borderIndianRed2' : 'disabled'}" id="actor1Id" name="actor1Id" 
							value="${conditions[5].valid ? conditions[5].conditionId : ''}" placeholder="0" ${conditions[5].valid ? '' : 'disabled'}>
						<select onfocusout="onSelectFilteredConditionSelectFocusOut(this)" onchange="setValueInputFilterConditions(this);" onclick="this.onchange(); return false;"
							class="selectFiltered" disabled>
						</select>
					</div>
					<span class="alignSelfCenter">Actor</span>
				</div>
				<input data-eventId="${eventId}" data-pageId="${pageId}" onchange="toggleEventActor1(this); refreshView();" 
					type="checkbox" class="alignSelfCenter" id="actor1" name="actor1" ${conditions[5].valid ? 'checked' : ''}
				/>
			</label>
		</div>`;
};

function updateEventElemConditions(elem, gameEvent, mapId, conditions) {
	if (!elem || !gameEvent)
		return;
	let eventId = elem.getAttribute('data-eventId');
	let pageId = elem.getAttribute('data-pageId');
	let dataEvent = gameEvent.event();
	let page = dataEvent.pages[pageId];
	conditions = conditions ? conditions : $.Drag.Debugger.getEventConditions(page, mapId, eventId);
	if (!conditions)
		return;
	let checkboxs = elem.querySelectorAll('input[type="checkbox"]');
	
	for ([i, checkbox] of checkboxs.entries()) {
		let id = checkbox.getAttribute('id');
		let inputLinked = checkbox.parentNode.querySelector(`#${id}Id`);
		if (checkbox.checked !== conditions[i].valid)
			checkbox.checked = conditions[i].valid;
		
		if (inputLinked.disabled !== !checkbox.checked)
			inputLinked.disabled = !checkbox.checked;
		
		let currentVal = parseInt(inputLinked.value);
		if (currentVal !== conditions[i].conditionId)
			inputLinked.value = conditions[i].conditionId;
		
		if (id === "var1") {
			var varValInput = checkbox.parentNode.querySelector(`#var1Value`);
			if (varValInput.disabled !== !checkbox.checked)
				varValInput.disabled = !checkbox.checked;
			
			let currentVarVal = parseInt(varValInput.value);
			if (currentVarVal !== conditions[i].value)
				varValInput.value = conditions[i].value;
		}
		
		let borderElem = inputLinked.nodeName === 'SELECT' ? inputLinked.parentNode : inputLinked;
		if (conditions[i].conditionCheck && conditions[i].valid) {
			inputLinked.parentNode.classList.remove("disabled");
			borderElem.classList.add("borderForestGreen2");
			borderElem.classList.remove("borderIndianRed2");
			borderElem.classList.remove("disabled");
			if (id === "var1") {
				varValInput.classList.add("borderForestGreen2");
				varValInput.classList.remove("borderIndianRed2");
				varValInput.classList.remove("disabled");
			}
		} else if (conditions[i].valid) {
			inputLinked.parentNode.classList.remove("disabled");
			borderElem.classList.add("borderIndianRed2");
			borderElem.classList.remove("borderForestGreen2");
			borderElem.classList.remove("disabled");
			if (id === "var1") {
				varValInput.classList.add("borderIndianRed2");
				varValInput.classList.remove("borderForestGreen2");
				varValInput.classList.remove("disabled");
			}
		} else {
			inputLinked.parentNode.classList.add("disabled");
			borderElem.classList.add("disabled");
			borderElem.classList.remove("borderForestGreen2");
			borderElem.classList.remove("borderIndianRed2");
			if (id === "var1") {
				varValInput.classList.add("disabled");
				varValInput.classList.remove("borderForestGreen2");
				varValInput.classList.remove("borderIndianRed2");
			}
		}
	}
};			

function getAutorunEventHelp(status) {
	let [code, pageId, conditions, higherPagesConditions] = status;
	pageId++;
	let helpStuck = `<u onclick="showHelpAutoEvStuck(this)" class="pointer">It's stuck. How can I fix that ?</u>`;
	switch (code) {
		case 1:
			output = `<p class="red bold textCenter margin0">WARNING AUTORUN: page ${pageId} is active, has no defined conditions and there are no pages higher than it, so it is currently impossible to shut off.</p>`;
			return output;
			break;
		case 2:
			output = `
				<p class="red bold textCenter margin0">WARNING AUTORUN: page ${pageId} is active and there are no pages higher than it. ${helpStuck}</p>
				<div class="uncollapsed helpAutoEvStuck">
					<div>
						In order to shut it off, you may have to <b>create a higher page</b> OR <b>turn off/no longer meet one of its conditions as shown below</b> :
						<ul class="helpList">
							<br>`;
			for (condition of conditions)
				if (condition.valid)
					output += `
							<li>
								<i>${condition.outputOFF}</i>
							</li>`;
			output += `
						</ul>
						<span class="closeHelpAutoEvStuck" onclick="hideHelpAutoEvStuck(this)"></span>
					</div>
				</div>`;
			return output;
			break;
		case 3:
			output = `
				<p class="red bold textCenter margin0">WARNING AUTORUN: page ${pageId} is active and has no defined conditions. ${helpStuck}</p>
				<div class="uncollapsed helpAutoEvStuck">
					<div>
						In order to shut it off, you may have to <b>define some conditions</b> OR <b>turn on a higher page by meeting the following conditions</b> :
						<ul class="helpList">`;
			for (higherPagesCondition of higherPagesConditions) {
				output += `
							<br>
							<span><b>Page ${higherPagesCondition[0] + 1} :</b></span>`;
				for (condition of higherPagesCondition[1])
					if (condition.valid)
						output += ` 
							<li>
								<i>${condition.outputON}</i>
							</li>`;
			}
			output += `
						</ul>
						<span class="closeHelpAutoEvStuck" onclick="hideHelpAutoEvStuck(this)"></span>
					</div>
				</div>`;
			return output;
			break;	
		case 4:
			output = `
				<p class="red bold textCenter margin0">WARNING AUTORUN: page ${pageId} is active. ${helpStuck}</p>
				<div class="uncollapsed helpAutoEvStuck">
					<div>
						In order to shut it off, you may have <b>to turn off/no longer meet one of its conditions as shown below</b> :
						<ul class="helpList">
							<br>`;
			for (condition of conditions)
				if (condition.valid)
					output += `
							<li>
								<i>${condition.outputOFF}</i>
							</li>`;
			output += `
						</ul>
						<br>
						<span>OR <b>turn on a higher page by meeting the following conditions</b> :</span>
						<ul class="helpList">`;
			for (higherPagesCondition of higherPagesConditions) {
				output += `
							<br>
							<span><b>Page ${higherPagesCondition[0] + 1} :</b></span>`;
				for (condition of higherPagesCondition[1])
					if (condition.valid)
						output += ` 
							<li>
								<i>${condition.outputON}</i>
							</li>`;
			}
			output += `
						</ul>
						<span class="closeHelpAutoEvStuck" onclick="hideHelpAutoEvStuck(this)"></span>
					</div>
				</div>`;
			return output;
			break;
		default:
			return '';
			break;
	}
};

function toggleEvent(elem) {
	let eventId = parseInt(elem.getAttribute('data-eventId'));
	let gameEvent = $.$gameMap.event(eventId);
	if (!gameEvent)
		return;
	
	let isEventRunning = $.Drag.Debugger.isEventRunning(eventId);
	if (isEventRunning) {
		gameEvent.stop();
	} else if (gameEvent._pageIndex > -1) {
		gameEvent.start();
	} else {
		let properPageIndex = gameEvent.findProperPageIndex();
		if (properPageIndex > -1)
			gameEvent.startFrom(properPageIndex, 0);
	}
};

function teleportPlayerTo(elem) {
	let xy = elem.getAttribute('data-xy');
	let [x, y] = xy.split(',').map(Number);
	$.Drag.Debugger.teleportPlayerTo(x, y)
};

function setEventTrigger(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = parseInt(elem.value);
	$.Drag.Debugger.setEventTrigger(eventId, pageId, val);
};

function setEventPriorityType(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = parseInt(elem.value);
	$.Drag.Debugger.setEventPriorityType(eventId, pageId, val);
};

function setEventTransparency(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let val = elem.checked;
	$.Drag.Debugger.setEventTransparency(eventId, val);
};

function setEventErased(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let val = elem.checked;
	$.Drag.Debugger.setEventErased(eventId, val);
};

function setEventWalkAnime(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = elem.checked;
	$.Drag.Debugger.setEventWalkAnime(eventId, pageId, val);
};

function setEventStepAnime(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = elem.checked;
	$.Drag.Debugger.setEventStepAnime(eventId, pageId, val);
};

function setEventDirectionFix(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = elem.checked;
	$.Drag.Debugger.setEventDirectionFix(eventId, pageId, val);
};

function setEventThrough(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = elem.checked;
	$.Drag.Debugger.setEventThrough(eventId, pageId, val);
};

function toggleEventSwitch1(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = elem.checked;
	$.Drag.Debugger.toggleEventSwitch1(eventId, pageId, val);
}; 

function toggleEventSwitch2(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = elem.checked;
	$.Drag.Debugger.toggleEventSwitch2(eventId, pageId, val);
};

function toggleEventVariable1(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = elem.checked;
	$.Drag.Debugger.toggleEventVariable1(eventId, pageId, val);
};

function toggleEventSelfSwitch1(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = elem.checked;
	$.Drag.Debugger.toggleEventSelfSwitch1(eventId, pageId, val);
};

function toggleEventItem1(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = elem.checked;
	$.Drag.Debugger.toggleEventItem1(eventId, pageId, val);
};

function toggleEventActor1(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = elem.checked;
	$.Drag.Debugger.toggleEventActor1(eventId, pageId, val);
};

function changeEventSwitch1Id(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = parseInt(elem.value);
	$.Drag.Debugger.changeEventSwitch1Id(eventId, pageId, val);
}; 			

function changeEventSwitch2Id(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = parseInt(elem.value);
	$.Drag.Debugger.changeEventSwitch2Id(eventId, pageId, val); 
}; 

function changeEventVariable1Id(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = parseInt(elem.value);
	$.Drag.Debugger.changeEventVariable1Id(eventId, pageId, val);
}; 

function changeEventVariable1Value(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = parseInt(elem.value);
	$.Drag.Debugger.changeEventVariable1Value(eventId, pageId, val);
};

function changeEventSelfSwitch1Id(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = elem.value;
	$.Drag.Debugger.changeEventSelfSwitch1Id(eventId, pageId, val);
}; 

function changeEventItem1Id(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = parseInt(elem.value);
	$.Drag.Debugger.changeEventItem1Id(eventId, pageId, val);
}; 

function changeEventActor1Id(elem) {
	let eventId = parseInt(elem.getAttribute("data-eventId"));
	let pageId = parseInt(elem.getAttribute("data-pageId"));
	let val = parseInt(elem.value);
	$.Drag.Debugger.changeEventActor1Id(eventId, pageId, val);
}; 

function showHelpAutoEvStuck(elem) {
	elem.parentNode.nextElementSibling.classList.remove("uncollapsed");
	document.documentElement.style.top = (-(document.documentElement.scrollTop) + 'px');
	document.documentElement.classList.add("noscroll");
};

function hideHelpAutoEvStuck(elem) {
	elem.parentNode.parentNode.classList.add("uncollapsed");
	let scrolltop = (-(parseInt(document.documentElement.style.top)));
	document.documentElement.classList.remove("noscroll");
	window.scrollTo(0, scrolltop);
};

function getTriggerType(trigger) {
	switch (trigger) {
		case 0:
			trigger = "Action Button";
			break;
		case 1:
			trigger = "Player Touch";
			break;
		case 2: 
			trigger = "Event Touch";
			break;
		case 3:
			trigger = "Autorun";
			break;
		case 4: 
			trigger = "Parralel";
			break;
		default:
			trigger = "Action Button";
	}
	return trigger;
};

function getPriorityType(priorityType) {
	switch (priorityType) {
		case 0:
			priorityType = "Below characters";
			break;
		case 1:
			priorityType = "Same as characters";
			break;
		case 2: 
			priorityType = "Above characters";
			break;
	}
	return priorityType;
};