function fillOptions(arr, id, parent) {
    const inp = document.getElementById(id);
	let currentFocus;

	inp.addEventListener("input", function (e) {
        let a,
        b,
        val = this.value;
		closeAllLists();
		if (!val) {
            return false;
		}
		currentFocus = -1;
        
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");

		if (parent == null) {
			this.parentNode.appendChild(a);
		} else {
			parent.appendChild(a);
		}
        
		arr.forEach((py) => {
            if (py.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
				b.innerHTML += py;
				b.innerHTML += "<input type='hidden' value='" + py + "'>";
				b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
					closeAllLists();
				});
				a.appendChild(b);
			}
		});
	});
    
	inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
            currentFocus++;
			addActive(x);
		} else if (e.keyCode == 38) {
            currentFocus--;
			addActive(x);
		} else if (e.keyCode == 13) {
            e.preventDefault();
			if (currentFocus > -1) {
                if (x) x[currentFocus].click();
			}
		}
	});
	function addActive(x) {
        if (!x) return false;
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = x.length - 1;
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
		for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	document.addEventListener("click", function (e) {
        closeAllLists(e.target);
	});
}

function autocomplete(id, parent=null) {
    $.ajax({
        type: "GET",
        url: "/api/players",
    }).then((items) => {
        items = items.map((py) => py.name);
        fillOptions(items, id, parent);
    });
}