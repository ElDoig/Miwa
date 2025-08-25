//----------------------------------------------------------------------
//switches view

function initSwitches() {
	view.setAttribute('data-view', 'switches');
	let viewHTML = getSwitchesViewHeader();
	viewHTML += `<br><div id="content">`;

	for ([switchId, switchName] of $.$dataSystem.switches.entries()) {
		if (switchId > 0) {
			let switchValue = $.$gameSwitches.value(switchId) === true ? "checked" : "";
			let color = $.$gameSwitches.value(switchId) === true ? "bgGreen" : "bgRed";
			viewHTML += getSwitchElem2(switchId, switchName, switchValue, color);
		}
	}
	viewHTML += "</div>";
	view.innerHTML = viewHTML;
};

function updateSwitches() {				
	let eSwitches = document.querySelectorAll('.switch');
	if (!(eSwitches.length > 0))
		return;
	let showNamelessSwitches = document.getElementById("showNamelessSwitches").checked;
	let showNamedSwitches = document.getElementById("showNamedSwitches").checked;
	let filterSwitches = document.getElementById("filterSwitches").value.toLowerCase();
	let showONOnly = document.getElementById("showONOnly").checked;
	let showOFFOnly = document.getElementById("showOFFOnly").checked;
	for (let eSwitch of eSwitches) {
		let switchId = parseInt(eSwitch.getAttribute("data-switchId"));
		let switchValue = $.$gameSwitches.value(switchId);
		if (switchValue) {
			eSwitch.classList.remove("switchOff");
			eSwitch.classList.add("switchOn");						
		} else {
			eSwitch.classList.remove("switchOn");
			eSwitch.classList.add("switchOff");
		}
		let switchName = $.$gameSwitches.getName(switchId);
		if (
		(switchName !== "" && showNamelessSwitches) 
		|| (switchName === "" && showNamedSwitches)
		|| (switchId != filterSwitches && !switchName.toLowerCase().includes(filterSwitches))
		|| (showONOnly && !switchValue)
		|| (showOFFOnly && switchValue)
		)
			eSwitch.classList.add("hidden");
		else
			eSwitch.classList.remove("hidden");
		eSwitch.querySelectorAll('.val')[0].checked = switchValue;
	}
};

function getSwitchesViewHeader() {
	return `
		<h1>Game Switches <span onmouseenter="showTooltip()" onmouseleave="hideTooltip()" class="showInfoTooltip">&#x2139;</span></h1>
		<div class="info invisible">
			<p><span style="color: steelblue; font-size: 18px; font-weight: bold">Game Switches</span> are <b>boolean value (on:true</b> or <b>off:false)</b> that can be toggled at any time using the <i>Control Switches</i> event command.</p>
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
					<span id="slider-title">Show Named / Nameless</span>
					<div id="slider">
						<input data-default="false" onlick="updateSliderPos(this); updateSwitches();" type="radio" name="slider-option" id="showNamelessSwitches" value="1" required>
						<label for="showNamelessSwitches" data-slider-option="Nameless"></label>
						<input data-default="true" onclick="updateSliderPos(this); updateSwitches();" type="radio" name="slider-option" id="noFilterNamed" value="2" required checked>
						<label for="noFilterNamed" data-slider-option="No Filter"></label>
						<input data-default="false" onclick="updateSliderPos(this); updateSwitches();" type="radio" name="slider-option" id="showNamedSwitches" value="3" required>
						<label for="showNamedSwitches" data-slider-option="Named"></label>
						<div id="slider-pos"></div>
					</div>
				</div>
			</form>
			<form id="form-slider" onchange="saveConfig()">
				<button type="submit" disabled style="display: none" aria-hidden="true"></button>
				<div>
					<span id="slider-title">Show ON / OFF</span>
					<div id="slider">
						<input data-default="false" onclick="updateSliderPos(this); updateSwitches();" type="radio" name="slider-option" id="showONOnly" value="1" required>
						<label for="showONOnly" data-slider-option="ON"></label>
						<input data-default="true" onclick="updateSliderPos(this); updateSwitches();" type="radio" name="slider-option" id="noFilterState" value="2" required checked>
						<label for="noFilterState" data-slider-option="No Filter"></label>
						<input data-default="false" onclick="updateSliderPos(this); updateSwitches();" type="radio" name="slider-option" id="showOFFOnly" value="3" required>
						<label for="showOFFOnly" data-slider-option="OFF"></label>
						<div id="slider-pos"></div>
					</div>
				</div>
			</form>
			<form onchange="saveConfig()">
				<button type="submit" disabled style="display: none" aria-hidden="true"></button>
				<label class="form-control-filter">
					<span>Filter</span>
					<input data-default="" onchange="updateSwitches()" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
						type="text" placeholder="Enter ID or name" id="filterSwitches" name="filterSwitches"
					>
				</label>
			</form>
		</div>
		<div class="textRight">
			<span class="hyperlink" onclick="resetFilters()">Reset filters</span>
		</div>
	`;
};

function getSwitchElem2(switchId, switchName, switchValue, color) {
	return `
		<div data-switchId="${switchId}" class="switch ${switchValue ? 'switchOn' : 'switchOff'}">
			<div class="textCenter">
				<hr class="divider3 ${switchValue ? 'linearBackgroundGreen' : 'linearBackgroundRed'}"> 
				<h4 data-switchId="${switchId}" onclick="toggleSwitch(${switchId}); refreshView();" class="marginAuto pointer">
					<span class="squareTitle padding5 floatLeft paddingB15 bgRoot colorRoot borderColorRoot marginR5">
						${(switchId)}
					</span>
					<input class="toggle val floatLeft" type="checkbox" ${switchValue}/>
					${ switchName !== '' ? '<span class="squareTitle padding5 floatLeft paddingB15 bgRoot colorRoot borderColorRoot marginL5">' + switchName + '</span>' : ''}
					
					${ switchId < 2 ? '<span class="switchId">ID:</span>' : ''}
					${ (switchName !== '' && switchId < 2) ? '<span class="switchName">Name:</span>' : ''}
				</h4>
			</div>
		</div>`;
};

function getSwitchElem(switchId, switchName, switchValue, color) {
	return `
		<span data-switchId="${switchId}" onclick="toggleSwitch(${switchId}); refreshView();" class="switch ${color}">
			<span class="switchHeader padding0 bold fontSansSerif">
				<span class="square block">${switchId}</span> 
				<span class="block padding5">${switchName}</span>
			</span>
			<input class="toggle val" type="checkbox" ${switchValue}/>
		</span>`;
};


function toggleSwitch(switchId) {
	if (!switchId)
		return;
	$.$gameSwitches.setValue(switchId, !$.$gameSwitches.value(switchId));
};