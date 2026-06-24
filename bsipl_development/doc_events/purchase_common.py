import frappe


@frappe.whitelist()
def get_last_purchase_info(item_code, supplier):
    if not item_code or not supplier:
        return None

    data = frappe.db.sql("""
        SELECT rate, doc_date
        FROM (
            SELECT
                poi.rate AS rate,
                po.transaction_date AS doc_date,
                po.creation AS creation
            FROM `tabPurchase Order Item` poi
            JOIN `tabPurchase Order` po ON po.name = poi.parent
            WHERE poi.item_code = %s
              AND po.supplier = %s
              AND po.docstatus = 1

            UNION ALL

            SELECT
                pii.rate AS rate,
                pi.posting_date AS doc_date,
                pi.creation AS creation
            FROM `tabPurchase Invoice Item` pii
            JOIN `tabPurchase Invoice` pi ON pi.name = pii.parent
            WHERE pii.item_code = %s
              AND pi.supplier = %s
              AND pi.docstatus = 1

            UNION ALL

            SELECT
                pri.rate AS rate,
                pr.posting_date AS doc_date,
                pr.creation AS creation
            FROM `tabPurchase Receipt Item` pri
            JOIN `tabPurchase Receipt` pr ON pr.name = pri.parent
            WHERE pri.item_code = %s
              AND pr.supplier = %s
              AND pr.docstatus = 1
        ) x
        ORDER BY doc_date DESC, creation DESC
        LIMIT 1
    """, (
        item_code, supplier,
        item_code, supplier,
        item_code, supplier
    ), as_dict=True)

    if data:
        return {
            "posting_date": data[0].doc_date,
            "rate": data[0].rate
        }

    return None


def set_last_purchase_info(doc, method=None):
    if not doc.get("supplier"):
        return

    for item in doc.items:
        if not item.get("item_code"):
            continue

        last = get_last_purchase_info(item.item_code, doc.supplier)

        if last:
            item.custom_last_purchase_date = last["posting_date"]
            item.custom_last_purchase_rate = last["rate"]
        else:
            item.custom_last_purchase_date = None
            item.custom_last_purchase_rate = 0
