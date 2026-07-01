// frappe.ui.form.on("Purchase Order", {
//     setup(frm) {
//         frm.set_query("item_code", "items", function(doc, cdt, cdn) {
//             let row = locals[cdt][cdn];

//             return {
//                 query: "bsipl_development.bsipl_development.doctype.product_code.product_code.get_items_by_product_code",
//                 filters: {
//                     product_code: row.custom_product_code || ""
//                 }
//             };
//         });
//     },

//     refresh(frm) {
//         frm.set_query("item_code", "items", function(doc, cdt, cdn) {
//             let row = locals[cdt][cdn];

//             return {
//                 query: "bsipl_development.bsipl_development.doctype.product_code.product_code.get_items_by_product_code",
//                 filters: {
//                     product_code: row.custom_product_code || ""
//                 }
//             };
//         });
//     }
// });

// frappe.ui.form.on("Purchase Order Item", {
//     custom_product_code(frm, cdt, cdn) {
//         frappe.model.set_value(cdt, cdn, "item_code", "");
//     }
// });

const PRODUCT_CODE_ITEM_FILTERS = {
    "Purchase Order": {
        table_field: "items",
        child_doctype: "Purchase Order Item"
    },
    "Purchase Receipt": {
        table_field: "items",
        child_doctype: "Purchase Receipt Item"
    },
    "Purchase Invoice": {
        table_field: "items",
        child_doctype: "Purchase Invoice Item"
    },
    "Quotation": {
        table_field: "items",
        child_doctype: "Quotation Item"
    },
    "Sales Order": {
        table_field: "items",
        child_doctype: "Sales Order Item"
    },
    "Delivery Note": {
        table_field: "items",
        child_doctype: "Delivery Note Item"
    },
    "Sales Invoice": {
        table_field: "items",
        child_doctype: "Sales Invoice Item"
    },
    "Stock Entry": {
        table_field: "items",
        child_doctype: "Stock Entry Detail"
    },
    "Material Request": {
        table_field: "items",
        child_doctype: "Material Request Item"
    },
    "Work Order": {
        table_field: "required_items",
        child_doctype: "Work Order Item"
    },
    "BOM": {
        table_field: "items",
        child_doctype: "BOM Item"
    }
};

function apply_product_code_filter(frm) {
    const config = PRODUCT_CODE_ITEM_FILTERS[frm.doctype];

    if (!config) return;
    if (!frm.fields_dict[config.table_field]) return;

    frm.set_query("item_code", config.table_field, function(doc, cdt, cdn) {
        let row = locals[cdt][cdn];

        return {
            query: "bsipl_development.bsipl_development.doctype.product_code.product_code.get_items_by_product_code",
            filters: {
                product_code: row.custom_product_code || ""
            }
        };
    });
}

// Apply parent events
Object.keys(PRODUCT_CODE_ITEM_FILTERS).forEach(function(parent_doctype) {
    frappe.ui.form.on(parent_doctype, {
        setup(frm) {
            apply_product_code_filter(frm);
        },

        onload_post_render(frm) {
            apply_product_code_filter(frm);
        }
    });
});

// Clear item_code when product code changes
Object.values(PRODUCT_CODE_ITEM_FILTERS).forEach(function(config) {
    frappe.ui.form.on(config.child_doctype, {
        custom_product_code(frm, cdt, cdn) {
            frappe.model.set_value(cdt, cdn, "item_code", "");
        }
    });
});