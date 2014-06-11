(function($) {
	$.fn.xtab = function(act, opts) {
		var id = $(this).attr("id");
		if (opts === undefined) opts = {};
		if (act == "init" && opts.rows > 0 && opts.cols > 0) {
			var t = $("<table/>").addClass("xtab");
			if (opts.headers) {
				var hr = $("<tr/>");
				hr.append($("<th/>"));
				for (var j = 1; j <= opts.cols; j++) hr.append($("<th/>").text(j));
				t.append(hr);
			}
			for (var i = 1; i <= opts.rows; i++) {
				r = $("<tr/>");
				if (opts.headers) r.append($("<th/>").text(i));
				for (var j = 1; j <= opts.cols; j++) {
					var c = $("<input/>", { type: "text", id: id + "-" + i + "-" + j });
					if (opts.change) c.change(function() {
						var i = $(this);
						var n = i.attr("id").split("-");
						opts.change.call(this, parseInt(n[1]), parseInt(n[2]), i.val());
					});
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
							if (i < opts.cols) $("#" + id + "-" + n[1] + "-" + (i+1)).focus();
						} else if (k == 40 || k == 13) {
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[1]);
							if (i < opts.rows) $("#" + id + "-" + (i+1) + "-" + n[2]).focus();
						}
					})));
				}
				t.append(r);
			}
			$(this).append(t);
			$("#" + id + "-1-1").focus();
			return this;
		} else if (act == "val") {
			var v = [];
			$(this).find(".xtab tr").each(function() {
				var r = [];
				$(this).find("input").each(function() {
					
					r.push($(this).val());
				});
				if (r.length > 0) v.push(r);
			});
			return v;
		} else {
			console.error("Unknown action: " + act);
		}
	};
}(jQuery));
