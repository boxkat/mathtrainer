var buttons = document.getElementsByClassName("btn");

document.getElementById("sfx-status").innerText =
    localStorage.getItem("sfx");
document.getElementById("darktheme-status").innerText =
	localStorage.getItem("darktheme");
document.getElementById("alternateoperators-status").innerText =
	localStorage.getItem("darktheme");
document.getElementById("monofonts-status").innerText =
	localStorage.getItem("monofonts");

function toggle(setting) {
	if (localStorage.getItem(setting) == "false") {
		localStorage.setItem(setting, true);
	} else {
		localStorage.setItem(setting, false);
	}
    document.getElementById(setting + "-status").innerText = localStorage.getItem(setting);
    updateDisplaySettings();
}