(function($) {
    $.fn.xtab = function(act, nr, nc) {
		var id = $(this).attr("id");
		if (act == "init" && parseInt(nr) > 0 && parseInt(nc) > 0) {
			var t = $("<table/>").addClass("xtab");
			for (var i = 1; i <= nr; i++) {
				var r = $("<tr/>");
				for (var j = 1; j <= nc; j++) {
					var c = $("<input/>", { type: "text", id: id + "-" + i + "-" + j });
					r.append($("<td/>").append(c.keydown(function(e) {
						var k = e.keyCode;
						if (k == 37) {
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[2]);
							if (i > 0) $("#" + id + "-" + n[1] + "-" + (i-1)).focus();
						} else if (k == 38) {
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[1]);
							if (i > 0) $("#" + id + "-" + (i-1) + "-" + n[2]).focus();
						} else if (k == 39) {
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[2]);
							if (i < nc) $("#" + id + "-" + n[1] + "-" + (i+1)).focus();
						} else if (k == 40 || k == 13) {
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[1]);
							if (i < nr) $("#" + id + "-" + (i+1) + "-" + n[2]).focus();
						}
					})));
				}
				t.append(r);
			}
			$(this).append(t);
        	return this;
		} else if (act == "val") {
			var v = []
			$(this).find(".xtab tr").each(function() {
				var r = [];
				$(this).find("input").each(function() {
					r.push($(this).val());
				});
				v.push(r);
			});
			return v;
		} else {
			console.error("Unknown action: " + act);
		}
    };
}(jQuery));
