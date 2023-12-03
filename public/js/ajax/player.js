// Page Initialization
$("#myTbody").empty();
showPreloader();

$.ajax({
    type: "GET",
    url: "/api/players",
})
.then((items) => {
    if (items.length == 0) {
        showNoData();
        return;
    }
    items.forEach(player => {
        $("#myTbody").append(`
        <tr>
            <td>
                <a href="/player/edit/${player.id}/">คุณ ${player.name}</a>
            </td>
        </tr>
        `);
    });
    showTable();
});