# Copyright (c) 2026, Sukku and contributors
# For license information, please see license.txt

# import frappe


import frappe
from frappe import _

def execute(filters=None):
    filters = frappe._dict(filters or {})
    return get_columns(), get_data(filters)

def get_columns():
    return [
        {"label":_("Item"),"fieldname":"item_code","fieldtype":"Link","options":"Item","width":140},
        {"label":_("Item Name"),"fieldname":"item_name","fieldtype":"Data","width":180},
        {"label":_("Item Group"),"fieldname":"item_group","fieldtype":"Link","options":"Item Group","width":130},
        {"label":_("Warehouse"),"fieldname":"warehouse","fieldtype":"Link","options":"Warehouse","width":150},
        {"label":_("UOM"),"fieldname":"uom","fieldtype":"Link","options":"UOM","width":80},
        {"label":_("Supplier"),"fieldname":"supplier","fieldtype":"Link","options":"Supplier","width":130},
        {"label":_("Supplier Name"),"fieldname":"supplier_name","fieldtype":"Data","width":160},
        {"label":_("Supplier Part No"),"fieldname":"supplier_part_no","fieldtype":"Data","width":140},
        {"label":_("Qty"),"fieldname":"qty","fieldtype":"Float","width":90},
        {"label":_("Voucher Type"),"fieldname":"voucher_type","fieldtype":"Data","width":160},
        {"label":_("Voucher No"),"fieldname":"voucher_no","fieldtype":"Dynamic Link","options":"voucher_type","width":190},
        {"label":_("Product Code"),"fieldname":"product_code","fieldtype":"Data","width":130},
    ]

def get_data(filters):
    rows = []
    if filters.get("voucher_type") != "Purchase Invoice":
        rows += _pr_rows(filters)
    if filters.get("voucher_type") != "Purchase Receipt":
        rows += _pi_rows(filters)
    return rows

def _cond(filters, a, ia):
    c = []
    if filters.get("company"):   c.append("AND {}.company = %(company)s".format(a))
    if filters.get("from_date"): c.append("AND {}.posting_date >= %(from_date)s".format(a))
    if filters.get("to_date"):   c.append("AND {}.posting_date <= %(to_date)s".format(a))
    if filters.get("supplier"):  c.append("AND {}.supplier = %(supplier)s".format(a))
    if filters.get("item_code"): c.append("AND {}.item_code = %(item_code)s".format(ia))
    if filters.get("warehouse"): c.append("AND {}.warehouse = %(warehouse)s".format(ia))
    return " ".join(c)

def _pr_rows(filters):
    return frappe.db.sql("""
        SELECT
            pri.item_code, pri.item_name, i.item_group, pri.warehouse, pri.uom,
            pr.supplier, pr.supplier_name,
            IFNULL(isup.supplier_part_no, '') AS supplier_part_no,
            pri.qty,
            'Purchase Receipt' AS voucher_type,
            pri.parent AS voucher_no,
            '' AS product_code
        FROM `tabPurchase Receipt Item` pri
        INNER JOIN `tabPurchase Receipt` pr ON pr.name = pri.parent
        INNER JOIN `tabItem` i ON i.name = pri.item_code
        LEFT JOIN `tabItem Supplier` isup ON isup.parent = pri.item_code
            AND isup.supplier = pr.supplier
        WHERE pr.docstatus = 1 {c}
        ORDER BY pr.posting_date DESC, pri.item_code
    """.format(c=_cond(filters, "pr", "pri")), filters, as_dict=True)

def _pi_rows(filters):
    return frappe.db.sql("""
        SELECT
            pii.item_code, pii.item_name, i.item_group, pii.warehouse, pii.uom,
            pi.supplier, pi.supplier_name,
            IFNULL(isup.supplier_part_no, '') AS supplier_part_no,
            pii.qty,
            'Purchase Invoice' AS voucher_type,
            pii.parent AS voucher_no,
            '' AS product_code
        FROM `tabPurchase Invoice Item` pii
        INNER JOIN `tabPurchase Invoice` pi ON pi.name = pii.parent
        INNER JOIN `tabItem` i ON i.name = pii.item_code
        LEFT JOIN `tabItem Supplier` isup ON isup.parent = pii.item_code
            AND isup.supplier = pi.supplier
        WHERE pi.docstatus = 1 AND pi.is_return = 0 {c}
        ORDER BY pi.posting_date DESC, pii.item_code
    """.format(c=_cond(filters, "pi", "pii")), filters, as_dict=True)