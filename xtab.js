(function($) {
	$.fn.xtab = function() {
		var id = $(this).attr("id");
		var args = [];
		for (var i = 0; i < arguments.length; i++) args.push(arguments[i]); // arguments is not a regular array
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
		function cell() {
			var r = -1;
			var c = -1;
			if (args.length > 0 && typeof args[0] === "string") {
				var ref = args.shift().toUpperCase();
				r = r2n(ref.replace(/^[A-Z]*/, ""));
				c = c2n(ref.replace(/[0-9]*$/, ""));
			} else if (args.length > 1) {
				r = parseInt(args.shift());
				c = parseInt(args.shift());
			}
			if (r >= 0 && c >=0)
				return $("#" + id + "-" + r + "-" + c);
		}
		function val(cell, val) {
			if (cell === undefined) return;
			if (val === undefined) return cell.val();
			cell.val(val);
		}
		function css(cell, attr, val) {
			if (cell === undefined || attr === undefined) return;
			if (val === undefined) return cell.css(attr);
			cell.css(attr, val);
		}
		function readonly(cell, val) {
			if (cell === undefined) return;
			if (val === undefined) return cell.prop("readonly");
			cell.prop("readonly", val);
			if (val) cell.addClass("readonly");
			else cell.removeClass("readonly");
		}
		var act = args.shift();
		if (act == "init") {
			var opts = args.shift();
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
					var cell = $("<input/>", { type: "text", id: id + "-" + r + "-" + c }).prop("readonly", false).data("ref", ref(r, c));
					if (opts.values !== undefined && opts.values[r] !== undefined && opts.values[r][c] !== undefined) val(cell, opts.values[r][c]);
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
						} else if (k == 8 && $(this).prop("readonly")) { // avoid backspace to to back one page (e.g. in Chrome)
							e.preventDefault();
						}
					})));
				}
				tab.append(row);
			}
			$(this).append(tab);
			$("#" + id + "-0-0").focus();
			return this;
		} else if (act == "val") {
			if (args.length == 0) {
				var tab = [];
				$(this).find(".xtab tr").each(function() {
					var row = [];
					$(this).find("input").each(function() {
						row.push($(this).val());
					});
					if (row.length > 0) tab.push(row);
				});
				return tab;
			} else
				return val(cell(), args[0]);
		} else if (act == "color") {
			return css(cell(), "background-color", args[0]);
		} else if (act == "readonly") {
			return readonly(cell(), args[0]);
		} else {
			console.error("Unknown action: " + act);
		}
	};
}(jQuery));
