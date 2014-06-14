(function($) {
	$.fn.xtab = function(act) {
		function n2c(n) {
			if (n < 26)
				return String.fromCharCode(n + 65);
			else
				return String.fromCharCode(n/26 + 64) + String.fromCharCode(n%26 + 65);
		}
		function c2n(c) {
			if (c.length == 1) {
				return c.charCodeAt(0) - 65;
			} else if (c.length == 2) {
				return (c.charCodeAt(0) - 65) * 26 + c.charCodeAt(1) - 65;
			}
		}
		function n2r(n) {
			return n + 1;
		}
		function r2n(r) {
			return parseInt(r) - 1;
		}
		function ref(r, c) {
			return n2c(c) + n2r(r);
		}
		function cell(id, arguments) {
			var r = -1;
			var c = -1;
			if (arguments.length > 1 && typeof arguments[1] === "string") {
				var ref = arguments[1].toUpperCase();
				r = r2n(ref.replace(/^[A-Z]*/, ""));
				c = c2n(ref.replace(/[0-9]*$/, ""));
			} else if (arguments.length > 2) {
				r = parseInt(arguments[1]);
				c = parseInt(arguments[2]);
			}
			if (r >= 0 && c >=0)
				return $("#" + id + "-" + r + "-" + c);
		}
		function get(cell) {
			if (cell !== undefined) return cell.val();
		}
		function set(cell, val) {
			if (cell === undefined) return;
			/*if (typeof val == "boolean" && cell[0].tagName == "INPUT") {
				var id = cell.attr("id");
				var p = cell.parent().empty();
				cell = $("<select/>", { id: id }).append($("<option/>").val("true").text("Yes")).append($("<option/>").val("false").text("No"));
				p.append(cell);
			}*/
			cell.val(val);
		}
		function css(cell, attr, val) {
			if (cell === undefined) return;
			cell.css(attr, val);
		}
		var id = $(this).attr("id");
		if (act == "init") {
			var opts = arguments[1];
			if (opts === undefined) opts = {};
			if (opts.rows === undefined || parseInt(opts.rows) < 0) opts.rows = 10;
			if (opts.cols === undefined || parseInt(opts.cols) < 0) opts.cols = 5;
			var tab = $("<table/>").addClass("xtab");
			if (opts.headers) {
				var row = $("<tr/>");
				row.append($("<th/>"));
				for (var c = 0; c < opts.cols; c++) row.append($("<th/>").text(n2c(c)));
				tab.append(row);
			}
			for (var r = 0; r < opts.rows; r++) {
				var row = $("<tr/>");
				if (opts.headers) row.append($("<th/>").text(n2r(r)));
				for (var c = 0; c < opts.cols; c++) {
					var cell = $("<input/>", { type: "text", id: id + "-" + r + "-" + c }).data("ref", ref(r, c));
					if (opts.values !== undefined && opts.values[r] !== undefined && opts.values[r][c] !== undefined) set(cell, opts.values[r][c]);
					if (opts.change !== undefined) cell.change(function() {
						var cell = $(this);
						var n = cell.attr("id").split("-");
						opts.change.call(this, parseInt(n[1]), parseInt(n[2]), cell.val(), cell.data("ref"));
					});
					var w = typeof opts.width == "object" ? opts.width[c] : opts.width;
					if (w > 0) cell.css("width", w + "px");
					row.append($("<td/>").append(cell.keydown(function(e) {
						var k = e.keyCode;
						if (k == 37) {
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[2]);
							if (i > 0) $("#" + id + "-" + n[1] + "-" + (i - 1)).focus();
						} else if (k == 38) {
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[1]);
							if (i > 0) $("#" + id + "-" + (i - 1) + "-" + n[2]).focus();
						} else if (k == 39) {
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[2]);
							if (i < opts.cols) $("#" + id + "-" + n[1] + "-" + (i + 1)).focus();
						} else if (k == 40 || k == 13) {
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[1]);
							if (i < opts.rows) $("#" + id + "-" + (i + 1) + "-" + n[2]).focus();
						}
					})));
				}
				tab.append(row);
			}
			$(this).append(tab);
			$("#" + id + "-0-0").focus();
			return this;
		} else if (act == "get") {
			if (arguments.length == 1) {
				var tab = [];
				$(this).find(".xtab tr").each(function() {
					var row = [];
					$(this).find("input").each(function() {
						row.push($(this).val());
					});
					if (row.length > 0) tab.push(row);
				});
				return tab;
			} else {
				return get(cell(id, arguments));
			}
		} else if (act == "set") {
			set(cell(id, arguments), arguments[arguments.length - 1]);
		} else if (act == "color") {
			css(cell(id, arguments), "background-color", arguments[arguments.length - 1]);
		} else {
			console.error("Unknown action: " + act);
		}
	};
}(jQuery));
