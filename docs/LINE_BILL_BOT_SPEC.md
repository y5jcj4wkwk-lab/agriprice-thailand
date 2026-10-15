# LINE Bill Bot Spec — Handwritten Agri Sales Bills (Palm Oil)

> Status: DRAFT — ready to implement when Grok Bots become available.
> Created: 2026-10-15

## Goal
A LINE bot that reads handwritten bills (photos) for daily agricultural produce sales — starting with palm oil — and posts structured summaries back into the LINE group so no one has to manually tally them.

## Input
- Photos of handwritten bills sent into a LINE group/chat
- One bill per photo; volume is low: roughly 2–3 bills per week
- Fields to extract per bill:
  - Purchase/sale date
  - Unit price (changes daily — must be read from each bill, never hardcoded)
  - Amount / quantity (e.g., kilograms)
  - Optionally: buyer name, product type

## Core flow
1. User sends a bill photo in LINE
2. Bot runs OCR on the handwritten text
3. If OCR is unclear or a field is missing, bot asks the sender to input the value manually (date, price, quantity)
4. Bot shows the extracted numbers and asks the sender to **confirm** they are correct before saving
5. On confirm: save the bill (image + structured data + who sent it + who confirmed + timestamps)
6. Post a **daily notification** in the group: today's sales — quantity, unit price, total
7. Post a **monthly accumulated summary**: total quantity (amount), total revenue, average unit price
8. Attach a **trend chart image** (unit price per day) generated with matplotlib/chart.js, sent as a photo in the chat

## Storage
- Running log of every bill: original image + OCR text + confirmed fields + sender + confirmer + timestamps (audit trail)
- Daily unit prices retained for trend comparison
- LINE Notes: short accumulated text summary (low volume, fine)
- LINE Album: original bill photos
- Export: Excel / CSV for accounting or downstream processing

## Extra features (nice to have)
- Search past bills in LINE: e.g. type "ปาล์ม ตุลาคม" and the bot returns matching entries
- Anomaly alert: if today's unit price is far outside the recent normal range, flag it (possible OCR error or a real market move) instead of silently saving
- Product type separation: palm oil today; rubber, rice, cassava later — same bot, different categories
- Test with 10–20 real bills before launch to measure OCR accuracy on this handwriting

## Tech notes
- LINE Messaging API for receiving photos, sending text/images, quick-reply buttons for confirm/edit
- OCR engine capable of Thai handwriting (evaluate options; accuracy is the main risk)
- Chart generation: matplotlib (server-side) or chart.js
- Planned home: this repo (agriprice-thailand) alongside the existing crop-price site
- Blocked on: Grok Bots not included in current plan — implement as a standalone LINE bot service when ready
