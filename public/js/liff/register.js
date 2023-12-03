$(document).ready(() => {
	const input = document.getElementById("ID");
	const parent = input.parentNode.parentNode;
	autocomplete("ID", parent);
});

$("#form").submit(async (e) => {
	e.preventDefault();

	const name = $("#ID").val();
	const user_check = await $.ajax({
		type: "POST",
		url: "/api/player-find",
		data: { name: name },
	});

	if (user_check.status) {
		 $("#form").off("submit").submit();
		return true;
	} else {
		Swal.fire({
			title: "Error !",
			text: "กรุณาเลือกชื่อผู้เล่นจากที่มีอยู่แล้ว",
			icon: "error",
			confirmButtonText: "OK",
		});
		return false;
	}
});