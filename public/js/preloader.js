const preloader = document.querySelector(".preloader");
const table = document.querySelector(".table-wrapper");
const noData = document.querySelector(".noData");

function getDate() {
	const date = new Date();
	let day = String(date.getDate()).padStart(2, "0");
	let month = String(date.getMonth() + 1).padStart(2, "0");
	let year = date.getFullYear();
	let currentDate = `${year}-${month}-${day}`;
	return currentDate;
}
function showPreloader() {
    preloader.style.display = "flex";
    table.style.display = "none";
    noData.style.display = "none";
}

function showNoData() {
    preloader.style.display = "none";
    table.style.display = "none";
    noData.style.display = "flex";
}

function showTable() {
    preloader.style.display = "none";
    table.style.display = "flex";
    noData.style.display = "none";
}