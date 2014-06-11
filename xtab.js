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
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[2]);
							if (i > 0) $("#" + n[1] + "-" + (i-1)).focus();
						} else if (k == 38) {
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[1]);
							if (i > 0) $("#" + (i-1) + "-" + n[2]).focus();
						} else if (k == 39) {
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[2]);
							if (i < nc) $("#" + n[1] + "-" + (i+1)).focus();
						} else if (k == 40 || k == 13) {
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[1]);
							if (i < nr) $("#" + (i+1) + "-" + n[2]).focus();
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
