"""Generate CareNet WhatsApp app documentation DOCX with dashboard screenshots."""

from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
SCREENSHOTS = ROOT / "docs" / "screenshots"
OUTPUT = ROOT / "docs" / "CareNet-WhatsApp-App-Documentation.docx"


def add_heading(doc, text, level=1):
    doc.add_heading(text, level=level)


def add_image(doc, path, caption, width=6.2):
    if path.exists():
        doc.add_picture(str(path), width=Inches(width))
        cap = doc.add_paragraph(caption)
        cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap.runs[0].italic = True
        cap.runs[0].font.size = Pt(10)
    else:
        doc.add_paragraph(f"[Missing image: {path.name}]")
    doc.add_paragraph()


def main():
    doc = Document()

    title = doc.add_heading("CareNet WhatsApp", 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    sub = doc.add_paragraph("Shopify App — Merchant Setup & Dashboard Guide")
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub.runs[0].font.size = Pt(14)

    doc.add_paragraph(
        "CareNetSolutions · Embedded Shopify app + Theme app extension · "
        "Effective date: May 31, 2026"
    )
    doc.add_paragraph()

    add_heading(doc, "1. App Overview", 1)
    doc.add_paragraph(
        "CareNet WhatsApp adds a floating WhatsApp chat button to your Shopify storefront. "
        "Merchants configure the phone number, default message, button label, and visibility "
        "from one admin dashboard. Settings apply store-wide when the App embed is enabled."
    )

    add_heading(doc, "2. Dashboard Overview", 2)
    doc.add_paragraph(
        "After installing the app, open Apps → CareNet WhatsApp in Shopify Admin. "
        "The dashboard shows your current WhatsApp number, button status, and quick links "
        "to global settings."
    )
    add_image(doc, SCREENSHOTS / "01-dashboard-overview.png", "Figure 1 — App dashboard overview")

    add_heading(doc, "3. Configure WhatsApp Settings", 2)
    doc.add_paragraph("In Global WhatsApp Button Settings:")
    for step in [
        "Select Country (e.g. +91 India).",
        "Enter Phone number without country code (e.g. 7741092638).",
        "Set Default message (e.g. Hi, I need help.).",
        "Set Button label (e.g. Chat on WhatsApp).",
        "Toggle Keep WhatsApp button enabled ON or OFF.",
        "Click Save settings.",
    ]:
        doc.add_paragraph(step, style="List Number")
    add_image(doc, SCREENSHOTS / "03-settings-form.png", "Figure 2 — WhatsApp settings form")

    add_heading(doc, "4. Live Preview", 2)
    doc.add_paragraph(
        "The Live Preview panel updates as you edit settings and shows how the floating "
        "button will appear on your storefront."
    )
    add_image(doc, SCREENSHOTS / "04-live-preview.png", "Figure 3 — Live preview panel")

    add_heading(doc, "5. Setup Guide (Theme App Embed)", 2)
    doc.add_paragraph(
        "Important: Use App embeds, not a WhatsApp block inside a page section. "
        "A page block only shows on that one page (for example, home page only)."
    )
    for step in [
        "Fill in country, phone number, message, and label, then click Save settings.",
        "Go to Shopify Admin → Online Store → Themes → Customize.",
        "If you previously added a WhatsApp block inside a page section, remove it first.",
        "Open App embeds (puzzle icon) on the left sidebar.",
        "Turn WhatsApp Floating Button ON and click Save.",
        "Use Keep WhatsApp button enabled to show or hide the button without removing the app embed.",
        "To update the number or message later, change them in the app dashboard only.",
    ]:
        doc.add_paragraph(step, style="List Number")
    add_image(doc, SCREENSHOTS / "02-setup-guide.png", "Figure 4 — In-app setup guide")

    add_heading(doc, "6. Verify on Storefront", 2)
    for step in [
        "Open your live storefront (home, product, collection pages).",
        "Confirm the green WhatsApp button appears bottom-right on all pages.",
        "Click the button and confirm WhatsApp opens with the saved number and message.",
    ]:
        doc.add_paragraph(step, style="List Number")

    add_heading(doc, "7. Support & Privacy", 2)
    doc.add_paragraph("Support email: support@carenetsolutions.com")
    doc.add_paragraph("Privacy email: privacy@carenetsolutions.com")
    doc.add_paragraph("Privacy policy: https://carenetsolutions.co.uk/whatsapp/privacy")

    add_heading(doc, "8. Shopify App Review Instructions", 2)
    for step in [
        "Install the app on the review development store.",
        "Set Country: +91 India, Phone: valid WhatsApp number, Default message: Hi, I need help., Enable toggle: ON.",
        "Click Save settings.",
        "Go to Online Store → Themes → Customize → App embeds → enable WhatsApp Floating Button → Save.",
        "View storefront — button should appear on all pages.",
        "Click the button to verify WhatsApp opens with correct number and message.",
        "Uncheck Keep WhatsApp button enabled, save, and confirm button disappears.",
    ]:
        doc.add_paragraph(step, style="List Number")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUTPUT)
    print(f"Created: {OUTPUT}")


if __name__ == "__main__":
    main()
