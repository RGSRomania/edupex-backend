# Manual.pdf Extraction & Integration Plan

## Current Status
- **File**: `/Users/mdica/PycharmProjects/EduPex/Planificari + Manual + Culegeri/Clasa a V a/Matematica/Manual.pdf` (30MB)
- **Destination**: `curriculum_structure.json` - Matematica section for Clasa a V a
- **Current Structure**: 6 chapters with 13+ lessons each

## Current Curriculum Structure (Clasa a V a - Matematica)

```
Chapter 1: "Operații cu numere" (13 lessons)
Chapter 2: ? 
Chapter 3: ?
Chapter 4: ?
Chapter 5: ?
Chapter 6: ?
```

Each lesson currently has:
- `number` (string)
- `name` (string)
- `summary` (string - markdown)
- `questions` (array)
- `sections` (array with title, content, order)

## Extraction Plan

### Step 1: Extract PDF Content
We need to extract from Manual.pdf:
- ✅ Lesson titles
- ✅ Lesson content (text, examples, notes)
- ✅ Images/graphics/diagrams
- ✅ Mathematical formulas
- ✅ Practice examples
- ✅ Key concepts

### Step 2: Create Intermediate JSON
Create a raw JSON file with extracted content:
```json
{
  "chapter_1": {
    "name": "...",
    "lessons": [
      {
        "number": "1",
        "name": "...",
        "content": "...",
        "images": ["path1", "path2"],
        "formulas": ["..."],
        "examples": ["..."]
      }
    ]
  }
}
```

### Step 3: Consultation Points

**Before we extract, we need to decide:**

1. **Image Handling**
   - Option A: Extract images to a folder and reference them by path in JSON
   - Option B: Convert images to base64 and embed in JSON
   - Option C: Keep image references as file paths to extract later

2. **Content Organization**
   - Should each section in the PDF become a separate "section" object in the JSON?
   - Should we maintain the PDF's subsection structure?

3. **Summary vs Sections**
   - Should `summary` be the full lesson overview?
   - Should `sections` break it down into bite-sized pieces?

4. **Questions**
   - Are there questions in the Manual.pdf we should extract?
   - Or should we use existing questions in curriculum_structure.json?

5. **Scope**
   - Extract ALL 6 chapters from the Manual?
   - Or start with Chapter 1 as a pilot?

---

## Questions for You

Before I start the extraction, please clarify:

1. **How should we handle images?**
   - Extract and store separately, or reference embedded data, or just skip for now?

2. **What's the target structure?**
   - Should the extracted content perfectly match current `curriculum_structure.json` format?
   - Or create new intermediate format first, then convert?

3. **Scope of extraction:**
   - Full Manual (all chapters)?
   - Just Chapter 1 as test/pilot?
   - Specific chapters only?

4. **Questions:**
   - Extract practice questions from Manual?
   - Keep existing curriculum questions?
   - Mix both?

5. **Timeline:**
   - Extract everything at once?
   - Do incremental extraction (chapter by chapter)?

---

## Recommended Approach

Given the 30MB PDF size, I suggest:

1. **Start with Chapter 1 only** as a pilot
2. **Extract text + save images separately** (don't embed)
3. **Create intermediate JSON** with all raw content
4. **Review and approve** before integrating to curriculum_structure.json
5. **Then scale to remaining chapters**

This way we can validate the format before processing all 6 chapters.

---

## Files That Will Be Created

1. `matematica_clasa_5_manual_extraction_raw.json` - Raw extracted content
2. `matematica_clasa_5_manual_extraction_processed.json` - Processed & formatted
3. `extracted_images/` directory - All extracted images
4. `extraction_report.md` - Summary of what was extracted

Then, final step:
5. Update `curriculum_structure.json` with new `summary` field for each lesson


