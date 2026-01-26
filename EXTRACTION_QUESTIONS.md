# 📋 CLARIFICATION QUESTIONS FOR PDF EXTRACTION

## Current Understanding:
✅ Source: `/Planificari + Manual + Culegeri/Clasa a V a/Matematica/Manual.pdf` (30MB)
✅ Target: Update `curriculum_structure.json` with lesson content
✅ Include: Examples, graphs, notes by lesson

## Questions I Need Answered:

### 1. **Lesson Organization**
   - How should I identify lesson boundaries in the PDF?
   - Are lessons clearly marked with titles/chapters?
   - Should each chapter = one lesson, or are there sub-lessons?

### 2. **Graphics/Images**
   - Should I extract images from the PDF and save them separately?
   - Or describe them in text (e.g., "[Graph showing...]]")?
   - Where should extracted images be stored?

### 3. **Examples**
   - Include worked examples with solutions?
   - Include practice problems without solutions?
   - Both?

### 4. **Notes/Important Info**
   - Include warning boxes, tips, definitions?
   - Include exercises from lesson sections?
   - Include review questions?

### 5. **Content Structure**
   - For each lesson in JSON, should content be:
     a) One big text block?
     b) Separated by sections (Definition, Examples, Exercises)?
     c) Multiple smaller parts for easier reading?

### 6. **Volume/Size**
   - Maximum content per lesson? (some lessons might be very long)
   - Should very long lessons be split?

### 7. **Format**
   - Plain text?
   - Markdown formatting?
   - HTML?
   - Rich text with formatting?

### 8. **Special Content**
   - Include formulas/mathematical notation?
   - How to represent math (plain text, LaTeX, etc.)?

---

## What I'll Do Regardless:
✅ Extract text content from each lesson
✅ Organize by lesson structure
✅ Update curriculum_structure.json
✅ Preserve examples and important notes
✅ Keep in mind it's for a learning app

---

## Once You Answer:
I'll create an extraction script that:
1. Reads the PDF lesson by lesson
2. Extracts content (text, images, examples)
3. Organizes it properly
4. Updates your curriculum JSON

Let me know your preferences!

