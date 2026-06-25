frappe.ui.form.on("Purchase Order", {
    setup(frm) {
        frm.set_query("item_code", "items", function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];

            return {
                query: "bsipl_development.bsipl_development.doctype.product_code.product_code.get_items_by_product_code",
                filters: {
                    product_code: row.custom_product_code || ""
                }
            };
        });
    },

    refresh(frm) {
        frm.set_query("item_code", "items", function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];

            return {
                query: "bsipl_development.bsipl_development.doctype.product_code.product_code.get_items_by_product_code",
                filters: {
                    product_code: row.custom_product_code || ""
                }
            };
        });
    }
});

frappe.ui.form.on("Purchase Order Item", {
    custom_product_code(frm, cdt, cdn) {
        frappe.model.set_value(cdt, cdn, "item_code", "");
    }
});
