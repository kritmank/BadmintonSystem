$("#form").submit(e => {
	e.preventDefault();

	if ($("#py1").val() == "") {
		$("#py1").val("None");
	};
	if ($("#py2").val() == "") {
		$("#py2").val("None");
	};
	if ($("#py3").val() == "") {
		$("#py3").val("None");
	};
	if ($("#py4").val() == "") {
		$("#py4").val("None");
	};

	const player_list = {
		"py1": $("#py1").val(),
		"py2": $("#py2").val(),
		"py3": $("#py3").val(),
		"py4": $("#py4").val(),
	};
    const emptyCount = Object.values(player_list).filter(
			(value) => value == "" || value == "None"
		).length;

    if (emptyCount == 4) {
        Swal.fire({
            title: "Error !",
            text: "กรุณาเลือกผู้เล่นอย่างน้อย 1 คน",
            icon: "error",
            confirmButtonText: "OK",
        });
        return false;
    } else {
		$("#form").off("submit").submit();
        return true;
    }
});

["py1", "py2", "py3", "py4"].forEach((id) => autocomplete(id));