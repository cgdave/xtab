(function($) {
	$.fn.xtab = function(act) {
		function col(n) {
			if (n < 26)
				return String.fromCharCode(n + 65);
			else
				return String.fromCharCode(n/26 + 64) + String.fromCharCode(n%26 + 65);
		}
		var id = $(this).attr("id");
		if (act == "init") {
			var opts = arguments[1];
			if (opts === undefined) opts = {};
			if (opts.rows === undefined || parseInt(opts.rows) < 0) opts.rows = 10;
			if (opts.cols === undefined || parseInt(opts.cols) < 0) opts.cols = 5;
			var t = $("<table/>").addClass("xtab");
			if (opts.headers) {
				var hr = $("<tr/>");
				hr.append($("<th/>"));
				for (var j = 1; j <= opts.cols; j++) hr.append($("<th/>").text(col(j - 1)));
				t.append(hr);
			}
			for (var i = 1; i <= opts.rows; i++) {
				r = $("<tr/>");
				if (opts.headers) r.append($("<th/>").text(i));
				for (var j = 1; j <= opts.cols; j++) {
					var c = $("<input/>", { type: "text", id: id + "-" + (i-1) + "-" + (j-1) });
					if (opts.change) c.change(function() {
						var i = $(this);
						var n = i.attr("id").split("-");
						opts.change.call(this, parseInt(n[1]), parseInt(n[2]), i.val());
					});
					if (opts.width > 0) c.css("width", opts.width + "px");
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
			$("#" + id + "-0-0").focus();
			return this;
		} else if (act == "val") {
			var i = -1;
			var j = -1;
			if (arguments.length > 1 && typeof arguments[1] === "string") {
				var c = arguments[1].toUpperCase();
				if (c.length == 2) {
					i = c.charCodeAt(0) - 65;
					j = parseInt(c.substring(1)) - 1;
				} else if (c.length == 3) {
					i = (c.charCodeAt(0) - 65) * 26 + c.charCodeAt(1) - 65;
					j = parseInt(c.substring(2)) - 1;
				}
			} else if (arguments.length > 2) {
				i = parseInt(arguments[1]);
				j = parseInt(arguments[2]);
			}
			if (i >= 0 && j >=0) {
				return $("#" + id + "-" + i + "-" + j).val();
			} else {
				var v = [];
				$(this).find(".xtab tr").each(function() {
					var r = [];
					$(this).find("input").each(function() {
						r.push($(this).val());
					});
					if (r.length > 0) v.push(r);
				});
				return v;
			}
		} else {
			console.error("Unknown action: " + act);
		}
	};
}(jQuery));
