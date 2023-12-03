$("#form").submit(async e => {
    e.preventDefault();
    const name = $("#name").val();
    
    const res = await $.ajax({
				type: "POST",
				url: "/api/player-find",
				data: { name: name },
			});
    if (res.status) {
        Swal.fire({
            title: "Error !",
            text: "ชื่อผู้เล่นซ้ำ",
            icon: "error",
            confirmButtonText: "OK",
        });
        return false;
    } else {
        $("#form").off("submit").submit();
        return true;
    }
});