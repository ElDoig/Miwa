function initInterpreter() {
	view.setAttribute('data-view', 'interpreter');
	let viewHTML = getInterpreterViewHeader();
	const mapAvailable = isMapAvailable();
	viewHTML += `
		<div data-mapID="${$.$gameMap.mapId()}" id="content">
			${getMapHeader()}
			<div class="grid2col">
				<div>
					${getEventFilterInput({
						id: 'selectEvent',
						val: 1,
						onchange: 'populateEvent();',
						disabled: !mapAvailable,
						showLabel: true,
						label: 'Select an event :'
					})}
				</div>
			</div>
			<div id="commandList"></div>
		</div>
	`;
	view.innerHTML = viewHTML;
	populateEvent();
};

function getInterpreterViewHeader() {
	return `
		<h1>
			Interpreter 
			
		</h1>`;
};

function populateEvent() {
	let eventId = parseInt(selectEvent.value) || 0;
	if (isMapAvailable() && eventId !== 0) {
		let commandList = document.querySelector('#commandList');
		commandList.setAttribute('eventId', eventId);
		const gameEvent = $.$gameMap.event(eventId);
		if (!gameEvent)
			return;
		const dataEvent = gameEvent.event();
		const eventName = dataEvent.name;
		commandList.innerHTML = `
			${getEventHeader(eventId, eventName)}
			${getEventGeneralInfos(gameEvent, false, true)}
		`;
		populateEventCommands(dataEvent, gameEvent);
	}
};

function populateEventCommands(dataEvent, gameEvent) {
	let commandList = document.querySelector('#commandList');
	const mapInterpreterIndex = $.$gameMap._interpreter._index;
	const mapInterpreterEventId = $.$gameMap._interpreter._eventId;
	const pageRunning = $.Drag.Debugger.getPageRunning(gameEvent.eventId());
	const pages = dataEvent.pages;
	for ([pageId, page] of pages.entries()) {
		commandList.innerHTML += `${getEventElemPageHeader(pageId, gameEvent)}`;
		const pageContainer = document.createElement('div');
		pageContainer.setAttribute('id', 'pageContainer');
		pageContainer.innerHTML = `${getEventElemOptions(pageId, gameEvent, false)}`;
		commandList.appendChild(pageContainer);
		const commandContainer = document.createElement('div');
		commandContainer.setAttribute('id', 'commandContainer');
		commandContainer.setAttribute('data-pageId', pageId);
		pageContainer.appendChild(commandContainer);
		let list = page.list;
		let branches = [];
		let multiLineCommand = 0;
		for ([commandId, command] of list.entries()) {
			let eCommand = createCommand();
			
			eCommand.setAttribute('data-commandCode', command.code);
			eCommand.setAttribute('data-commandIndex', commandId);
			
			if (command.code === 655)
				eCommand.classList.add('hidden');

			if (command.code === 401 || command.code === 405 || command.code === 657)
				eCommand.innerHTML = `<div>${getCommandData(command.code, command.parameters, gameEvent.eventId(), pageId, commandId)}</div>`;
			
			if (command.code === 505 || command.code === 657)
				multiLineCommand = command.code;
			if (multiLineCommand && multiLineCommand !== command.code) {
				multiLineCommand = 0;
				let eBranch = branches.pop();
				if (branches.length > 0)
					branches[branches.length - 1].appendChild(eBranch);
				else
					commandContainer.appendChild(eBranch);
			}	
			
			if (commandId <= mapInterpreterIndex && mapInterpreterEventId === gameEvent.eventId() && pageId === pageRunning)
				eCommand.style.color = "green";
			
			if ((command.code === 0 || command.code === 404 || command.code === 401 || command.code === 405) && branches.length > 0) { 
				if (command.code !== 401 && command.code !== 405)
					eCommand.classList.add('eCommandEmpty');
				let eBranch = branches.pop();
				eBranch.appendChild(eCommand);
				if (branches.length > 0)
					branches[branches.length - 1].appendChild(eBranch);
				else
					commandContainer.appendChild(eBranch);
			} else {
				if (eCommand.innerHTML === "") {
					let commandData = `
						<div>
							${getCommandData(command.code, command.parameters, gameEvent.eventId(), pageId, commandId)}
						</div>`;
					eCommand.innerHTML = commandData;
				}
				if (branches.length > 0)
					branches[branches.length - 1].appendChild(eCommand);
				else
					commandContainer.appendChild(eCommand);
			}
			
			if (command.code === 101 || command.code === 105 || command.code === 102 || command.code === 402 || command.code === 403
			|| command.code === 111 || command.code === 411 || command.code === 112 || command.code === 205 || command.code === 357)
				branches.push(createBranch());
		}
	}
};

function updateInterpreter() {
	const mapAvailable = isMapAvailable();
	if (!mapAvailable) 
		return;
	
	let currentMapId = parseInt(document.querySelector("#content").getAttribute("data-mapID"));
	let mapId = $.$gameMap.mapId();
	if (currentMapId !== mapId) {
		if ($.$dataMap.mapId !== currentMapId && $.$dataMap.mapId > 0)
			initEvents(view);
	} else {						
		let selectEvent = view.querySelector('#selectEvent');
		selectEvent.disabled = !mapAvailable;
		let eventId = parseInt(selectEvent.value) || 0;
		const gameEvent = $.$gameMap.event(eventId);
		if (!gameEvent)
			return;
		const dataEvent = gameEvent.event();
		if (!dataEvent)
			return;
		
		let evPageHeaders = view.querySelectorAll('.evPageHeader');
		for (evPageHeader of evPageHeaders)
			updateEventElemPageHeader(evPageHeader, gameEvent);
		let evInfos = view.querySelectorAll('.evInfos');
		for (evInfo of evInfos)
			updateEventGeneralInfos(evInfo, gameEvent);
		let evOptions = view.querySelectorAll('.evOptions');
		for (evOption of evOptions)
			updateEventElemOptions(evOption, gameEvent, false)
	
		const mapInterpreterEventId = $.$gameMap._interpreter._eventId;
		const pageRunning = $.Drag.Debugger.getPageRunning(gameEvent.eventId());
		const mapInterpreterIndex = $.$gameMap._interpreter._index;
		let evCommandContainers = view.querySelectorAll('#commandContainer');
		for (commandContainer of evCommandContainers) {
			const pageId = parseInt(commandContainer.getAttribute('data-pageId'));
			for (eCommand of commandContainer.querySelectorAll('.eCommand')) {
				const commandIndex = parseInt(eCommand.getAttribute('data-commandIndex'));
				if (mapInterpreterEventId === gameEvent.eventId() && pageId === pageRunning && commandIndex <= mapInterpreterIndex)
					eCommand.classList.add('green');
				else
					eCommand.classList.remove('green');
			}
		}
	}
};

function createCommand() {
	let eCommand = document.createElement('div');
	eCommand.classList.add('eCommand');
	return eCommand;
};

function createBranch() {
	let eBranch = document.createElement('div');
	eBranch.classList.add('eBranch');
	return eBranch;
};

function showEventCommandData(elem) {
	elem.nextElementSibling.classList.remove("uncollapsed");
	document.documentElement.style.top = (-(document.documentElement.scrollTop) + 'px');
	document.documentElement.classList.add("noscroll");
};

function showEventCommandGameData(elem) {
	elem.nextElementSibling.classList.remove("uncollapsed");
};

function hideEventCommandData(elem) {
	elem.parentNode.parentNode.classList.add("uncollapsed");
	let scrolltop = (-(parseInt(document.documentElement.style.top)));
	document.documentElement.classList.remove("noscroll");
	window.scrollTo(0, scrolltop);
	populateEvent();
};

function hideEventCommandGameData(elem) {
	elem.parentNode.parentNode.classList.add("uncollapsed");
};

function changeEventCommandParam(input) {
	const eventId = input.getAttribute('data-eventId');
	const pageId = input.getAttribute('data-pageId');
	const commandIndex = parseInt(input.getAttribute('data-commandIndex'));
	const paramIndex = input.getAttribute('data-paramIndex');
	const valType = input.getAttribute('data-valType');
	let val = input.value;
	if (valType === 'int') {
		let placeholder = parseInt(input.placeholder);
		let min = !isNaN(parseInt(input.min)) ? parseInt(input.min) : -Infinity;
		let max = !isNaN(parseInt(input.max)) ? parseInt(input.max) : Infinity;
		val = parseInt(val);
		if (val < min)
			val = min
		if (val > max)
			val = max;
		val = !isNaN(val) ? val : !isNaN(placeholder) ? placeholder : 0;
	} else if (valType === 'bool') {
		val = input.checked
	} else if (valType === 'arr') {
		$.$gameMap.event(eventId).event().pages[pageId].list[commandIndex].parameters[paramIndex][parseInt(input.getAttribute('data-arrValIndex'))] = val;
	} else if (valType === 'obj') {
		$.$gameMap.event(eventId).event().pages[pageId].list[commandIndex].parameters[paramIndex][input.getAttribute('data-objValProp')] = val;
	} else if (valType === 'script') {
		let nextEventCommandIsScript = true;
		let i = 1;
		while (nextEventCommandIsScript) {
			if ($.$gameMap.event(eventId).event().pages[pageId].list[commandIndex + i] 
				&& $.$gameMap.event(eventId).event().pages[pageId].list[commandIndex + i].code === 655) {
				$.$gameMap.event(eventId).event().pages[pageId].list.splice((commandIndex + i), 1)
				i++;
			} else {
				nextEventCommandIsScript = false;
			}
		}
		$.$gameMap.event(eventId).event().pages[pageId].list[commandIndex].parameters[paramIndex] = val.trim();
	} else {
		$.$gameMap.event(eventId).event().pages[pageId].list[commandIndex].parameters[paramIndex] = val;
	}
}

function startEventFrom(elem) {
	const eventId = parseInt(elem.getAttribute('data-eventId'));
	const pageId = parseInt(elem.getAttribute('data-pageId'));
	const commandIndex = parseInt(elem.getAttribute('data-commandIndex'));
	let gameEvent = $.$gameMap.event(eventId);
	if (gameEvent) {
		const isEventRunning = $.Drag.Debugger.isEventRunning(eventId);
		if (isEventRunning)
			gameEvent.stop();
		gameEvent.startFrom(pageId, commandIndex);
	}
};

//------------------------------------------------------------------------------------------------
//event commands forms

function getCommandDataHeader(commandTitle, commandDataTitle, args) {
	return `
		<span class="block hasEventCommandData" onclick="showEventCommandData(this)">
			${commandTitle}
			<button class="startEventFrom" 
				data-eventId="${args[2]}" data-pageId="${args[3]}" data-commandIndex="${args[4]}" 
				onclick="event.stopPropagation(); startEventFrom(this); updateInterpreter();"
			>
				Start Here
			</button>
		</span>
		<div class="eventCommandData uncollapsed">
			<div class="gridGap15 padding20">
				<h3 class="margin0">${commandDataTitle}</h3>
	`;
};

function getCommandDataFooter() {
	return `
				<span class="closeEventCommandData" onclick="hideEventCommandData(this)"></span>
			</div>
		</div>
	`;
};

function getCommandData(code, params, eventId, pageId, commandIndex) {
	switch (code) {
		//move route
		case 0:
			return 'End';
			break;
		case 1:
			return 'Move Down';
			break;
		case 2:
			return 'Move Left';
			break;
		case 3:
			return 'Move Right';
			break;
		case 4:
			return 'Move Up';
			break;
		case 5:
			return 'Move Lower Left';
			break;
		case 6:
			return 'Move Lower Right';
			break;
		case 7:
			return 'Move Upper Left';
			break;
		case 8:
			return 'Move Upper Right';
			break;
		case 9:
			return 'Move at Random';
			break;
		case 10:
			return 'Move Toward Player';
			break;
		case 11:
			return 'Move Away from Player';
			break;
		case 12:
			return 'Move Forward';
			break;
		case 13:
			return 'Move Backward';
			break;
		case 14:
			return 'Jump';
			break;
		case 15:
			return 'Wait';
			break;
		case 16:
			return 'Turn Down';
			break;
		case 17:
			return 'Turn Left';
			break;
		case 18:
			return 'Turn Right';
			break;
		case 19:
			return 'Turn Up';
			break;
		case 20:
			return 'Turn 90° Right';
			break;
		case 21:
			return 'Turn 90° Left';
			break;
		case 22:
			return 'Turn 180°';
			break;
		case 23:
			return 'Turn 90° Right or Left';
			break;
		case 24:
			return 'Turn at Random';
			break;
		case 25:
			return 'Turn Toward Player';
			break;
		case 26:
			return 'Turn Away from Player';
			break;
		case 27:
			return 'Switch On';
			break;
		case 28:
			return 'Switch Off';
			break;
		case 29:
			return 'Change Speed';
			break;
		case 30:
			return 'Change Frequency';
			break;
		case 31:
			return 'Walking Animation On';
			break;
		case 32:
			return 'Walking Animation Off';
			break;
		case 33:
			return 'Stepping Animation On';
			break;
		case 34:
			return 'Stepping Animation Off';
			break;
		case 35:
			return 'Direction Fix On';
			break;
		case 36:
			return 'Direction Fix Off';
			break;
		case 37:
			return 'Through On';
			break;
		case 38:
			return 'Through Off';
			break;
		case 39:
			return 'Transparent On';
			break;
		case 40:
			return 'Transparent Off';
			break;
		case 41:
			return 'Change Image';
			break;
		case 42:
			return 'Change Opacity';
			break;
		case 43:
			return 'Change Blend Mode';
			break;
		case 44:
			return 'Play SE';
			break;
		case 45:
			return 'Script';
			break;
			
		//event command
		case 101:
			return `
				${getCommandDataHeader(`Show Text${params[4] ? ', ' + params[4] + ' :' : ''}`, `Show Text`, arguments)}
						${ $.Utils.RPGMAKER_NAME === "MZ" ? `
						<div>
							<label for="101name">Name :</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								type="text" id="101name" name="101name" placeholder="Enter a name" value="${params[4]}"
							>
						</div> `
						: `` }
						<div>
							<label for="101background">Background :</label>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
									onchange="changeEventCommandParam(this)"
									name="101background" id="101background"
								>
									<option value="0" ${params[2] === 0 ? 'selected' : ''}>Window</option>
									<option value="1" ${params[2] === 1 ? 'selected' : ''}>Dim</option>
									<option value="2" ${params[2] === 2 ? 'selected' : ''}>Transparent</option>
								</select>
							</div>
						</div>
						<div>
							<label for="101windowpos">Window Position :</label>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
									onchange="changeEventCommandParam(this)"
									name="101windowpos" id="101windowpos"
								>
									<option value="0" ${params[3] === 0 ? 'selected' : ''}>Top</option>
									<option value="1" ${params[3] === 1 ? 'selected' : ''}>Middle</option>
									<option value="2" ${params[3] === 2 ? 'selected' : ''}>Bottom</option>
								</select>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 401:
			return `
				${getCommandDataHeader(`${params[0].replace(/(\r\n|\n\r|\r|\n)/g, '<br>')}`, `Show Text :`, arguments)}
						<div>
							<label for="401text">Text :</label>
							<textarea data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								class="textareaCommandData" id="401text" name="401text" placeholder="Enter text">${params[0]}</textarea>
						</div>
				${getCommandDataFooter()}`; 
			break;
		case 102:
			return `
				${getCommandDataHeader(`Show Choices`, `Show Choices`, arguments)}
						<div>
							<label for="102choices">Choices :</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-arrValIndex="0" data-valType="arr"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								type="text" id="102choices" name="102choices" value="${params[0][0] || ''}"
							>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-arrValIndex="1" data-valType="arr"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								type="text" id="102choices" name="102choices" value="${params[0][1] || ''}"
							>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-arrValIndex="2" data-valType="arr"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								type="text" id="102choices" name="102choices" value="${params[0][2] || ''}"
							>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-arrValIndex="3" data-valType="arr"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								type="text" id="102choices" name="102choices" value="${params[0][3] || ''}"
							>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-arrValIndex="4" data-valType="arr"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								type="text" id="102choices" name="102choices" value="${params[0][4] || ''}"
							>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-arrValIndex="5" data-valType="arr"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								type="text" id="102choices" name="102choices" value="${params[0][5] || ''}"
							>
						</div>
						<div>
							<label for="102background">Background :</label>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
									onchange="changeEventCommandParam(this)"
									name="102background" id="102background"
								>
									<option value="0" ${params[4] === 0 ? 'selected' : ''}>Window</option>
									<option value="1" ${params[4] === 1 ? 'selected' : ''}>Dim</option>
									<option value="2" ${params[4] === 2 ? 'selected' : ''}>Transparent</option>
								</select>
							</div>
						</div>
						<div>
							<label for="102windowpos">Window Position :</label>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
									onchange="changeEventCommandParam(this)"
									name="102windowpos" id="102windowpos"
								>
									<option value="0" ${params[3] === 0 ? 'selected' : ''}>Top</option>
									<option value="1" ${params[3] === 1 ? 'selected' : ''}>Middle</option>
									<option value="2" ${params[3] === 2 ? 'selected' : ''}>Bottom</option>
								</select>
							</div>
						</div>
						<div>
							<label for="102default">Default :</label>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
									onchange="changeEventCommandParam(this)"
									name="102default" id="102default"
								>
									<option value="-1" ${params[2] === -1 ? 'selected' : ''}>None</option>
									<option value="0" ${params[2] === 0 ? 'selected' : ''}>Choice #1</option>
									<option value="1" ${params[2] === 1 ? 'selected' : ''}>Choice #2</option>
									<option value="2" ${params[2] === 2 ? 'selected' : ''}>Choice #3</option>
									<option value="3" ${params[2] === 3 ? 'selected' : ''}>Choice #4</option>
									<option value="4" ${params[2] === 4 ? 'selected' : ''}>Choice #5</option>
									<option value="5" ${params[2] === 5 ? 'selected' : ''}>Choice #6</option>
								</select>
							</div>
						</div>
						<div>
							<label for="102cancel">Cancel :</label>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
									onchange="changeEventCommandParam(this)"
									name="102cancel" id="102cancel"
								>
									<option value="-2" ${params[2] === -2 ? 'selected' : ''}>Branch</option>
									<option value="-1" ${params[2] === -1 ? 'selected' : ''}>Disallow</option>
									<option value="0" ${params[2] === 0 ? 'selected' : ''}>Choice #1</option>
									<option value="1" ${params[2] === 1 ? 'selected' : ''}>Choice #2</option>
									<option value="2" ${params[2] === 2 ? 'selected' : ''}>Choice #3</option>
									<option value="3" ${params[2] === 3 ? 'selected' : ''}>Choice #4</option>
									<option value="4" ${params[2] === 4 ? 'selected' : ''}>Choice #5</option>
									<option value="5" ${params[2] === 5 ? 'selected' : ''}>Choice #6</option>
								</select>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 402:
			return `When ${params[1]} :`;
			break;
		case 403:
			return 'When Cancel :';
			break;
		case 404:
			return 'End';
			break;
		case 103:
			return  `
				${getCommandDataHeader(`Input Number`, `Input Number`, arguments)}
						<div>
							${getVariableFilterInput({
								id: `103var`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `From :`
							})}
						</div>
						<div>
							<label for="103digits">Digits :</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								type="number" min="1" max="8" placeholder="1" id="103digits" name="103digits" value="${params[1]}"
							>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 104:
			return `
				${getCommandDataHeader(`Select Item`, `Select Item`, arguments)}
						<div>
							${getVariableFilterInput({
								id: `104var`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`
							})}
						</div>
						<div>
							<label for="104itemtype">Item Type :</label>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
									onchange="changeEventCommandParam(this)"
									name="104itemtype" id="104itemtype"
								>
									<option value="1" ${params[1] === 1 ? 'selected' : ''}>Regular Item</option>
									<option value="2" ${params[1] === 2 ? 'selected' : ''}>Key Item</option>
									<option value="3" ${params[1] === 3 ? 'selected' : ''}>Hidden Item A</option>
									<option value="4" ${params[1] === 4 ? 'selected' : ''}>Hidden Item B</option>
								</select>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 105:
			return `
				${getCommandDataHeader(`Show Scrolling Text`, `Show Scrolling Text`, arguments)}
						<div>
							<label for="105speed">Speed :</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								type="number" min="1" max="8" placeholder="1" id="105speed" name="105speed" value="${params[0]}"
							>
						</div>
						<div>
							<label for="105fastforward" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="105fastforward" name="105fastforward" ${params[1] === true ? 'checked' : ''}
								>
								No Fast Forward
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 405:
			return `
				${getCommandDataHeader(`${params[0].replace(/(\r\n|\n\r|\r|\n)/g, '<br>')}`, `Show Text :`, arguments)}
						<div>
							<label for="405text">Text :</label>
							<textarea data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								class="textareaCommandData" id="405text" name="405text" placeholder="Enter text">${params[0]}</textarea>
						</div>
				${getCommandDataFooter()}`; 
			break;
		case 108:
			return `Comment :<i> ${params[0]}</i>`;
			break;
		case 408:
			return `Comment :<i> ${params[0]}</i>`;
			break;
		case 111:
			return 'Conditional Branch';
			break;
		case 411:
			return 'Else';
			break;
		case 412:
			return 'End Conditional Branch';
			break;
		case 112:
			return 'Loop';
			break;
		case 413:
			return 'Repeat Above';
			break;
		case 113:
			return 'Break Loop';
			break;
		case 115:
			return 'Exit Event Processing';
			break;
		case 117:
			return `
				${getCommandDataHeader(`Common Event:<i> #${params[0]} ${$.$dataCommonEvents[params[0]].name}</i>`, `>Common Event`, arguments)}
						<div>
							${getCommonEventFilterInput({
								id: `117commonevent`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Common Event :`
							})}
						</div>
				${getCommandDataFooter()}`;
			break;
		case 118:
			return `Label : <i>${params[0]}</i>`;
			break;
		case 119:
			return `Jump to Label : <i>${params[0]}</i>`;
			break;
		case 121:
			return `
				${getCommandDataHeader(`Control Switches`, `Control Switches`, arguments)}
						<div>
							${getSwitchFilterInput({
								id: `121switch1`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `From :`
							})}
						</div>
						<div>
							${getSwitchFilterInput({
								id: `121switch2`, 
								val: params[1], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `To : <span class="fSize12">(must be >= to previous switch)`
							})}
						</div>
						<div>
							<p class="margin0">Operation : </p>		
							<div class="textCenter grid2col">
								<div>
									<label class="block" for="121operationon">ON</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
										onchange="changeEventCommandParam(this)" 
										type="radio" id="121operationon" name="121operationp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
									>
								</div>
								<div>
									<label class="block" for="121operationoff">OFF</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
										onchange="changeEventCommandParam(this)" 
										type="radio" id="121operationoff" name="121operationp${pageId}c${commandIndex}" value="1" ${params[2] !== 0 ? 'checked' : ''}
									>
								</div>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 122:
			return `
				${getCommandDataHeader(`Control Variables`, `Control Variables`, arguments)}
						<div>
							${getVariableFilterInput({
								id: `122var1`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `From :`
							})}
						</div>
						<div>
							${getVariableFilterInput({
								id: `122var2`, 
								val: params[1], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `To : <span class="fSize12">(must be >= to previous var)`
							})}
						</div>
						<div>
							<p class="margin0">Operation : </p>		
							<div class="textCenter customGrid" style="--grid-col-nb: 6; --grid-row-nb: 1;">
								<div>
									<label class="block" for="122operationset">Set</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
										onchange="changeEventCommandParam(this)" 
										type="radio" id="122operationset" name="122operationp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
									>
								</div>
								<div>
									<label class="block" for="122operationadd">Add</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
										onchange="changeEventCommandParam(this)" 
										type="radio" id="122operationadd" name="122operationp${pageId}c${commandIndex}" value="1" ${params[2] === 1 ? 'checked' : ''}
									>
								</div>
								<div>
									<label class="block" for="122operationsub">Sub</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
										onchange="changeEventCommandParam(this)" 
										type="radio" id="122operationsub" name="122operationp${pageId}c${commandIndex}" value="2" ${params[2] === 2 ? 'checked' : ''}
									>
								</div>
								<div>
									<label class="block" for="122operationmul">Mul</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
										onchange="changeEventCommandParam(this)" 
										type="radio" id="122operationmul" name="122operationp${pageId}c${commandIndex}" value="3" ${params[2] === 3 ? 'checked' : ''}
									>
								</div>
								<div>
									<label class="block" for="122operationdiv">Div</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
										onchange="changeEventCommandParam(this)" 
										type="radio" id="122operationdiv" name="122operationp${pageId}c${commandIndex}" value="4" ${params[2] === 4 ? 'checked' : ''}
									>
								</div>
								<div>
									<label class="block" for="122operationmod">Mod</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
										onchange="changeEventCommandParam(this)" 
										type="radio" id="122operationmod" name="122operationp${pageId}c${commandIndex}" value="5" ${params[2] === 5 ? 'checked' : ''}
									>
								</div>
							</div>
						</div>
						<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<p class="margin0 mBottom025">Operand : </p>		
								<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 5; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
									<div class="gridColGap5 gridColMinMax alignItemsCenter">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122const');" ondeselect="toggleLinkedInput(this, '122const');" 
											type="radio" id="122operandconst" name="122operandp${pageId}c${commandIndex}" value="0" ${params[3] === 0 ? 'checked' : ''}
										>
										<label for="122operandconst">Constant</label>
									</div>
									<div class="gridColGap5 gridColMinMax alignItemsCenter">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122var');" ondeselect="toggleLinkedInput(this, '122var');" 
											type="radio" id="122operandvar" name="122operandp${pageId}c${commandIndex}" value="1" ${params[3] === 1 ? 'checked' : ''}
										>
										<label for="122operandvar">Variable</label>
									</div>
									<div class="gridColGap5 gridColMinMax alignItemsCenter">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122randmin'); toggleLinkedInput(this, '122randmax');" ondeselect="toggleLinkedInput(this, '122randmin'); toggleLinkedInput(this, '122randmax');"
											type="radio" id="122operandrand" name="122operandp${pageId}c${commandIndex}" value="2" ${params[3] === 2 ? 'checked' : ''}
										>
										<label for="122operandrand">Random</label>
									</div>
									<div class="gridColGap5 gridColMinMax alignItemsCenter">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122data');" ondeselect="toggleLinkedInput(this, '122data');" 
											type="radio" id="122operanddata" name="122operandp${pageId}c${commandIndex}" value="3" ${params[3] === 3 ? 'checked' : ''}
										>
										<label for="122operanddata">Game Data</label>
									</div>
									<div class="gridColGap5 gridColMinMax alignItemsCenter">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122script');" ondeselect="toggleLinkedInput(this, '122script');" 
											type="radio" id="122operandscript" name="122operandp${pageId}c${commandIndex}" value="4" ${params[3] === 4 ? 'checked' : ''}
										>
										<label for="122operandscript">Script</label>
									</div>
								</div>
							</form>
							<div>
								<p class="margin0 mBottom025 whiteSpacePreWrap"> </p>
								<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 5;">
									<div>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
											onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
											type="number" placeholder="0" id="122const" name="122const" value="${params[4]}" ${params[3] !== 0 ? 'disabled' : ''}
										>
									</div>
									${getVariableFilterInput({
										id: `122var`, 
										val: params[4], 
										data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"`, 
										onchange: `changeEventCommandParam(this);`,
										disabled: params[3] !== 1
									})}
									<div class="customGrid" style="--grid-col-nb: 2; --grid-row-nb: 1;">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
											onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
											type="number" placeholder="0" id="122randmin" name="122randmin" value="${params[4]}" ${params[3] !== 2 ? 'disabled' : ''}
										>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"
											onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
											type="number" placeholder="0" id="122randmax" name="122randmax" value="${params[5] || 0}" ${params[3] !== 2 ? 'disabled' : ''}
										>
									</div>
									<div>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4"
											onclick="showEventCommandGameData(this)"
											type="text" id="122data" name="122data" value="${params[4]}" placeholder="0" ${params[3] !== 3 ? 'disabled' : ''}
										/>
										<div class="eventCommandGameData uncollapsed">
											<div class="gridGap15 padding20">
												<h3 class="margin0">Game Data</h3>
												<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
													<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
														<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 9; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
															<div class="gridColGap5 gridColMinMax alignItemsCenter">
																<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
																	onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122dataitem');" ondeselect="toggleLinkedInput(this, '122dataitem');" 
																	type="radio" id="122datatypeitem" name="122datatypep${pageId}c${commandIndex}" value="0" ${params[4] === 0 ? 'checked' : ''}
																>
																<label for="122datatypeitem">Item</label>
															</div>
															<div class="gridColGap5 gridColMinMax alignItemsCenter">
																<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
																	onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122dataweapon');" ondeselect="toggleLinkedInput(this, '122dataweapon');" 
																	type="radio" id="122datatypeweapon" name="122datatypep${pageId}c${commandIndex}" value="1" ${params[4] === 1 ? 'checked' : ''}
																>
																<label for="122datatypeweapon">Weapon</label>
															</div>
															<div class="gridColGap5 gridColMinMax alignItemsCenter">
																<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
																	onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122dataarmor');" ondeselect="toggleLinkedInput(this, '122dataarmor');" 
																	type="radio" id="122datatypearmor" name="122datatypep${pageId}c${commandIndex}" value="2" ${params[4] === 2 ? 'checked' : ''}
																>
																<label for="122datatypearmor">Armor</label>
															</div>
															<div class="gridColGap5 gridColMinMax alignItemsCenter">
																<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
																	onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122dataactor'); toggleLinkedInput(this, '122dataactorcarac');" ondeselect="toggleLinkedInput(this, '122dataactor'); toggleLinkedInput(this, '122dataactorcarac');"
																	type="radio" id="122datatypeactor" name="122datatypep${pageId}c${commandIndex}" value="3" ${params[4] === 3 ? 'checked' : ''}
																>
																<label for="122datatypeactor">Actor</label>
															</div>
															<div class="gridColGap5 gridColMinMax alignItemsCenter">
																<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
																	onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122dataenemy'); toggleLinkedInput(this, '122dataenemycarac');" ondeselect="toggleLinkedInput(this, '122dataenemy'); toggleLinkedInput(this, '122dataenemycarac');"
																	type="radio" id="122datatypeenemy" name="122datatypep${pageId}c${commandIndex}" value="4" ${params[4] === 4 ? 'checked' : ''}
																>
																<label for="122datatypeenemy">Enemy</label>
															</div>
															<div class="gridColGap5 gridColMinMax alignItemsCenter">
																<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
																	onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122datacharacter'); toggleLinkedInput(this, '122datacharactercarac');" ondeselect="toggleLinkedInput(this, '122datacharacter'); toggleLinkedInput(this, '122datacharactercarac');"
																	type="radio" id="122datatypecharacter" name="122datatypep${pageId}c${commandIndex}" value="5" ${params[4] === 5 ? 'checked' : ''}
																>
																<label for="122datatypecharacter">Character</label>
															</div>
															<div class="gridColGap5 gridColMinMax alignItemsCenter">
																<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
																	onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122dataparty');" ondeselect="toggleLinkedInput(this, '122dataparty');" 
																	type="radio" id="122datatypeparty" name="122datatypep${pageId}c${commandIndex}" value="6" ${params[4] === 6 ? 'checked' : ''}
																>
																<label for="122datatypeparty">Party</label>
															</div>
															${ $.Utils.RPGMAKER_NAME === "MZ" ? `
															<div class="gridColGap5 gridColMinMax alignItemsCenter">
																<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
																	onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122datalast');" ondeselect="toggleLinkedInput(this, '122datalast');" 
																	type="radio" id="122datatypelast" name="122datatypep${pageId}c${commandIndex}" value="8" ${params[4] === 8 ? 'checked' : ''}
																>
																<label for="122datatypelast">Last</label>
															</div>
															` : ``}
															<div class="gridColGap5 gridColMinMax alignItemsCenter">
																<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
																	onchange="changeEventCommandParam(this); toggleLinkedInput(this, '122dataother');" ondeselect="toggleLinkedInput(this, '122dataother');" 
																	type="radio" id="122datatypeother" name="122datatypep${pageId}c${commandIndex}" value="7" ${params[4] === 7 ? 'checked' : ''}
																>
																<label for="122datatypeother">Other</label>
															</div>
														</div>
													</form>
													<div>
														<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 9; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
															${getItemFilterInput({
																id: `122dataitem`, 
																val: params[5], 
																data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"`, 
																onchange: `changeEventCommandParam(this);`,
																disabled: params[4] !== 0
															})}
															${getWeaponFilterInput({
																id: `122dataweapon`, 
																val: params[5], 
																data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"`, 
																onchange: `changeEventCommandParam(this);`,
																disabled: params[4] !== 1
															})}
															${getArmorFilterInput({
																id: `122dataarmor`, 
																val: params[5], 
																data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"`, 
																onchange: `changeEventCommandParam(this);`,
																disabled: params[4] !== 2
															})}
															<div class="customGrid" style="--grid-col-nb: 2; --grid-row-nb: 1;">
																${getActorFilterInput({
																	id: `122dataactor`, 
																	val: params[5], 
																	data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"`, 
																	onchange: `changeEventCommandParam(this);`,
																	disabled: params[4] !== 3,
																	smallWrap: true
																})}
																<div class="select">
																	<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="6" data-valType="int"
																		onchange="changeEventCommandParam(this)"
																		name="122dataactorcarac" id="122dataactorcarac" ${params[4] !== 3 ? 'disabled' : ''}
																	>
																		<option value="0" ${params[6] === 0 ? 'selected' : ''}>Level</option>
																		<option value="1" ${params[6] === 1 ? 'selected' : ''}>EXP</option>
																		<option value="2" ${params[6] === 2 ? 'selected' : ''}>HP</option>
																		<option value="3" ${params[6] === 3 ? 'selected' : ''}>MP</option>
																		<option value="4" ${params[6] === 4 ? 'selected' : ''}>Max HP</option>
																		<option value="5" ${params[6] === 5 ? 'selected' : ''}>Max MP</option>
																		<option value="6" ${params[6] === 6 ? 'selected' : ''}>Attack</option>
																		<option value="7" ${params[6] === 7 ? 'selected' : ''}>Defense</option>
																		<option value="8" ${params[6] === 8 ? 'selected' : ''}>M.Attack</option>
																		<option value="9" ${params[6] === 9 ? 'selected' : ''}>M.Defense</option>
																		<option value="10" ${params[6] === 10 ? 'selected' : ''}>Agility</option>
																		<option value="11" ${params[6] === 11 ? 'selected' : ''}>Luck</option>
																		${ $.Utils.RPGMAKER_NAME === "MZ" ? `
																		<option value="12" ${params[6] === 12 ? 'selected' : ''}>TP</option>
																		` : ``}
																	</select>
																</div>
															</div>
															<div class="customGrid" style="--grid-col-nb: 2; --grid-row-nb: 1;">
																${getEnemyFilterInput({
																	id: `122dataenemy`, 
																	val: params[5], 
																	data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"`, 
																	onchange: `changeEventCommandParam(this);`,
																	disabled: params[4] !== 4
																})}
																<div class="select">
																	<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="6" data-valType="int"
																		onchange="changeEventCommandParam(this)"
																		name="122dataenemycarac" id="122dataenemycarac" ${params[4] !== 4 ? 'disabled' : ''}
																	>
																		<option value="0" ${params[6] === 0 ? 'selected' : ''}>HP</option>
																		<option value="1" ${params[6] === 1 ? 'selected' : ''}>MP</option>
																		<option value="2" ${params[6] === 2 ? 'selected' : ''}>Max HP</option>
																		<option value="3" ${params[6] === 3 ? 'selected' : ''}>Max MP</option>
																		<option value="4" ${params[6] === 4 ? 'selected' : ''}>Attack</option>
																		<option value="5" ${params[6] === 5 ? 'selected' : ''}>Defense</option>
																		<option value="6" ${params[6] === 6 ? 'selected' : ''}>M.Attack</option>
																		<option value="7" ${params[6] === 7 ? 'selected' : ''}>M.Defense</option>
																		<option value="8" ${params[6] === 8 ? 'selected' : ''}>Agility</option>
																		<option value="9" ${params[6] === 9 ? 'selected' : ''}>Luck</option>
																		${ $.Utils.RPGMAKER_NAME === "MZ" ? `
																		<option value="10" ${params[6] === 10 ? 'selected' : ''}>TP</option>
																		` : ``}
																	</select>
																</div>
															</div>
															<div class="customGrid" style="--grid-col-nb: 2; --grid-row-nb: 1;">
																${getEventFilterInput({
																	id: `122datacharacter`, 
																	val: params[5], 
																	data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"`, 
																	onchange: `changeEventCommandParam(this);`,
																	disabled: params[4] !== 5,
																	smallWrap: true,
																	includeThisEvent: true,
																	includePlayer: true
																})}
																<div class="select">
																	<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="6" data-valType="int"
																		onchange="changeEventCommandParam(this)"
																		name="122datacharactercarac" id="122datacharactercarac" ${params[4] !== 5 ? 'disabled' : ''}
																	>
																		<option value="0" ${params[6] === 0 ? 'selected' : ''}>Map X</option>
																		<option value="1" ${params[6] === 1 ? 'selected' : ''}>Map Y</option>
																		<option value="2" ${params[6] === 2 ? 'selected' : ''}>Direction</option>
																		<option value="3" ${params[6] === 3 ? 'selected' : ''}>Screen X</option>
																		<option value="4" ${params[6] === 4 ? 'selected' : ''}>Screen Y</option>
																	</select>
																</div>
															</div>
															<div class="select">
																<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"
																	onchange="changeEventCommandParam(this)"
																	name="122dataparty" id="122dataparty" ${params[4] !== 6 ? 'disabled' : ''}
																>
																	<option value="0" ${params[5] === 0 ? 'selected' : ''}>Member #1 (Actor ID)</option>
																	<option value="1" ${params[5] === 1 ? 'selected' : ''}>Member #2 (Actor ID)</option>
																	<option value="2" ${params[5] === 2 ? 'selected' : ''}>Member #3 (Actor ID)</option>
																	<option value="3" ${params[5] === 3 ? 'selected' : ''}>Member #4 (Actor ID)</option>
																	<option value="4" ${params[5] === 4 ? 'selected' : ''}>Member #5 (Actor ID)</option>
																	<option value="5" ${params[5] === 5 ? 'selected' : ''}>Member #6 (Actor ID)</option>
																	<option value="6" ${params[5] === 6 ? 'selected' : ''}>Member #7 (Actor ID)</option>
																	<option value="7" ${params[5] === 7 ? 'selected' : ''}>Member #8 (Actor ID)</option>
																</select>
															</div>
															${ $.Utils.RPGMAKER_NAME === "MZ" ? `
															<div class="select">
																<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"
																	onchange="changeEventCommandParam(this)"
																	name="122datalast" id="122datalast" ${params[4] !== 8 ? 'disabled' : ''}
																>
																	<option value="0" ${params[5] === 0 ? 'selected' : ''}>Last Used Skill ID</option>
																	<option value="1" ${params[5] === 1 ? 'selected' : ''}>Last Used Item ID</option>
																	<option value="2" ${params[5] === 2 ? 'selected' : ''}>Last Actor ID to Act</option>
																	<option value="3" ${params[5] === 3 ? 'selected' : ''}>Last Enemy Index to Act</option>
																	<option value="4" ${params[5] === 4 ? 'selected' : ''}>Last Target Actor ID</option>
																	<option value="5" ${params[5] === 5 ? 'selected' : ''}>Last Target Enemy Index</option>
																</select>
															</div>
															` : ``}
															<div class="select">
																<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"
																	onchange="changeEventCommandParam(this)"
																	name="122dataother" id="122dataother" ${params[4] !== 7 ? 'disabled' : ''}
																>
																	<option value="0" ${params[5] === 0 ? 'selected' : ''}>Map ID</option>
																	<option value="1" ${params[5] === 1 ? 'selected' : ''}>Party Members</option>
																	<option value="2" ${params[5] === 2 ? 'selected' : ''}>Gold</option>
																	<option value="3" ${params[5] === 3 ? 'selected' : ''}>Steps</option>
																	<option value="4" ${params[5] === 4 ? 'selected' : ''}>Play Time</option>
																	<option value="5" ${params[5] === 5 ? 'selected' : ''}>Timer</option>
																	<option value="6" ${params[5] === 6 ? 'selected' : ''}>Save Count</option>
																	<option value="7" ${params[5] === 7 ? 'selected' : ''}>Battle Count</option>
																	<option value="8" ${params[5] === 8 ? 'selected' : ''}>Win Count</option>
																	<option value="9" ${params[5] === 9 ? 'selected' : ''}>Escape Count</option>
																</select>
															</div>
														</div>
													</div>
												</div>
												<span class="closeEventCommandGameData" onclick="hideEventCommandGameData(this)"></span>
											</div>
										</div>
									</div>
									<div>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4"
											onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
											type="text" placeholder="0" id="122script" name="122script" value="${params[4]}" ${params[3] !== 4 ? 'disabled' : ''}
										>
									</div>
								</div>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 123:
			return `
				${getCommandDataHeader(`Control Self Switch`, `Control Self Switch`, arguments)}
						<div>
							<p class="margin0">Self Switch : </p>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0"
									onfocus="updateSelfSwitchConditionOptionsColours(this);" onchange="changeEventCommandParam(this)" 
									id="123selfswitch" name="123selfswitch"
								>
									<option value="A" ${params[0] === "A" ? 'selected="selected"' : ''}>A</option>
									<option value="B" ${params[0] === "B" ? 'selected="selected"' : ''}>B</option>
									<option value="C" ${params[0] === "C" ? 'selected="selected"' : ''}>C</option>
									<option value="D" ${params[0] === "D" ? 'selected="selected"' : ''}>D</option>
								</select>
								<span class="focus"></span>
							</div>
						</div>
						<div>
							<p class="margin0">Operation : </p>
							<div class="textCenter grid2col">
								<div>
									<label class="block" for="123operationon">ON</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
										onchange="changeEventCommandParam(this);" 
										type="radio" id="123operationon" name="123operationp${pageId}c${commandIndex}" value="0" ${params[1] === 0 ? 'checked' : ''}
									>
								</div>
								<div>
									<label class="block" for="123operationoff">OFF</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
										onchange="changeEventCommandParam(this)" 
										type="radio" id="123operationoff" name="123operationp${pageId}c${commandIndex}" value="1" ${params[1] !== 0 ? 'checked' : ''}
									>
								</div>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 124:
			return `
				${getCommandDataHeader(`Control Timer`, `Control Timer`, arguments)}
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="124operationon">Start</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '124time');" ondeselect="toggleLinkedInput(this, '124time');" 
											type="radio" id="124operationon" name="124operationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="124operationoff">Stop</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="124operationoff" name="124operationp${pageId}c${commandIndex}" value="1" ${params[0] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Time :</p>		
							<div>
								<label class="block" for="124time">Second</label>
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
									onchange="changeEventCommandParam(this)" 
									type="number" min="0" id="124time" name="124time" value="${params[1]}" ${params[0] !== 0 ? 'disabled' : ''}
								>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 125:
			return `
				${getCommandDataHeader(`Change Gold`, `Change Gold`, arguments)}
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="125operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="125operationinc" name="125operationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="125operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="125operationdec" name="125operationp${pageId}c${commandIndex}" value="1" ${params[0] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '125const');" ondeselect="toggleLinkedInput(this, '125const');" 
												type="radio" id="125operandconst" name="125operandp${pageId}c${commandIndex}" value="0" ${params[1] === 0 ? 'checked' : ''}
											>
											<label for="125operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '125var');" ondeselect="toggleLinkedInput(this, '125var');" 
												type="radio" id="125operandvar" name="125operandp${pageId}c${commandIndex}" value="1" ${params[1] === 1 ? 'checked' : ''}
											>
											<label for="125operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="125const" name="125const" value="${params[2]}" ${params[1] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `125var`, 
											val: params[2], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[1] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 126:
			return `
				${getCommandDataHeader(`Change Items`, `Change Items`, arguments)}
						${getItemFilterInput({
							id: `126item`, 
							val: params[0], 
							data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
							onchange: `changeEventCommandParam(this);`,
							showLabel: true,
							label: `Item :`
						})}
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="126operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="126operationinc" name="126operationp${pageId}c${commandIndex}" value="0" ${params[1] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="126operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="126operationdec" name="126operationp${pageId}c${commandIndex}" value="1" ${params[1] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '126const');" ondeselect="toggleLinkedInput(this, '126const');" 
												type="radio" id="126operandconst" name="126operandp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
											>
											<label for="126operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '126var');" ondeselect="toggleLinkedInput(this, '126var');" 
												type="radio" id="126operandvar" name="126operandp${pageId}c${commandIndex}" value="1" ${params[2] === 1 ? 'checked' : ''}
											>
											<label for="126operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="126const" name="126const" value="${params[3]}" ${params[2] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `126var`, 
											val: params[3], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[2] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 127:
			return `
				${getCommandDataHeader(`Change Weapons`, `Change Weapons`, arguments)}
						${getWeaponFilterInput({
							id: `127weapon`, 
							val: params[0], 
							data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
							onchange: `changeEventCommandParam(this);`,
							showLabel: true,
							label: `Weapon :`
						})}
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="127operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="127operationinc" name="127operationp${pageId}c${commandIndex}" value="0" ${params[1] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="127operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '127includeequip');" ondeselect="toggleLinkedInput(this, '127includeequip');"  
											type="radio" id="127operationdec" name="127operationp${pageId}c${commandIndex}" value="1" ${params[1] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '127const');" ondeselect="toggleLinkedInput(this, '127const');" 
												type="radio" id="127operandconst" name="127operandp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
											>
											<label for="127operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '127var');" ondeselect="toggleLinkedInput(this, '127var');" 
												type="radio" id="127operandvar" name="127operandp${pageId}c${commandIndex}" value="1" ${params[2] === 1 ? 'checked' : ''}
											>
											<label for="127operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="127const" name="127const" value="${params[3]}" ${params[2] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `127var`, 
											val: params[3], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[2] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
						<div>
							<label for="127includeequip" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="127includeequip" name="127includeequip" ${params[4] === true ? 'checked' : ''} ${params[1] !== 0 ? '' : 'disabled'}
								>
								Include Equipment
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 128:
			return `
				${getCommandDataHeader(`Change Armors`, `Change Armors`, arguments)}
						${getArmorFilterInput({
							id: `128armor`, 
							val: params[0], 
							data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
							onchange: `changeEventCommandParam(this);`,
							showLabel: true,
							label: `Armor :`
						})}
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="128operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="128operationinc" name="128operationp${pageId}c${commandIndex}" value="0" ${params[1] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="128operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '128includeequip');" ondeselect="toggleLinkedInput(this, '128includeequip');"  
											type="radio" id="128operationdec" name="128operationp${pageId}c${commandIndex}" value="1" ${params[1] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '128const');" ondeselect="toggleLinkedInput(this, '128const');" 
												type="radio" id="128operandconst" name="128operandp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
											>
											<label for="128operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '128var');" ondeselect="toggleLinkedInput(this, '128var');" 
												type="radio" id="128operandvar" name="128operandp${pageId}c${commandIndex}" value="1" ${params[2] === 1 ? 'checked' : ''}
											>
											<label for="128operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="128const" name="128const" value="${params[3]}" ${params[2] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `128var`, 
											val: params[3], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[2] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
						<div>
							<label for="128includeequip" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="128includeequip" name="128includeequip" ${params[4] === true ? 'checked' : ''} ${params[1] !== 0 ? '' : 'disabled'}
								>
								Include Equipment
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 129:
			return `
				${getCommandDataHeader(`Change Party Member`, `Change Party Member`, arguments)}
						${getActorFilterInput({
							id: `129actor`, 
							val: params[0], 
							data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
							onchange: `changeEventCommandParam(this);`,
							showLabel: true,
							label: `Actor :`
						})}
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="129operationadd">Add</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '129initialize');" ondeselect="toggleLinkedInput(this, '129initialize');"  
											type="radio" id="129operationadd" name="129operationp${pageId}c${commandIndex}" value="0" ${params[1] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="129operationremove">remove</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="129operationremove" name="129operationp${pageId}c${commandIndex}" value="1" ${params[1] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<label for="129initialize" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="129initialize" name="129initialize" ${params[2] === true ? 'checked' : ''} ${params[1] !== 0 ? 'disabled' : ''}
								>
								Initialize
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 132:
			let files = $.Drag.Debugger.getFilesByExtension('./audio/bgm/', 'ogg');
			let list = `
				<div class="audioSelect customGrid insetShadow30 bRadius10" style="--grid-col-nb: 1; overflow-y: auto;">
					<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="obj" data-objValProp="name"
						onchange="changeEventCommandParam(this);"
						type="radio" class="hiddenRadio" id="132filename" name="132filenamep${pageId}c${commandIndex}" value="" ${params[0].name === "" ? 'checked' : ''}
					>
			`;
			for (file of files) {
				list += `
					<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="obj" data-objValProp="name"
						onchange="changeEventCommandParam(this);"
						type="radio" class="hiddenRadio" id="132filename" name="132filenamep${pageId}c${commandIndex}" value="${file}" ${params[0].name === file ? 'checked' : ''}
					>
				`;
			}
			list += '</div>';
			return `
				${getCommandDataHeader(`Change Battle BGM`, `Change Battle BGM`, arguments)}
				<div class="customGrid gridColGap10" style="--grid-col-nb: 2; max-height: 35%;">
					${list}
					<form class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 5; grid-template-rows: 40px 50px 1fr 1fr 1fr;"
						onchange="updateBgm(this);"
					>
						<div class="textCenter">
							<button type="button" id="largeButton" onclick="playBGM(this);">Play</button>
						</div>
						<div class="textCenter">
							<button type="button" id="largeButton" onclick="stopBGM()">Stop</button>
						</div>
						<div class="textCenter bRadius20 insetShadow30 vFlexCenter">
							<label class="bold" for="132volume">Volume</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="obj" data-objValProp="volume"
								oninput="updateOutputValue(this, ' %');" onchange="changeEventCommandParam(this);"
								type="range" id="132volume" name="132volume" min="0" max="100" value="${params[0].volume}" step="1" 
							>
							<output>${params[0].volume} %</output>
						</div>
						<div class="textCenter bRadius20 insetShadow30 vFlexCenter">
							<label class="bold" for="132pitch">Pitch</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="obj" data-objValProp="pitch"
								oninput="updateOutputValue(this, ' %');" onchange="changeEventCommandParam(this);"
								type="range" id="132pitch" name="132pitch" min="50" max="150" value="${params[0].pitch}" step="1"
							>
							<output>${params[0].pitch} %</output>
						</div>
						<div class="textCenter bRadius20 insetShadow30 vFlexCenter">
							<label class="bold" for="132pan">Pan</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="obj" data-objValProp="pan"
								oninput="updateOutputValue(this);" onchange="changeEventCommandParam(this);"
								type="range" id="132pan" name="132pan" min="-100" max="100" value="${params[0].pan}" step="1"
							>
							<output>${params[0].pan}</output>
						</div>
					</form>
				</div>
				${getCommandDataFooter()}`;
			break;
		case 133:
			return 'Change Victory ME';
			break;
		case 134:
			return `
				${getCommandDataHeader(`Change Save Access`, `Change Save Access`, arguments)}
						<div>
							<p class="margin0">Save :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="134savedisabled">Disable</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="134savedisabled" name="134savep${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="134saveenabled">Enable</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"  
											type="radio" id="134saveenabled" name="134savep${pageId}c${commandIndex}" value="1" ${params[0] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 135:
			return `
				${getCommandDataHeader(`Change Menu Access`, `Change Menu Access`, arguments)}
						<div>
							<p class="margin0">Menu :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="135menudisabled">Disable</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="135menudisabled" name="135menup${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="135menuenabled">Enable</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"  
											type="radio" id="135menuenabled" name="135menup${pageId}c${commandIndex}" value="1" ${params[0] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 136:
			return `
				${getCommandDataHeader(`Change Encounter`, `Change Encounter`, arguments)}
						<div>
							<p class="margin0">Encounter :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="136encounterdisabled">Disable</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="136encounterdisabled" name="136encounterp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="136encounterenabled">Enable</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"  
											type="radio" id="136encounterenabled" name="136encounterp${pageId}c${commandIndex}" value="1" ${params[0] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 137:
			return `
				${getCommandDataHeader(`Change Formation Access`, `Change Formation Access`, arguments)}
						<div>
							<p class="margin0">Formation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="137formationdisabled">Disable</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="137formationdisabled" name="137formationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="137formationenabled">Enable</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"  
											type="radio" id="137formationenabled" name="137formationp${pageId}c${commandIndex}" value="1" ${params[0] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 138:
			return 'Change Window Color';
			break;
		case 139:
			return 'Change Defeat ME';
			break;
		case 140:
			return 'Change Vehicle BGM';
			break;
		case 201:
			return 'Transfer Player';
			break;
		case 202:
			return 'Set Vehicle Location';
			break;
		case 203:
			return 'Set Event Location';
			break;
		case 204:
			return `
				${getCommandDataHeader(`Scroll Map`, `Scroll Map`, arguments)}
						<div>
							<p class="margin0">Direction : </p>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
									onchange="changeEventCommandParam(this)" 
									id="204scrollmapdir" name="204scrollmapdir"
								>
									<option value="2" ${params[0] === "2" ? 'selected="selected"' : ''}>Down</option>
									<option value="4" ${params[0] === "4" ? 'selected="selected"' : ''}>Left</option>
									<option value="6" ${params[0] === "6" ? 'selected="selected"' : ''}>Right</option>
									<option value="8" ${params[0] === "8" ? 'selected="selected"' : ''}>Up</option>
								</select>
								<span class="focus"></span>
							</div>
						</div>
						<div>
							<label for="204scrollmapdist">Distance :</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								min="0" max="100" type="number" placeholder="0" id="204scrollmapdist" name="204scrollmapdist" value="${params[1]}"
							>
						</div>
						<div>
							<p class="margin0">Speed : </p>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
									onchange="changeEventCommandParam(this)" 
									id="204scrollmapspeed" name="204scrollmapspeed"
								>
									<option value="1" ${params[0] === "1" ? 'selected="selected"' : ''}>1: x8 Slower</option>
									<option value="2" ${params[0] === "2" ? 'selected="selected"' : ''}>2: x4 Slower</option>
									<option value="3" ${params[0] === "3" ? 'selected="selected"' : ''}>3: x2 Slower</option>
									<option value="4" ${params[0] === "4" ? 'selected="selected"' : ''}>4: Normal</option>
									<option value="5" ${params[0] === "5" ? 'selected="selected"' : ''}>5: x2 Faster</option>
									<option value="6" ${params[0] === "6" ? 'selected="selected"' : ''}>6: x4 Faster</option>
								</select>
								<span class="focus"></span>
							</div>
						</div>
						${ $.Utils.RPGMAKER_NAME === "MZ" ? `
						<div>
							<label for="204waitforcompletion" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="204waitforcompletion" name="204waitforcompletion" ${params[3] === true ? 'checked' : ''}
								>
								Wait for Completion
							</label>
						</div>
						` : ``}
				${getCommandDataFooter()}`;
			break;
		case 205:
			return 'Set Movement Route';
			break;
		case 505:
			return getCommandData(params[0].code);
			break;
		case 206:
			return 'Get on/off Vehicle';
			break;
		case 211:
			return `
				${getCommandDataHeader(`Change Transparency`, `Change Transparency`, arguments)}
						<div>
							<p class="margin0">Transparency :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="211transparencyon">On</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="211transparencyon" name="211transparencyp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="211transparencyoff">Off</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"  
											type="radio" id="211transparencyoff" name="211transparencyp${pageId}c${commandIndex}" value="1" ${params[0] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 212:
			return `
				${getCommandDataHeader(`Show Animation`, `Show Animation`, arguments)}
						<div>
							${getEventFilterInput({
								id: `212character`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								label: `Character :`,
								showLabel: true,
								includeThisEvent: true,
								includePlayer: true
							})}
						</div>
						<div>
							${getAnimationFilterInput({
								id: `212animation`, 
								val: params[1], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Animation :`
							})}
						</div>
						<div>
							<label for="212waitforcompletion" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="212waitforcompletion" name="212waitforcompletion" ${params[2] === true ? 'checked' : ''}
								>
								Wait for Completion
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 213:
			return `
				${getCommandDataHeader(`Show Balloon Icon`, `Show Balloon Icon`, arguments)}
						<div>
							${getEventFilterInput({
								id: `213character`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								label: `Character :`,
								showLabel: true,
								includeThisEvent: true,
								includePlayer: true
							})}
						</div>
						<div>
							<p class="margin0">Balloon Icon : </p>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
									onchange="changeEventCommandParam(this)" 
									id="213balloonicon" name="213balloonicon"
								>
									<option value="1" ${params[0] === "1" ? 'selected="selected"' : ''}>Exclamation</option>
									<option value="2" ${params[0] === "2" ? 'selected="selected"' : ''}>Question</option>
									<option value="3" ${params[0] === "3" ? 'selected="selected"' : ''}>Music Note</option>
									<option value="4" ${params[0] === "4" ? 'selected="selected"' : ''}>Heart</option>
									<option value="5" ${params[0] === "5" ? 'selected="selected"' : ''}>Anger</option>
									<option value="6" ${params[0] === "6" ? 'selected="selected"' : ''}>Sweat</option>
									<option value="7" ${params[0] === "7" ? 'selected="selected"' : ''}>Frustration</option>
									<option value="8" ${params[0] === "8" ? 'selected="selected"' : ''}>Silence</option>
									<option value="9" ${params[0] === "9" ? 'selected="selected"' : ''}>Light Bulbe</option>
									<option value="10" ${params[0] === "10" ? 'selected="selected"' : ''}>Zzz</option>
									<option value="11" ${params[0] === "11" ? 'selected="selected"' : ''}>User-defined 1</option>
									<option value="12" ${params[0] === "12" ? 'selected="selected"' : ''}>User-defined 2</option>
									<option value="13" ${params[0] === "13" ? 'selected="selected"' : ''}>User-defined 3</option>
									<option value="14" ${params[0] === "14" ? 'selected="selected"' : ''}>User-defined 4</option>
									<option value="15" ${params[0] === "15" ? 'selected="selected"' : ''}>User-defined 5</option>
								</select>
								<span class="focus"></span>
							</div>
						</div>
						<div>
							<label for="213waitforcompletion" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="213waitforcompletion" name="213waitforcompletion" ${params[2] === true ? 'checked' : ''}
								>
								Wait for Completion
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 214:
			return 'Erase Event';
			break;
		case 216:
			return `
				${getCommandDataHeader(`Show Player Followers`, `Show Player Followers`, arguments)}
						<div>
							<p class="margin0">Player Followers :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="216followerson">On</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="216followerson" name="216followersp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="216followersoff">Off</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"  
											type="radio" id="216followersoff" name="216followersp${pageId}c${commandIndex}" value="1" ${params[0] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 217:
			return 'Gather Followers';
			break;
		case 221:
			return 'Fadeout Screen';
			break;
		case 222:
			return 'Fadein Screen';
			break;
		case 223:
			return 'Tint Screen';
			break;
		case 224:
			return 'Flash Screen';
			break;
		case 225:
			return 'Shake Screen';
			break;
		case 230:
			return `
				${getCommandDataHeader(`Wait`, `Wait`, arguments)}
						<div>
							<label for="230wait">Duration : (frames, 1/60 sec)</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								min="0" max="999" type="number" placeholder="0" id="230wait" name="230wait" value="${params[0]}"
							>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 231:
			return `
				${getCommandDataHeader(`Show Picture`, `Show Picture`, arguments)}
						<div class="customGrid gridColGap10" style="--grid-col-nb: 1; --grid-row-nb: 1;">
							<div>
								<label for="231picturenb">Picture Number :</label>
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
									onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
									min="1" max="999" type="number" placeholder="1" id="231picturenb" name="231picturenb" value="${params[0]}"
								>
							</div>
						</div>
						<div>
							<p class="margin0">Origin : </p>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
									onchange="changeEventCommandParam(this)" 
									id="231pictureorigin" name="231pictureorigin"
								>
									<option value="0" ${params[2] === "0" ? 'selected="selected"' : ''}>Upper Left</option>
									<option value="1" ${params[2] === "1" ? 'selected="selected"' : ''}>Center</option>
								</select>
								<span class="focus"></span>
							</div>
						</div>
						<div class="customGrid gridColGap10" style="--grid-col-nb: 2; --grid-row-nb: 1; grid-template-columns: 3fr 2fr;">
							<div>
								<p class="margin0 mBottom05">Position :</p>
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="gridGap15">
										<div class="form-control">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '231designationdirectX'); toggleLinkedInput(this, '231designationdirectY');" ondeselect="toggleLinkedInput(this, '231designationdirectX'); toggleLinkedInput(this, '231designationdirectY');"  
												type="radio" id="231designationdirect" name="231designationp${pageId}c${commandIndex}" value="0" ${params[3] === 0 ? 'checked' : ''}
											>
											<label class="block fWeightNormal" for="231designationdirect">Direct designation :</label>
										</div>
										<div class="customGrid gridColGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
											<label for="231designationdirectX">X :</label>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												min="-9999" max="9999" type="number" placeholder="0" id="231designationdirectX" name="231designationdirectX" value="${params[4]}" ${params[3] !== 0 ? 'disabled' : ''}
											>
											<label for="231designationdirectY">Y :</label>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												min="-9999" max="9999" type="number" placeholder="0" id="231designationdirectY" name="231designationdirectY" value="${params[5]}" ${params[3] !== 0 ? 'disabled' : ''}
											>
										</div>
										<div class="form-control">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '231designationvarX'); toggleLinkedInput(this, '231designationvarY');" ondeselect="toggleLinkedInput(this, '231designationvarX'); toggleLinkedInput(this, '231designationvarY');"
												type="radio" id="231designationvar" name="231designationp${pageId}c${commandIndex}" value="1" ${params[3] !== 0 ? 'checked' : ''}
											>
											<label class="block fWeightNormal" for="231designationvar">Designation with variables :</label>
										</div>
										<div class="customGrid gridColGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
											${getVariableFilterInput({
												id: `231designationvarX`, 
												val: params[4], 
												data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"`, 
												onchange: `changeEventCommandParam(this);`,
												showLabel: true,
												label: `X :`,
												disabled: params[3] === 0
											})}
											${getVariableFilterInput({
												id: `231designationvarY`, 
												val: params[5], 
												data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"`, 
												onchange: `changeEventCommandParam(this);`,
												label: `Y :`,
												showLabel: true,
												disabled: params[3] === 0
											})}
										</div>
									</div>
								</form>
							</div>
							<div class="padding5" style="background: var(--color-alpha-03);">
								<div>
									<p class="margin0">Scale : </p>
									<label class="fSize16" for="231scaleX">% Width</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="6" data-valType="int"
										onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
										min="-2000" max="2000" type="number" placeholder="0" id="231scaleX" name="231scaleX" value="${params[6]}"
									>
									<label class="fSize16" for="231scaleY">% Height</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="7" data-valType="int"
										onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
										min="-2000" max="2000" type="number" placeholder="0" id="231scaleY" name="231scaleY" value="${params[7]}"
									>
								</div>
								<div style="background: none;">
									<p class="margin0 mTop05">Blend : </p>
									<label class="fSize16" for="231opacity">Opacity</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="8" data-valType="int"
										onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
										min="0" max="255" type="number" placeholder="0" id="231opacity" name="231opacity" value="${params[8]}"
									>
									<p class="margin0 fSize16">Mode</p>
									<div class="select">
										<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="9" data-valType="int"
											onchange="changeEventCommandParam(this)" 
											id="231blendmode" name="231blendmode"
										>
											<option value="0" ${params[9] === "0" ? 'selected="selected"' : ''}>Normal</option>
											<option value="1" ${params[9] === "1" ? 'selected="selected"' : ''}>Additive</option>
											<option value="2" ${params[9] === "2" ? 'selected="selected"' : ''}>Multiply</option>
											<option value="3" ${params[9] === "3" ? 'selected="selected"' : ''}>Screen</option>
										</select>
										<span class="focus"></span>
									</div>
								</div>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 232:
			return `
				${getCommandDataHeader(`Move Picture`, `Move Picture`, arguments)}
						<div class="customGrid gridColGap10" style="--grid-col-nb: 2; --grid-row-nb: 1;">
							<div>
								<label for="232picturenb">Picture Number :</label>
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
									onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
									min="1" max="999" type="number" placeholder="1" id="232picturenb" name="232picturenb" value="${params[0]}"
								>
							</div>
							<div>
								${ $.Utils.RPGMAKER_NAME === "MZ" ? `
								<p class="margin0">Easing Type : </p>
								<div class="select">
									<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="12" data-valType="int"
										onchange="changeEventCommandParam(this)" 
										id="232pictureeasing" name="232pictureeasing"
									>
										<option value="0" ${params[12] === "0" ? 'selected="selected"' : ''}>Constant speed</option>
										<option value="1" ${params[12] === "1" ? 'selected="selected"' : ''}>Slow start</option>
										<option value="2" ${params[12] === "2" ? 'selected="selected"' : ''}>Slow end</option>
										<option value="3" ${params[12] === "3" ? 'selected="selected"' : ''}>Slow start and end</option>
									</select>
									<span class="focus"></span>
								</div>
								` : ``}
							</div>
						</div>
						<div>
							<p class="margin0">Origin : </p>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
									onchange="changeEventCommandParam(this)" 
									id="232pictureorigin" name="232pictureorigin"
								>
									<option value="0" ${params[2] === "0" ? 'selected="selected"' : ''}>Upper Left</option>
									<option value="1" ${params[2] === "1" ? 'selected="selected"' : ''}>Center</option>
								</select>
								<span class="focus"></span>
							</div>
						</div>
						<div class="customGrid gridColGap10" style="--grid-col-nb: 2; --grid-row-nb: 1; grid-template-columns: 3fr 2fr;">
							<div>
								<p class="margin0 mBottom05">Position :</p>
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="gridGap15">
										<div class="form-control">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '232designationdirectX'); toggleLinkedInput(this, '232designationdirectY');" ondeselect="toggleLinkedInput(this, '232designationdirectX'); toggleLinkedInput(this, '232designationdirectY');"  
												type="radio" id="232designationdirect" name="232designationp${pageId}c${commandIndex}" value="0" ${params[3] === 0 ? 'checked' : ''}
											>
											<label class="block fWeightNormal" for="232designationdirect">Direct designation :</label>
										</div>
										<div class="customGrid gridColGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
											<label for="232designationdirectX">X :</label>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												min="-9999" max="9999" type="number" placeholder="0" id="232designationdirectX" name="232designationdirectX" value="${params[4]}" ${params[3] !== 0 ? 'disabled' : ''}
											>
											<label for="232designationdirectY">Y :</label>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												min="-9999" max="9999" type="number" placeholder="0" id="232designationdirectY" name="232designationdirectY" value="${params[5]}" ${params[3] !== 0 ? 'disabled' : ''}
											>
										</div>
										<div class="form-control">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '232designationvarX'); toggleLinkedInput(this, '232designationvarY');" ondeselect="toggleLinkedInput(this, '232designationvarX'); toggleLinkedInput(this, '232designationvarY');"
												type="radio" id="232designationvar" name="232designationp${pageId}c${commandIndex}" value="1" ${params[3] !== 0 ? 'checked' : ''}
											>
											<label class="block fWeightNormal" for="232designationvar">Designation with variables :</label>
										</div>
										<div class="customGrid gridColGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
											${getVariableFilterInput({
												id: `232designationvarX`, 
												val: params[4], 
												data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"`, 
												onchange: `changeEventCommandParam(this);`,
												label: `X :`,
												showLabel: true,
												disabled: params[3] === 0
											})}
											${getVariableFilterInput({
												id: `232designationvarY`, 
												val: params[5], 
												data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"`, 
												onchange: `changeEventCommandParam(this);`,
												label: `Y :`,
												showLabel: true,
												disabled: params[3] === 0
											})}
										</div>
									</div>
								</form>
							</div>
							<div class="padding5" style="background: var(--color-alpha-03);">
								<div>
									<p class="margin0">Scale : </p>
									<label class="fSize16" for="232scaleX">% Width</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="6" data-valType="int"
										onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
										min="-2000" max="2000" type="number" placeholder="0" id="232scaleX" name="232scaleX" value="${params[6]}"
									>
									<label class="fSize16" for="232scaleY">% Height</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="7" data-valType="int"
										onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
										min="-2000" max="2000" type="number" placeholder="0" id="232scaleY" name="232scaleY" value="${params[7]}"
									>
								</div>
								<div style="background: none;">
									<p class="margin0 mTop05">Blend : </p>
									<label class="fSize16" for="232opacity">Opacity</label>
									<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="8" data-valType="int"
										onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
										min="0" max="255" type="number" placeholder="0" id="232opacity" name="232opacity" value="${params[8]}"
									>
									<p class="margin0 fSize16">Mode</p>
									<div class="select">
										<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="9" data-valType="int"
											onchange="changeEventCommandParam(this)" 
											id="232blendmode" name="232blendmode"
										>
											<option value="0" ${params[9] === "0" ? 'selected="selected"' : ''}>Normal</option>
											<option value="1" ${params[9] === "1" ? 'selected="selected"' : ''}>Additive</option>
											<option value="2" ${params[9] === "2" ? 'selected="selected"' : ''}>Multiply</option>
											<option value="3" ${params[9] === "3" ? 'selected="selected"' : ''}>Screen</option>
										</select>
										<span class="focus"></span>
									</div>
								</div>
							</div>
						</div>
						<div>
							<label for="232duration">Duration : (frames, 1/60 sec)</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="10" data-valType="int"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								min="0" max="999" type="number" placeholder="0" id="232duration" name="232duration" value="${params[10]}"
							>
						</div>
						<div>
							<label for="232waitforcompletion" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="11" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="232waitforcompletion" name="232waitforcompletion" ${params[11] === true ? 'checked' : ''}
								>
								Wait for Completion
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 233:
			return `
				${getCommandDataHeader(`Rotate Picture`, `Rotate Picture`, arguments)}
						<div>
							<label for="233picturenb">Picture Number :</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								min="1" max="999" type="number" placeholder="1" id="233picturenb" name="233picturenb" value="${params[0]}"
							>
						</div>
						<div>
							<label for="233rotspeed">Rotation speed :</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								min="-90" max="90" type="number" placeholder="0" id="233rotspeed" name="233rotspeed" value="${params[1]}"
							>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 234:
			return 'Tint Picture';
			break;
		case 235:
			return `
				${getCommandDataHeader(`Erase Picture`, `Erase Picture`, arguments)}
						<div>
							<label for="235picturenb">Picture Number :</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								min="1" max="999" type="number" placeholder="1" id="235picturenb" name="235picturenb" value="${params[0]}"
							>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 236:
			return 'Set Weather Effect';
			break;
		case 241:
			return 'Play BGM';
			break;
		case 242:
			return `
				${getCommandDataHeader(`Fadeout BGM`, `Fadeout BGM`, arguments)}
						<div>
							<label for="242duration">Duration : (seconds)</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								min="1" max="999" type="number" placeholder="1" id="242duration" name="242duration" value="${params[0]}"
							>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 243:
			return 'Save BGM';
			break;
		case 244:
			return 'Resume BGM';
			break;
		case 245:
			return 'Play BGS';
			break;
		case 246:
			return `
				${getCommandDataHeader(`Fadeout BGS`, `Fadeout BGS`, arguments)}
						<div>
							<label for="246duration">Duration : (seconds)</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								min="1" max="999" type="number" placeholder="1" id="246duration" name="246duration" value="${params[0]}"
							>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 249:
			return 'Play ME';
			break;
		case 250:
			return 'Play SE';
			break;
		case 251:
			return 'Stop SE';
			break;
		case 261:
			return 'Play Movie';
			break;
		case 281:
			return `
				${getCommandDataHeader(`Change Map Name Display`, `Change Map Name Display`, arguments)}
						<div>
							<p class="margin0">Map Name Display</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="281displayon">On</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="281displayon" name="281displayp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="281displayoff">Off</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);"  
											type="radio" id="281displayoff" name="281displayp${pageId}c${commandIndex}" value="1" ${params[0] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 282:
			return `
				${getCommandDataHeader(`Change Tileset`, `Change Tileset`, arguments)}
						<div>
							${getTilesetFilterInput({
								id: `282tileset`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Tileset :`
							})}
						</div>
				${getCommandDataFooter()}`;
			break;
		case 283:
			return 'Change Battle Background';
			break;
		case 284:
			return 'Change Parallax';
			break;
		case 285:
			return `
				${getCommandDataHeader(`Get Location Info`, `Get Location Info`, arguments)}
						<div>
							${getVariableFilterInput({
								id: `285var`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Variables :`
							})}
						</div>
						<div>
							<p class="margin0">Info Type :</p>
							<div class="select">
								<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
									onchange="changeEventCommandParam(this)" 
									id="285infotype" name="285infotype"
								>
									<option value="0" ${params[1] === "0" ? 'selected="selected"' : ''}>Terrain Tag</option>
									<option value="1" ${params[1] === "1" ? 'selected="selected"' : ''}>Event ID</option>
									<option value="2" ${params[1] === "2" ? 'selected="selected"' : ''}>Tile ID (Layer 1)</option>
									<option value="3" ${params[1] === "3" ? 'selected="selected"' : ''}>Tile ID (Layer 2)</option>
									<option value="4" ${params[1] === "4" ? 'selected="selected"' : ''}>Tile ID (Layer 3)</option>
									<option value="5" ${params[1] === "5" ? 'selected="selected"' : ''}>Tile ID (Layer 4)</option>
									<option value="6" ${params[1] === "6" ? 'selected="selected"' : ''}>Region ID</option>
								</select>
								<span class="focus"></span>
							</div>
						</div>
						<div>
							<p class="margin0 mBottom05">Position :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="gridGap15">
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '285designationdirectX'); toggleLinkedInput(this, '285designationdirectY');" 
											ondeselect="toggleLinkedInput(this, '285designationdirectX'); toggleLinkedInput(this, '285designationdirectY');"  
											type="radio" id="285designationdirect" name="285designationp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="285designationdirect">Direct designation :</label>
									</div>
									<div class="customGrid gridColGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
										<label for="285designationdirectX">X :</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
											onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
											min="-9999" max="9999" type="number" placeholder="0" id="285designationdirectX" name="285designationdirectX" value="${params[3]}" ${params[2] !== 0 ? 'disabled' : ''}
										>
										<label for="285designationdirectY">Y :</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
											onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
											min="-9999" max="9999" type="number" placeholder="0" id="285designationdirectY" name="285designationdirectY" value="${params[4]}" ${params[2] !== 0 ? 'disabled' : ''}
										>
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '285designationvarX'); toggleLinkedInput(this, '285designationvarY');" 
											ondeselect="toggleLinkedInput(this, '285designationvarX'); toggleLinkedInput(this, '285designationvarY');"
											type="radio" id="285designationvar" name="285designationp${pageId}c${commandIndex}" value="1" ${params[2] === 1 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="285designationvar">Designation with variables :</label>
									</div>
									<div class="customGrid gridColGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
										${getVariableFilterInput({
											id: `285designationvarX`, 
											val: params[3], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											label: `X :`,
											showLabel: true,
											disabled: params[2] !== 1
										})}
										${getVariableFilterInput({
											id: `285designationvarY`, 
											val: params[4], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											label: `Y :`,
											showLabel: true,
											disabled: params[2] !== 1
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '285char');" 
											ondeselect="toggleLinkedInput(this, '285char');"
											type="radio" id="285designationcharacter" name="285designationp${pageId}c${commandIndex}" value="2" ${(params[2] !== 0 && params[2] !== 1) ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="285designationcharacter">Designation by a character :</label>
									</div>
									<div class="customGrid gridColGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 1; --grid-row-nb: 1;">
										<label for="285char" class="whiteSpacePreWrap">     </label>
										${getEventFilterInput({
											id: `285char`, 
											val: params[3], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: (params[2] === 0 || params[2] === 1),
											includeThisEvent: true,
											includePlayer: true
										})}
									</div>
								</div>
							</form>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 301:
			return `
				${getCommandDataHeader(`Battle Processing`, `Battle Processing`, arguments)}
						<div>
							<p class="margin0 mBottom05">Position :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="gridGap15">
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '301troop');" 
											ondeselect="toggleLinkedInput(this, '301troop');"  
											type="radio" id="301designationdirect" name="301designationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="301designationdirect">Direct designation :</label>
									</div>
									<div>
										${getTroopsFilterInput({
											id: `301troop`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 0
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '301var');" 
											ondeselect="toggleLinkedInput(this, '301var');"
											type="radio" id="301designationvar" name="301designationp${pageId}c${commandIndex}" value="1" ${params[0] === 1 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="301designationvar">Designation with variables :</label>
									</div>
									<div>
										${getVariableFilterInput({
											id: `301var`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 1
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											ondeselect=""
											type="radio" id="301designationrandom" name="301designationp${pageId}c${commandIndex}" value="2" ${(params[0] !== 0 && params[0] !== 1) ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="301designationrandom">Same as Random Encounters</label>
									</div>
								</div>
							</form>
						</div>
						<div>
							<label for="301escape" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="301escape" name="301escape" ${params[2] === true ? 'checked' : ''}
								>
								Can Escape
							</label>
						</div>
						<div>
							<label for="301lose" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="301lose" name="301lose" ${params[3] === true ? 'checked' : ''}
								>
								Can Lose
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 601:
			return 'If Win';
			break;
		case 602:
			return 'If Escape';
			break;
		case 603:
			return 'If Lose';
			break;
		case 604:
			return 'End Battle Processing';
			break;
		case 302:
			return 'Shop Processing';
			break;
		case 605:
			return 'Shop Processing';
			break;
		case 303:
			return `
				${getCommandDataHeader(`Name Input Processing`, `Name Input Processing`, arguments)}
						<div>
							${getActorFilterInput({
								id: `303actor`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Actor :`
							})}
						</div>
						<label class="block mBottomNeg15" for="303nbchar">Max Characters :</label>
						<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
							onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
							min="1" max="16" type="number" placeholder="1" id="303nbchar" name="303nbchar" value="${params[1]}"
						>
				${getCommandDataFooter()}`;
			break;
		case 311:
			return `
				${getCommandDataHeader(`Change HP`, `Change HP`, arguments)}
						<div>
							<p class="margin0 mBottom05">Actor :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="customGrid gridColGap15 gridGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '311actor');" 
											ondeselect="toggleLinkedInput(this, '311actor');"  
											type="radio" id="311designationfixed" name="311designationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="311designationfixed">Fixed</label>
									</div>
									<div>
										${getActorFilterInput({
											id: `311actor`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 0,
											includeEntireParty: true
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '311var');" 
											ondeselect="toggleLinkedInput(this, '311var');"
											type="radio" id="311designationvar" name="311designationp${pageId}c${commandIndex}" value="1" ${params[0] === 1 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="311designationvar">Variable</label>
									</div>
									<div>
										${getVariableFilterInput({
											id: `311var`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 1
										})}
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="311operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="311operationinc" name="311operationp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="311operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="311operationdec" name="311operationp${pageId}c${commandIndex}" value="1" ${params[2] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '311constoperand');" ondeselect="toggleLinkedInput(this, '311constoperand');" 
												type="radio" id="311operandconst" name="311operandp${pageId}c${commandIndex}" value="0" ${params[3] === 0 ? 'checked' : ''}
											>
											<label for="311operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '311varoperand');" ondeselect="toggleLinkedInput(this, '311varoperand');" 
												type="radio" id="311operandvar" name="311operandp${pageId}c${commandIndex}" value="1" ${params[3] === 1 ? 'checked' : ''}
											>
											<label for="311operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="311constoperand" name="311constoperand" value="${params[4]}" ${params[3] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `311varoperand`, 
											val: params[4], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[3] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
						<div>
							<label for="311allowdeath" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="311allowdeath" name="311allowdeath" ${params[5] === true ? 'checked' : ''}
								>
								Allow Death
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 312:
			return `
				${getCommandDataHeader(`Change MP`, `Change MP`, arguments)}
						<div>
							<p class="margin0 mBottom05">Actor :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="customGrid gridColGap15 gridGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '312actor');" 
											ondeselect="toggleLinkedInput(this, '312actor');"  
											type="radio" id="312designationfixed" name="312designationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="312designationfixed">Fixed</label>
									</div>
									<div>
										${getActorFilterInput({
											id: `312actor`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 0,
											includeEntireParty: true
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '312var');" 
											ondeselect="toggleLinkedInput(this, '312var');"
											type="radio" id="312designationvar" name="312designationp${pageId}c${commandIndex}" value="1" ${params[0] === 1 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="312designationvar">Variable</label>
									</div>
									<div>
										${getVariableFilterInput({
											id: `312var`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 1
										})}
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="312operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="312operationinc" name="312operationp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="312operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="312operationdec" name="312operationp${pageId}c${commandIndex}" value="1" ${params[2] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '312constoperand');" ondeselect="toggleLinkedInput(this, '312constoperand');" 
												type="radio" id="312operandconst" name="312operandp${pageId}c${commandIndex}" value="0" ${params[3] === 0 ? 'checked' : ''}
											>
											<label for="312operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '312varoperand');" ondeselect="toggleLinkedInput(this, '312varoperand');" 
												type="radio" id="312operandvar" name="312operandp${pageId}c${commandIndex}" value="1" ${params[3] === 1 ? 'checked' : ''}
											>
											<label for="312operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="312constoperand" name="312constoperand" value="${params[4]}" ${params[3] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `312varoperand`, 
											val: params[4], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[3] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 326:
			return `
				${getCommandDataHeader(`Change TP`, `Change TP`, arguments)}
						<div>
							<p class="margin0 mBottom05">Actor :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="customGrid gridColGap15 gridGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '326actor');" 
											ondeselect="toggleLinkedInput(this, '326actor');"  
											type="radio" id="326designationfixed" name="326designationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="326designationfixed">Fixed</label>
									</div>
									<div>
										${getActorFilterInput({
											id: `326actor`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 0,
											includeEntireParty: true
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '326var');" 
											ondeselect="toggleLinkedInput(this, '326var');"
											type="radio" id="326designationvar" name="326designationp${pageId}c${commandIndex}" value="1" ${params[0] === 1 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="326designationvar">Variable</label>
									</div>
									<div>
										${getVariableFilterInput({
											id: `326var`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 1
										})}
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="326operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="326operationinc" name="326operationp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="326operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="326operationdec" name="326operationp${pageId}c${commandIndex}" value="1" ${params[2] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '326constoperand');" ondeselect="toggleLinkedInput(this, '326constoperand');" 
												type="radio" id="326operandconst" name="326operandp${pageId}c${commandIndex}" value="0" ${params[3] === 0 ? 'checked' : ''}
											>
											<label for="326operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '326varoperand');" ondeselect="toggleLinkedInput(this, '326varoperand');" 
												type="radio" id="326operandvar" name="326operandp${pageId}c${commandIndex}" value="1" ${params[3] === 1 ? 'checked' : ''}
											>
											<label for="326operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="326constoperand" name="326constoperand" value="${params[4]}" ${params[3] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `326varoperand`, 
											val: params[4], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[3] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 313:
			return `
				${getCommandDataHeader(`Change State`, `Change State`, arguments)}
						<div>
							<p class="margin0 mBottom05">Actor :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="customGrid gridColGap15 gridGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '313actor');" 
											ondeselect="toggleLinkedInput(this, '313actor');"  
											type="radio" id="313designationfixed" name="313designationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="313designationfixed">Fixed</label>
									</div>
									<div>
										${getActorFilterInput({
											id: `313actor`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 0,
											includeEntireParty: true
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '313var');" 
											ondeselect="toggleLinkedInput(this, '313var');"
											type="radio" id="313designationvar" name="313designationp${pageId}c${commandIndex}" value="1" ${params[0] === 1 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="313designationvar">Variable</label>
									</div>
									<div>
										${getVariableFilterInput({
											id: `313var`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 1
										})}
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="313operationinc">Add</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="313operationinc" name="313operationp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="313operationdec">Remove</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="313operationdec" name="313operationp${pageId}c${commandIndex}" value="1" ${params[2] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							${getStateFilterInput({
								id: `313state`, 
								val: params[3], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `State :`
							})}
						</div>
				${getCommandDataFooter()}`;
			break;
		case 314:
			return `
				${getCommandDataHeader(`Recover All`, `Recover All`, arguments)}
						<div>
							<p class="margin0 mBottom05">Actor :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="customGrid gridColGap15 gridGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '314actor');" 
											ondeselect="toggleLinkedInput(this, '314actor');"  
											type="radio" id="314designationfixed" name="314designationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="314designationfixed">Fixed</label>
									</div>
									<div>
										${getActorFilterInput({
											id: `314actor`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 0,
											includeEntireParty: true
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '314var');" 
											ondeselect="toggleLinkedInput(this, '314var');"
											type="radio" id="314designationvar" name="314designationp${pageId}c${commandIndex}" value="1" ${params[0] === 1 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="314designationvar">Variable</label>
									</div>
									<div>
										${getVariableFilterInput({
											id: `314var`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 1
										})}
									</div>
								</div>
							</form>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 315:
			return `
				${getCommandDataHeader(`Change EXP`, `Change EXP`, arguments)}
						<div>
							<p class="margin0 mBottom05">Actor :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="customGrid gridColGap15 gridGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '315actor');" 
											ondeselect="toggleLinkedInput(this, '315actor');"  
											type="radio" id="315designationfixed" name="315designationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="315designationfixed">Fixed</label>
									</div>
									<div>
										${getActorFilterInput({
											id: `315actor`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 0,
											includeEntireParty: true
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '315var');" 
											ondeselect="toggleLinkedInput(this, '315var');"
											type="radio" id="315designationvar" name="315designationp${pageId}c${commandIndex}" value="1" ${params[0] === 1 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="315designationvar">Variable</label>
									</div>
									<div>
										${getVariableFilterInput({
											id: `315var`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 1
										})}
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="315operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="315operationinc" name="315operationp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="315operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="315operationdec" name="315operationp${pageId}c${commandIndex}" value="1" ${params[2] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '315constoperand');" ondeselect="toggleLinkedInput(this, '315constoperand');" 
												type="radio" id="315operandconst" name="315operandp${pageId}c${commandIndex}" value="0" ${params[3] === 0 ? 'checked' : ''}
											>
											<label for="315operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '315varoperand');" ondeselect="toggleLinkedInput(this, '315varoperand');" 
												type="radio" id="315operandvar" name="315operandp${pageId}c${commandIndex}" value="1" ${params[3] === 1 ? 'checked' : ''}
											>
											<label for="315operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="315constoperand" name="315constoperand" value="${params[4]}" ${params[3] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `315varoperand`, 
											val: params[4], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[3] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
						<div>
							<label for="315showlvlup" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="315showlvlup" name="315showlvlup" ${params[5] === true ? 'checked' : ''}
								>
								Show Level Up
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 316:
			return `
				${getCommandDataHeader(`Change Level`, `Change Level`, arguments)}
						<div>
							<p class="margin0 mBottom05">Actor :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="customGrid gridColGap15 gridGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '316actor');" 
											ondeselect="toggleLinkedInput(this, '316actor');"  
											type="radio" id="316designationfixed" name="316designationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="316designationfixed">Fixed</label>
									</div>
									<div>
										${getActorFilterInput({
											id: `316actor`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 0,
											includeEntireParty: true
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '316var');" 
											ondeselect="toggleLinkedInput(this, '316var');"
											type="radio" id="316designationvar" name="316designationp${pageId}c${commandIndex}" value="1" ${params[0] === 1 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="316designationvar">Variable</label>
									</div>
									<div>
										${getVariableFilterInput({
											id: `316var`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 1
										})}
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="316operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="316operationinc" name="316operationp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="316operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="316operationdec" name="316operationp${pageId}c${commandIndex}" value="1" ${params[2] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '316constoperand');" ondeselect="toggleLinkedInput(this, '316constoperand');" 
												type="radio" id="316operandconst" name="316operandp${pageId}c${commandIndex}" value="0" ${params[3] === 0 ? 'checked' : ''}
											>
											<label for="316operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '316varoperand');" ondeselect="toggleLinkedInput(this, '316varoperand');" 
												type="radio" id="316operandvar" name="316operandp${pageId}c${commandIndex}" value="1" ${params[3] === 1 ? 'checked' : ''}
											>
											<label for="316operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="316constoperand" name="316constoperand" value="${params[4]}" ${params[3] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `316varoperand`, 
											val: params[4], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[3] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
						<div>
							<label for="316showlvlup" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="316showlvlup" name="316showlvlup" ${params[5] === true ? 'checked' : ''}
								>
								Show Level Up
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 317:
			return `
				${getCommandDataHeader(`Change Parameter`, `Change Parameter`, arguments)}
						<div>
							<p class="margin0 mBottom05">Actor :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="customGrid gridColGap15 gridGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '317actor');" 
											ondeselect="toggleLinkedInput(this, '317actor');"  
											type="radio" id="317designationfixed" name="317designationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="317designationfixed">Fixed</label>
									</div>
									<div>
										${getActorFilterInput({
											id: `317actor`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 0,
											includeEntireParty: true
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '317var');" 
											ondeselect="toggleLinkedInput(this, '317var');"
											type="radio" id="317designationvar" name="317designationp${pageId}c${commandIndex}" value="1" ${params[0] === 1 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="317designationvar">Variable</label>
									</div>
									<div>
										${getVariableFilterInput({
											id: `317var`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 1
										})}
									</div>
								</div>
							</form>
						</div>
						<div class="select">
							<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
								onchange="changeEventCommandParam(this)"
								name="317param" id="317param"
							>
								<option value="0" ${params[2] === 0 ? 'selected' : ''}>Max HP</option>
								<option value="1" ${params[2] === 1 ? 'selected' : ''}>Max MP</option>
								<option value="2" ${params[2] === 2 ? 'selected' : ''}>Attack</option>
								<option value="3" ${params[2] === 3 ? 'selected' : ''}>Defense</option>
								<option value="4" ${params[2] === 4 ? 'selected' : ''}>M. Attack</option>
								<option value="5" ${params[2] === 5 ? 'selected' : ''}>M. Defense</option>
								<option value="6" ${params[2] === 6 ? 'selected' : ''}>Agility</option>
								<option value="7" ${params[2] === 7 ? 'selected' : ''}>Luck</option>
							</select>
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="317operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="317operationinc" name="317operationp${pageId}c${commandIndex}" value="0" ${params[3] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="317operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="317operationdec" name="317operationp${pageId}c${commandIndex}" value="1" ${params[3] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '317constoperand');" ondeselect="toggleLinkedInput(this, '317constoperand');" 
												type="radio" id="317operandconst" name="317operandp${pageId}c${commandIndex}" value="0" ${params[4] === 0 ? 'checked' : ''}
											>
											<label for="317operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '317varoperand');" ondeselect="toggleLinkedInput(this, '317varoperand');" 
												type="radio" id="317operandvar" name="317operandp${pageId}c${commandIndex}" value="1" ${params[4] === 1 ? 'checked' : ''}
											>
											<label for="317operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="317constoperand" name="317constoperand" value="${params[5]}" ${params[4] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `317varoperand`, 
											val: params[5], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="5" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[4] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 318:
			return `
				${getCommandDataHeader(`Change Skill`, `Change Skill`, arguments)}
						<div>
							<p class="margin0 mBottom05">Actor :</p>
							<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
								<div class="customGrid gridColGap15 gridGap15 gridTemColMaxAuto alignItemsCenter" style="--grid-col-nb: 2; --grid-row-nb: 2;">
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '318actor');" 
											ondeselect="toggleLinkedInput(this, '318actor');"  
											type="radio" id="318designationfixed" name="318designationp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="318designationfixed">Fixed</label>
									</div>
									<div>
										${getActorFilterInput({
											id: `318actor`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 0,
											includeEntireParty: true
										})}
									</div>
									<div class="form-control">
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
											onchange="changeEventCommandParam(this); toggleLinkedInput(this, '318var');" 
											ondeselect="toggleLinkedInput(this, '318var');"
											type="radio" id="318designationvar" name="318designationp${pageId}c${commandIndex}" value="1" ${params[0] === 1 ? 'checked' : ''}
										>
										<label class="block fWeightNormal" for="318designationvar">Variable</label>
									</div>
									<div>
										${getVariableFilterInput({
											id: `318var`, 
											val: params[1], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[0] !== 1
										})}
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="318operationlearn">Learn</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="318operationlearn" name="318operationp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="318operationforget">Forget</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="318operationforget" name="318operationp${pageId}c${commandIndex}" value="1" ${params[2] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							${getSkillFilterInput({
								id: `318skill`, 
								val: params[3], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Skill :`
							})}
						</div>
				${getCommandDataFooter()}`;
			break;
		case 319:
			return 'Change Equipment';
			break;
		case 320:
			return `
				${getCommandDataHeader(`Change Name`, `Change Name`, arguments)}
						<div>
							${getActorFilterInput({
								id: `320actor`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Actor :`
							})}
						</div>
						<div>
							<label for="320name">Name :</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								type="text" id="320name" name="320name" placeholder="Enter a name" value="${params[1]}"
							>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 321:
			return `
				${getCommandDataHeader(`Change Class`, `Change Class`, arguments)}
						<div>
							${getActorFilterInput({
								id: `321actor`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Actor :`
							})}
						</div>
						<div>
							${getStateFilterInput({
								id: `321class`, 
								val: params[1], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Class :`
							})}
						</div>
						<div>
							<label for="321saveexp" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="321saveexp" name="321saveexp" ${params[2] === true ? 'checked' : ''}
								>
								Save EXP
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 322:
			return 'Change Actor Images';
			break;
		case 323:
			return 'Change Vehicle Image';
			break;
		case 324:
			return `
				${getCommandDataHeader(`Change Nickname`, `Change Nickname`, arguments)}
						<div>
							${getActorFilterInput({
								id: `324actor`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Actor :`
							})}
						</div>
						<div>
							<label for="324nickname">Nickname :</label>
							<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								type="text" id="324nickname" name="324nickname" placeholder="Enter a nickname" value="${params[1]}"
							>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 325:
			return `
				${getCommandDataHeader(`Change Profile`, `Change Profile`, arguments)}
						<div>
							${getActorFilterInput({
								id: `325actor`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Actor :`
							})}
						</div>
						<div>
							<label for="325profile">Profile :</label>
							<textarea data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								class="textareaCommandData" id="325profile" name="325profile" placeholder="Enter a profile">${params[1]}</textarea>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 331:
			return `
				${getCommandDataHeader(`Change Enemy HP`, `Change Enemy HP`, arguments)}
						<div>
							${getEnemyFilterInput({
								id: `331enemy`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								includeEntireTroop: true,
								showLabel: true,
								label: `Enemy :`
							})}
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="331operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="331operationinc" name="331operationp${pageId}c${commandIndex}" value="0" ${params[1] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="331operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="331operationdec" name="331operationp${pageId}c${commandIndex}" value="1" ${params[1] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '331constoperand');" ondeselect="toggleLinkedInput(this, '331constoperand');" 
												type="radio" id="331operandconst" name="331operandp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
											>
											<label for="331operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '331varoperand');" ondeselect="toggleLinkedInput(this, '331varoperand');" 
												type="radio" id="331operandvar" name="331operandp${pageId}c${commandIndex}" value="1" ${params[2] === 1 ? 'checked' : ''}
											>
											<label for="331operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="331constoperand" name="331constoperand" value="${params[3]}" ${params[2] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `331varoperand`, 
											val: params[3], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[2] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
						<div>
							<label for="331allowdeath" class="form-control">
								<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="4" data-valType="bool"
									onchange="changeEventCommandParam(this)"
									type="checkbox" id="331allowdeath" name="331allowdeath" ${params[4] === true ? 'checked' : ''}
								>
								Allow Death
							</label>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 332:
			return `
				${getCommandDataHeader(`Change Enemy MP`, `Change Enemy MP`, arguments)}
						<div>
							${getEnemyFilterInput({
								id: `332enemy`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								includeEntireTroop: true,
								showLabel: true,
								label: `Enemy :`
							})}
						</div>
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="332operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="332operationinc" name="332operationp${pageId}c${commandIndex}" value="0" ${params[1] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="332operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="332operationdec" name="332operationp${pageId}c${commandIndex}" value="1" ${params[1] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '332constoperand');" ondeselect="toggleLinkedInput(this, '332constoperand');" 
												type="radio" id="332operandconst" name="332operandp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
											>
											<label for="332operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '332varoperand');" ondeselect="toggleLinkedInput(this, '332varoperand');" 
												type="radio" id="332operandvar" name="332operandp${pageId}c${commandIndex}" value="1" ${params[2] === 1 ? 'checked' : ''}
											>
											<label for="332operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="332constoperand" name="332constoperand" value="${params[3]}" ${params[2] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `332varoperand`, 
											val: params[3], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[2] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 342:
			return `
				${getCommandDataHeader(`Change Enemy TP`, `Change Enemy TP`, arguments)}
						<div>
							${getEnemyFilterInput({
								id: `342enemy`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								includeEntireTroop: true,
								showLabel: true,
								label: `Enemy :`
							})}
						</div>
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="342operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="342operationinc" name="342operationp${pageId}c${commandIndex}" value="0" ${params[1] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="342operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="342operationdec" name="342operationp${pageId}c${commandIndex}" value="1" ${params[1] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							<p class="margin0">Operand :</p>		
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '342constoperand');" ondeselect="toggleLinkedInput(this, '342constoperand');" 
												type="radio" id="342operandconst" name="342operandp${pageId}c${commandIndex}" value="0" ${params[2] === 0 ? 'checked' : ''}
											>
											<label for="342operandconst">Constant</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '342varoperand');" ondeselect="toggleLinkedInput(this, '342varoperand');" 
												type="radio" id="342operandvar" name="342operandp${pageId}c${commandIndex}" value="1" ${params[2] === 1 ? 'checked' : ''}
											>
											<label for="342operandvar">Variable</label>
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2;">
										<div>
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
												onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
												type="number" placeholder="0" id="342constoperand" name="342constoperand" value="${params[3]}" ${params[2] !== 0 ? 'disabled' : ''}
											>
										</div>
										${getVariableFilterInput({
											id: `342varoperand`, 
											val: params[3], 
											data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"`, 
											onchange: `changeEventCommandParam(this);`,
											disabled: params[2] !== 1
										})}
									</div>
								</div>
							</div>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 333:
			return `
				${getCommandDataHeader(`Change Enemy State`, `Change Enemy State`, arguments)}
						<div>
							${getEnemyFilterInput({
								id: `333enemy`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								includeEntireTroop: true,
								showLabel: true,
								label: `Enemy :`
							})}
						</div>
						<div>
							<p class="margin0">Operation :</p>
							<form class="block margin0">
								<div class="textCenter grid2col">
									<div>
										<label class="block" for="333operationinc">Increase</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);"
											type="radio" id="333operationinc" name="333operationp${pageId}c${commandIndex}" value="0" ${params[1] === 0 ? 'checked' : ''}
										>
									</div>
									<div>
										<label class="block" for="333operationdec">Decrease</label>
										<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"
											onchange="changeEventCommandParam(this);" 
											type="radio" id="333operationdec" name="333operationp${pageId}c${commandIndex}" value="1" ${params[1] !== 0 ? 'checked' : ''}
										>
									</div>
								</div>
							</form>
						</div>
						<div>
							${getStateFilterInput({
								id: `333state`, 
								val: params[2], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `State :`
							})}
						</div>
				${getCommandDataFooter()}`;
			break;
		case 334:
			return `
				${getCommandDataHeader(`Enemy Recover All`, `Enemy Recover All`, arguments)}
						<div>
							${getEnemyFilterInput({
								id: `334enemy`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								includeEntireTroop: true,
								showLabel: true,
								label: `Enemy :`
							})}
						</div>
				${getCommandDataFooter()}`;
			break;
		case 335:
			return `
				${getCommandDataHeader(`Enemy Appear`, `Enemy Appear`, arguments)}
						<div>
							${getEnemyFilterInput({
								id: `335enemy`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Enemy :`
							})}
						</div>
				${getCommandDataFooter()}`;
			break;
		case 336:
			return `
				${getCommandDataHeader(`Enemy Transform`, `Enemy Transform`, arguments)}
						<div>
							${getEnemyFilterInput({
								id: `336enemy`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Enemy :`
							})}
						</div>
						<div>
							${getDataEnemyFilterInput({
								id: `336enemy2`, 
								val: params[1], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Transform to :`
							})}
						</div>
				${getCommandDataFooter()}`;
			break;
		case 337:
			return `
				${getCommandDataHeader(`Show Battle Animation`, `Show Battle Animation`, arguments)}
						<div>
							${getEnemyFilterInput({
								id: `337enemy`, 
								val: params[0], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								includeEntireTroop: true,
								showLabel: true,
								label: `Enemy :`
							})}
						</div>
						<div>
							${getAnimationFilterInput({
								id: `337animation`, 
								val: params[1], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Animation :`
							})}
						</div>
				${getCommandDataFooter()}`;
			break;
		case 339:
			return `
				${getCommandDataHeader(`Force Action`, `Force Action`, arguments)}
						<p class="margin0">Subject :</p>
						<div>
							<div class="customGrid gridTemColMinAuto gridColGap5" style="--grid-row-nb: 1;">
								<form class="block margin0" onchange="triggerChildEvent(this, 'input:not(:checked)', 'ondeselect');">
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '339enemy');" ondeselect="toggleLinkedInput(this, '339enemy');" 
												type="radio" id="339enemysubject" name="339subjectp${pageId}c${commandIndex}" value="0" ${params[0] === 0 ? 'checked' : ''}
											>
											<label for="342operandconst">Enemy</label>
										</div>
										<div class="gridColGap5 gridColMinMax alignItemsCenter">
											<input data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="int"
												onchange="changeEventCommandParam(this); toggleLinkedInput(this, '339actor');" ondeselect="toggleLinkedInput(this, '339actor');" 
												type="radio" id="339actorsubject" name="339subjectp${pageId}c${commandIndex}" value="1" ${params[0] === 1 ? 'checked' : ''}
											>
											<label for="342operandvar">Actor</label> 
										</div>
									</div>
								</form>
								<div>
									<div class="customGrid gridGap10" style="--grid-col-nb: 1; --grid-row-nb: 2; grid-template-rows: repeat(var(--grid-row-nb), 34px);">
										<div>
											${getEnemyFilterInput({
												id: `339enemy`, 
												val: params[1], 
												data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
												onchange: `changeEventCommandParam(this);`,
												disabled: params[0] !== 0
											})}
										</div>
										<div>
											${getActorFilterInput({
												id: `339actor`, 
												val: params[1], 
												data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="1" data-valType="int"`, 
												onchange: `changeEventCommandParam(this);`,
												disabled: params[0] !== 1
											})}
										</div>
									</div>
								</div>
							</div>
						</div>
						<p class="margin0">Action :</p>
						<div>
							${getSkillFilterInput({
								id: `339skill`, 
								val: params[2], 
								data: `data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="2" data-valType="int"`, 
								onchange: `changeEventCommandParam(this);`,
								showLabel: true,
								label: `Skill :`
							})}
						</div>
						<p class="margin0 mBottomNeg15">Target :</p>
						<div class="select">
							<select data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="3" data-valType="int"
								onchange="changeEventCommandParam(this)"
								name="339target" id="339target"
							>
								<option value="-2" ${params[3] === -2 ? 'selected' : ''}>Last Target</option>
								<option value="-1" ${params[3] === -1 ? 'selected' : ''}>Random</option>
								<option value="0" ${params[3] === 0 ? 'selected' : ''}>Index 1</option>
								<option value="1" ${params[3] === 1 ? 'selected' : ''}>Index 2</option>
								<option value="2" ${params[3] === 2 ? 'selected' : ''}>Index 3</option>
								<option value="3" ${params[3] === 3 ? 'selected' : ''}>Index 4</option>
								<option value="4" ${params[3] === 4 ? 'selected' : ''}>Index 5</option>
								<option value="5" ${params[3] === 5 ? 'selected' : ''}>Index 6</option>
								<option value="6" ${params[3] === 6 ? 'selected' : ''}>Index 7</option>
								<option value="7" ${params[3] === 7 ? 'selected' : ''}>Index 8</option>
							</select>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 340:
			return 'Abort Battle';
			break;
		case 351:
			return 'Open Menu Screen';
			break;
		case 352:
			return 'Open Save Screen';
			break;
		case 353:
			return 'Game Over';
			break;
		case 354:
			return 'Return to Title Screen';
			break;
		case 355:
			let script = `${params[0]}`;
			let nextEventCommandIsScript = true;
			let i = 1;
			while (nextEventCommandIsScript) {
				if ($.$dataMap.events[eventId].pages[pageId].list[commandIndex + i].code !== 655) {
					nextEventCommandIsScript = false;
				} else {
					script += `\n${$.$dataMap.events[eventId].pages[pageId].list[commandIndex + i].parameters[0]}`;
					i++;
				}
			}
			return`
				${getCommandDataHeader(`Script :\n${script}`, `Script`, arguments)}
						<div>
							<textarea data-eventId="${eventId}" data-pageId="${pageId}" data-commandIndex="${commandIndex}" data-paramIndex="0" data-valType="script"
								onchange="changeEventCommandParam(this)" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
								class="textareaCommandData" id="355script" name="355script" placeholder="Enter script">${script}
							</textarea>
						</div>
				${getCommandDataFooter()}`;
			break;
		case 655:
			return `Script`;
			break;
		case 356:
			return 'Plugin Command MV (deprecated)';
			break;
		case 357:
			return 'Plugin Command';
			break;
		case 657:
			return `${params[0]}`;
			break;
		default:
			return 'Unknown';
			break;
	}
};

function playBGM(elem) {
	let bgm = elem.parentNode.parentNode.parentNode.querySelector('input:checked').value;
	let volume = parseInt(elem.parentNode.parentNode.querySelector('input[data-objvalprop="volume"]').value);
	let pitch = parseInt(elem.parentNode.parentNode.querySelector('input[data-objvalprop="pitch"]').value);
	let pan = parseInt(elem.parentNode.parentNode.querySelector('input[data-objvalprop="pan"]').value);
	$.AudioManager.playBgm({
        name: bgm,
        volume: volume,
        pitch: pitch,
        pan: pan
    });
};

function updateBgm(form) {
	let bgm = form.previousElementSibling.querySelector('input:checked').value;
	if ($.AudioManager.isCurrentBgm({name: bgm})) {
		let volume = parseInt(form.querySelector('input[data-objvalprop="volume"]').value);
		let pitch = parseInt(form.querySelector('input[data-objvalprop="pitch"]').value);
		let pan = parseInt(form.querySelector('input[data-objvalprop="pan"]').value);
		$.AudioManager.updateBgmParameters({
			name: bgm,
			volume: volume,
			pitch: pitch,
			pan: pan
		});
	}
};

function stopBGM() {
	$.AudioManager.stopBgm();
};