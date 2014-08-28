(function($) {
	$.fn.xtab = function() {
		var id = $(this).attr("id");
		var opts = $(this).data("opts");
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
		function find() {
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
		function val(c, v) {
			if (c === undefined) return;
			if (v === undefined) return c.val();
			c.val(v);
		}
		function css(c, a, v) {
			if (c === undefined || a === undefined) return;
			if (v === undefined) return c.css(a);
			c.css(a, v);
		}
		function color(c, v) {
			css(c, "background-color", v)
		}
		function readonly(c, v) {
			if (c === undefined) return;
			if (v === undefined) return c.prop("readonly");
			c.prop("readonly", v);
			if (v) c.addClass("readonly");
			else c.removeClass("readonly");
		}
		var act = args.shift();
		if (act == "init") {
			opts = args.shift();
			if (opts === undefined) opts = {};
			if (opts.rows === undefined || parseInt(opts.rows) < 0) opts.rows = 10;
			if (opts.cols === undefined || parseInt(opts.cols) < 0) opts.cols = 5;
			var tab = $("<table/>").addClass("xtab");
			if (opts.collabels) {
				var row = $("<tr/>");
				if (opts.rowlabels)
					row.append($("<th/>"));
				for (var c = 0; c < opts.cols; c++) {
					if ($.isFunction(opts.collabels)) {
						var v = opts.collabels.call(this, c);
						if (!v) continue;
						row.append(v.is && v.is("th") ? v : $("<th/>").text(v));
					} else
						row.append($("<th/>").text(n2c(c)));
				}
				tab.append(row);
			}
			for (var r = 0; r < opts.rows; r++) {
				var row = $("<tr/>");
				if (opts.rowlabels) {
					if ($.isFunction(opts.rowlabels)) {
						var v = opts.rowlabels.call(this, r);
						if (!v) continue;
						row.append(v.is && v.is("th") ? v : $("<th/>").text(v));
					} else
						row.append($("<th/>").text(n2r(r)));
				}
				for (var c = 0; c < opts.cols; c++) {
					var cell = $("<input/>", { type: "text", id: id + "-" + r + "-" + c }).prop("readonly", false).data("ref", ref(r, c));
					var v = undefined;
					if ($.isFunction(opts.values))
						v = opts.values.call(this, r, c);
					else if (opts.values !== undefined && opts.values[r] !== undefined && opts.values[r][c] !== undefined)
						v = opts.values[r][c];
					if (v !== undefined) {
						if ($.isPlainObject(v)) {
							val(cell, v.value);
							if (v.readonly !== undefined)
								readonly(cell, v.readonly);
							if (v.color !== undefined)
								color(cell, v.color);
						} else
							val(cell, v);
					}
					if (opts.change !== undefined) cell.change(function() {
						var cell = $(this);
						var n = cell.attr("id").split("-");
						opts.change.call(this, parseInt(n[1]), parseInt(n[2]), cell.val(), cell.data("ref"));
					});
					var w = 0;
					if (opts.widths !== undefined)
						w = $.isFunction(opts.widths) ? opts.widths.call(this, c) : opts.widths[c] !== undefined ? opts.widths[c] : opts.widths;
					if (w !== undefined && w > 0)
						cell.css("width", Math.round(w) + "px");
					row.append($("<td/>").append(cell.keydown(function(e) {
						var k = e.keyCode;
						var p = e.target.selectionStart;
						var ro = $(this).prop("readonly")
						if (k == 37 && (ro || p == 0)) { // left
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[2]);
							if (i > 0) $("#" + id + "-" + n[1] + "-" + (i - 1)).focus();
						} else if (k == 38) { // up
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[1]);
							if (i > 0) $("#" + id + "-" + (i - 1) + "-" + n[2]).focus();
						} else if (k == 39 && (ro || p == e.target.value.length)) { // right
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[2]);
							if (i < opts.cols) $("#" + id + "-" + n[1] + "-" + (i + 1)).focus();
						} else if (k == 40 || k == 13) { // down or enter
							e.preventDefault();
							var n = $(this).attr("id").split("-");
							var i = parseInt(n[1]);
							if (i < opts.rows) $("#" + id + "-" + (i + 1) + "-" + n[2]).focus();
						} else if (k == 8 && ro) { // backspace (to avoid going back one page e.g. in Chrome)
							e.preventDefault();
						}
					})));
				}
				tab.append(row);
			}
			$(this).append(tab);
			$(this).data("opts", opts);
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
				return val(find(), args[0]);
		} else if (act == "focus") {
			return find().focus();
		} else if (act == "css") {
			return css(find(), args[0], args[1]);
		} else if (act == "color") {
			return color(find(), args[0]);
		} else if (act == "readonly") {
			return readonly(find(), args[0]);
		} else {
			console.error("Unknown action: " + act);
		}
	};
}(jQuery));
