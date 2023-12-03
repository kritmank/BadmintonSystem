// Page Initialization
const date = getDate();
$("#myTbody").empty();
$("#selected_date").val(date);
$("#notify-btn").click(e => {
    $.ajax({
        type: "GET",
        url: "/api/payment-notify/" + date,
    });
    Swal.fire({
        icon: "success",
        title: "ส่งข้อมูลเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 1500,
    });
});
showPreloader();

$(document).ready(async () => {
    const items = await $.ajax({
        type: "GET",
        url: "/api/payment-by-date/" + date,
    })
    
    if (items.length == 0) {
        showNoData();
        return;
    }
    const payments = items[0];
    for (const py in payments) {
        $("#myTbody").append(`
        <tr>
            <td>${py}</td>
            <td>${payments[py]}</td>
        </tr>
        `);
    }
    showTable();
});

// Date Picker
$("#selected_date").change(e => {
    e.preventDefault();
    const date = $("#selected_date").val();
    $("#notify-btn").click(e => {
        $.ajax({
            type: "GET",
            url: "/api/payment-notify/" + date,
        });
        Swal.fire({
            icon: "success",
            title: "ส่งข้อมูลเรียบร้อยแล้ว",
            showConfirmButton: false,
            timer: 1500,
        });
    })

    $("#myTbody").empty();
    $.ajax({
        type: "GET",
        url: "/api/payment-by-date/" + date,
    })
    .then((items) => {
        if (items.length == 0) {
            showNoData();
            return;
        }
        const payments = items[0];
        for (const py in payments) {
            $("#myTbody").append(`
            <tr>
                <td>${py}</td>
                <td>${payments[py]}</td>
            </tr>
            `);
        }
        showTable();
    });
});