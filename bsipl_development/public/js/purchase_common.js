function fetch_last_purchase_info(frm, cdt, cdn) {
    let row = locals[cdt][cdn];

    if (!frm.doc.supplier || !row.item_code) {
        frappe.model.set_value(cdt, cdn, "custom_last_purchase_date", "");
        frappe.model.set_value(cdt, cdn, "custom_last_purchase_rate", 0);
        return;
    }

    frappe.call({
        method: "bsipl_development.doc_events.purchase_common.get_last_purchase_info",
        args: {
            item_code: row.item_code,
            supplier: frm.doc.supplier
        },
        callback: function(r) {
            frappe.model.set_value(cdt, cdn, "custom_last_purchase_date", r.message ? r.message.posting_date : "");
            frappe.model.set_value(cdt, cdn, "custom_last_purchase_rate", r.message ? r.message.rate : 0);
        }
    });
}

function fetch_last_purchase_for_all_items(frm) {
    if (!frm.doc.items) return;

    frm.doc.items.forEach(function(row) {
        fetch_last_purchase_info(frm, row.doctype, row.name);
    });
}

frappe.ui.form.on("Purchase Order", {
    supplier: function(frm) {
        fetch_last_purchase_for_all_items(frm);
    }
});

frappe.ui.form.on("Purchase Order Item", {
    item_code: function(frm, cdt, cdn) {
        fetch_last_purchase_info(frm, cdt, cdn);
    }
});

frappe.ui.form.on("Purchase Invoice", {
    supplier: function(frm) {
        fetch_last_purchase_for_all_items(frm);
    }
});

frappe.ui.form.on("Purchase Invoice Item", {
    item_code: function(frm, cdt, cdn) {
        fetch_last_purchase_info(frm, cdt, cdn);
    }
});

frappe.ui.form.on("Purchase Receipt", {
    supplier: function(frm) {
        fetch_last_purchase_for_all_items(frm);
    }
});

frappe.ui.form.on("Purchase Receipt Item", {
    item_code: function(frm, cdt, cdn) {
        fetch_last_purchase_info(frm, cdt, cdn);
    }
});



