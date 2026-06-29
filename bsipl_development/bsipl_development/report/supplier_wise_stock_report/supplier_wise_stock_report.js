// // Copyright (c) 2026, Sukku and contributors
// // For license information, please see license.txt

// frappe.query_reports["Supplier Wise Stock Report"] = {
// 	filters: [
// 		{fieldname:"supplier", label:__("Supplier"), fieldtype:"Link", options:"Supplier"},
// 		{fieldname:"from_date", label:__("From Date"), fieldtype:"Date", default:frappe.datetime.add_months(frappe.datetime.get_today(),-1), reqd:1},
// 		{fieldname:"to_date", label:__("To Date"), fieldtype:"Date", default:frappe.datetime.get_today(), reqd:1},
// 		{fieldname:"item_code", label:__("Item"), fieldtype:"Link", options:"Item"},
// 		{fieldname:"warehouse", label:__("Warehouse"), fieldtype:"Link", options:"Warehouse"},
// 		{fieldname:"voucher_type", label:__("Voucher Type"), fieldtype:"Select", options:"\nPurchase Receipt\nPurchase Invoice"},
// 	],
// 	formatter: function(value, row, column, data, default_formatter) {
// 		value = default_formatter(value, row, column, data);
// 		if (!data) return value;
// 		if (column.fieldname === "voucher_type") {
// 			if (data.voucher_type === "Purchase Receipt")
// 				value = `<span style="color:#2e7d32;font-weight:500;">${value}</span>`;
// 			else if (data.voucher_type === "Purchase Invoice")
// 				value = `<span style="color:#1565c0;font-weight:500;">${value}</span>`;
// 		}
// 		if (column.fieldname === "qty" && flt(data.qty) > 0)
// 			value = `<b>${value}</b>`;
// 		return value;
// 	},
// };



// Copyright (c) 2026, Sukku and contributors
// For license information, please see license.txt

frappe.query_reports["Supplier Wise Stock Report"] = {
	filters: [
		{fieldname:"supplier", label:__("Supplier"), fieldtype:"Link", options:"Supplier"},
		{fieldname:"from_date", label:__("From Date"), fieldtype:"Date", default:frappe.datetime.add_months(frappe.datetime.get_today(),-1), reqd:1},
		{fieldname:"to_date", label:__("To Date"), fieldtype:"Date", default:frappe.datetime.get_today(), reqd:1},
		{fieldname:"item_code", label:__("Item"), fieldtype:"Link", options:"Item"},
		{fieldname:"warehouse", label:__("Warehouse"), fieldtype:"Link", options:"Warehouse"},
		{fieldname:"voucher_type", label:__("Voucher Type"), fieldtype:"Select", options:"\nPurchase Receipt\nPurchase Invoice"},
	],
	add_total_row: 1,
	formatter: function(value, row, column, data, default_formatter) {
		value = default_formatter(value, row, column, data);
		if (!data) return value;
		if (column.fieldname === "voucher_type") {
			if (data.voucher_type === "Purchase Receipt")
				value = `<span style="color:#2e7d32;font-weight:500;">${value}</span>`;
			else if (data.voucher_type === "Purchase Invoice")
				value = `<span style="color:#1565c0;font-weight:500;">${value}</span>`;
		}
		if (column.fieldname === "qty" && flt(data.qty) > 0)
			value = `<b>${value}</b>`;
		return value;
	},
};