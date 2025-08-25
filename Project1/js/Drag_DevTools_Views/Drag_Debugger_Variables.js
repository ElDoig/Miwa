function initVariables() {
	view.setAttribute('data-view', 'variables');
	let viewHTML = getVariableViewHeader();
	viewHTML += `<br><div id="content">`;
	for (let [varId, varName] of $.$dataSystem.variables.entries()) {
		if (varId > 0) {
			let varValue = $.$gameVariables.value(varId) || 0;
			viewHTML += getVariableElem2(varId, varName, varValue);
		}
	}
	viewHTML += "</div>";
	view.innerHTML = viewHTML;
};

function getVariableViewHeader() {
	return `
		<h1>Game Variables <span onmouseenter="showTooltip()" onmouseleave="hideTooltip()" class="showInfoTooltip">&#x2139;</span></h1>
		<div class="info invisible">
			<p><span style="color: steelblue; font-size: 18px; font-weight: bold">Game Variables</span> are <b>numbers value</b> that can be changed at any time using the <i>Control Variables</i> event command.</p>
			<p>You can also use a <i>script call</i> to access them :</p>
			<p>- <b>$.$gameVariables.value(varID)</b> to get the value of a specific variable, where <i>varID is the variable ID in your variable list</i>.</p>
			<p> <i>e.g.</i> <b>$.$gameVariables.value(2)</b>
			<p>- <b>$.$gameVariables.set(varID, value)</b> to set a specific variable, where <i>varID is the variable ID in your variable list</i> and <i>value is a number</i>.</p>
			<p> <i>e.g.</i> <b>$.$gameSwitches.set(2, 42)</b>
		</div>
		<br>
		<div id="resultFilter">
			<form onchange="saveConfig()">
				<button type="submit" disabled style="display: none" aria-hidden="true"></button>
				<label class="form-control">
					<input data-default="true" onchange="updateVariables()" type="checkbox" id="showNamelessVariables" name="showNamelessVariables" checked>
					Nameless Variables
				</label>
				<label class="form-control">
					<input data-default="true" onchange="updateVariables()" type="checkbox" id="showEmptyVariables" name="showEmptyVariables" checked>
					Value Is 0
				</label>
			</form>
			<form onchange="saveConfig()">
				<button type="submit" disabled style="display: none" aria-hidden="true"></button>
				<label class="form-control-filter">
					<span>Filter</span>
					<input data-default="" onchange="updateVariables()" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" 
						type="text" placeholder="Enter ID or name" id="filterVariables" name="filterVariables"
					>
				</label>
			</form>
		</div>
		<div class="textRight">
			<span class="hyperlink" onclick="resetFilters()">Reset filters</span>
		</div>
	`;
};

function getVariableElem2(varId, varName, varValue) {
	return `
		<div data-varId="${varId}" class="var">
			<div class="textCenter">
				<hr class="dividerVar"> 
				<h4 class="marginAuto pointer">
					<div class="grid3">
						<div class="textRight relative">
							<span class="squareTitle padding5 hAuto bgRoot colorRoot borderColorRoot marginR5">${(varId)}</span>
							${ varId < 2 ? '<span class="varId">ID:</span>' : ''}
						</div>
						<input onpaste="this.oninput();" oninput="setVariable(${varId}, this.value); animateVariableInput(this);" class="val" type="text" value="${varValue}">
						<div class="textLeft relative">
							${ varName !== '' ? '<span class="squareTitle padding5 hAuto bgRoot colorRoot borderColorRoot marginL5">' + varName + '</span>' : ''}
							${ (varName !== '' && varId < 2) ? '<span class="varName">Name:</span>' : ''}
						</div>
					</div>
				</h4>
			</div>
		</div>`;
};

var intervalIDAnimationVariableInput;
function animateVariableInput(elem) {
	if (!elem.parentNode.parentNode.parentNode.parentNode.classList.contains("animationVariableInput")) {
		elem.parentNode.parentNode.parentNode.parentNode.classList.add("animationVariableInput");
		intervalIDAnimationVariableInput = setTimeout(removeAnimationVariableInput, 1000, elem.parentNode.parentNode.parentNode.parentNode);
	} else {
		clearInterval(intervalIDAnimationVariableInput);
		intervalIDAnimationVariableInput = setTimeout(removeAnimationVariableInput, 1000, elem.parentNode.parentNode.parentNode.parentNode);
	}
};

function removeAnimationVariableInput(elem) {
	elem.classList.remove("animationVariableInput");
	intervalIDAnimationVariableInput = null;
};

function getVariableElem(varId, varName, varValue) {
	return `
		<label data-varId="${varId}" class="form-control-text var">
			<span class="varHeader">
				<span class="square">${varId}</span>
				${varName}
			</span>
			<input onchange="setVariable(${varId}, this.value)" class="val" type="text" value="${varValue}">
		</label>`;
};

function updateVariables() {
	let eVariables = document.querySelectorAll('.var');
	if (!(eVariables.length > 0))
		return;
	let showNamelessSwitches = document.getElementById("showNamelessVariables").checked;
	let showEmptyVariables = document.getElementById("showEmptyVariables").checked;
	let filterVariables = document.getElementById("filterVariables").value.toLowerCase();
	for (eVariable of eVariables) {
		let varId = parseInt(eVariable.getAttribute("data-varId"));
		let varValue = $.$gameVariables.value(varId) || 0;
		let varName = $.$gameVariables.getName(varId);
		if (
		(varName === "" && !showNamelessSwitches)
		|| (!showEmptyVariables && !varValue)
		|| (varId != filterVariables && !varName.toLowerCase().includes(filterVariables))
		)
			eVariable.classList.add("hidden");
		else
			eVariable.classList.remove("hidden");
		let eVal = eVariable.querySelectorAll('.val')[0]; 
		if (eVal.value != varValue) {
			eVal.value = varValue;
			animateVariableInput(eVal);
		}
	}
};

function setVariable(varId, value = 0) {
	if (!switchId)
		return;
	value = !isNaN(Number(value)) ? Number(value) : value;
	$.$gameVariables.setValue(varId, value);
};