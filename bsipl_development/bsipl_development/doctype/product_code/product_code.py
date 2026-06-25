# Copyright (c) 2026, Sukku and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ProductCode(Document):
    pass


@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_items_by_product_code(doctype, txt, searchfield, start, page_len, filters):
    product_code = filters.get("product_code")

    if not product_code:
        return []

    return frappe.db.sql("""
        SELECT
            name,
            item_name
        FROM `tabItem`
        WHERE disabled = 0
          AND custom_product_code = %(product_code)s
          AND (
              name LIKE %(txt)s
              OR item_name LIKE %(txt)s
          )
        ORDER BY item_name
        LIMIT %(start)s, %(page_len)s
    """, {
        "product_code": product_code,
        "txt": f"%{txt}%",
        "start": start,
        "page_len": page_len
    })