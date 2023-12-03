// Page Initialization
const date = getDate();
$("#myTbody").empty();
$("#selected_date").val(date);
$("#add-game-btn").click(e => {
    window.location.href = "/game/add/" + date;
});
showPreloader();

$.ajax({
    type: "GET",
    url: "/api/game-by-date/" + date,
})
.then((items) => {
    if (items.length == 0) {
        showNoData();
        return;
    }
    for (const id in items) {
        $("#myTbody").append(`
        <tr>
            <td>${parseInt(id) + 1}</td>
            <td>${items[id].player1}</td>
            <td>${items[id].player2}</td>
            <td>${items[id].player3}</td>
            <td>${items[id].player4}</td>
            <td>${items[id].shuttle_no}</td>
            <td>
				<div class="func-wrapper">
					<a href="/game/edit/${items[id].id}" class="func-link">
						<img src="/images/edit.ico" alt="edit"/>
					</a>
					<a href="/game/delete/${items[id].id}" class="func-link func-delete">
						<img src="/images/delete.ico" alt="delete"/>
					</a>
				</div>
			</td>
        </tr>
        `);
    }
    showTable();
});

// Date Picker
$("#selected_date").change(e => {
    e.preventDefault();
    const date = $("#selected_date").val();
    $("#add-game-btn").click(e => {
        window.location.href = "/game/add/" + date;
    })

    $("#myTbody").empty();
    $.ajax({
        type: "GET",
        url: "/api/game-by-date/" + date,
    })
    .then((items) => {
        if (items.length == 0) {
            showNoData();
            return;
        }
        console.log({"items": items})
        for (const id in items) {
            console.log(items[id]);
            $("#myTbody").append(`
            <tr>
                <td>${parseInt(id) + 1}</td>
                <td>${items[id].player1}</td>
                <td>${items[id].player2}</td>
                <td>${items[id].player3}</td>
                <td>${items[id].player4}</td>
                <td>${items[id].shuttle_no}</td>
                <td>
					<div class="func-wrapper">
						<a href="/game/edit/${items[id].id}" class="func-link">
							<img src="/images/edit.ico" alt="edit"/>
						</a>
						<a href="/game/delete/${items[id].id}" class="func-link func-delete">
							<img src="/images/delete.ico" alt="delete"/>
						</a>
					</div>
				</td>
            </tr>
            `);
        }
        showTable();
    });
});