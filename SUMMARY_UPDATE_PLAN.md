# 📋 SUMMARY UPDATE PLAN - Limba și Literatura Română Clasa a V-A

**Status**: Planning & Analysis Phase
**Date**: January 26, 2026
**Task**: Update curriculum_structure.json summaries with content from Manual ROMANA.doc

---

## 🎯 OBJECTIVE

Replace placeholder summaries in `curriculum_structure.json` with rich, detailed content extracted from the "Manual ROMANA.doc" file for Clasa a V-A, including:
- Full lesson descriptions
- Examples from the manual
- Key concepts and explanations
- Visual references (if images can be embedded or linked)
- Study aids and helpful content

---

## 📚 CURRENT STRUCTURE (Example)

```json
{
  "number": "1",
  "name": "Textul literar. Prietenul meu de Ioana Pârvu",
  "summary": "Lectia introductiv a Unitatii 1 prezinta textul literar...",
  "questions": [...]
}
```

---

## 🔄 STEP-BY-STEP APPROACH

### Phase 1: Extract Content from Manual
1. **Read Manual ROMANA.doc** (Clasa a V-A)
2. **Identify chapter/unit structure** (matching curriculum_structure.json)
3. **Extract lesson summaries** for each lesson:
   - Main text content
   - Examples provided
   - Key concepts
   - Study tips
   - Visual descriptions
4. **Save extracted data** in organized format

### Phase 2: Process & Format Content
1. **Clean extracted text** (remove formatting artifacts)
2. **Organize by lesson** (match to curriculum structure)
3. **Include rich content**:
   - Full descriptions
   - Examples (in text form or as structured data)
   - Learning objectives
   - Key definitions
   - Practice tips

### Phase 3: Update curriculum_structure.json
1. **Map lessons** from manual to curriculum JSON
2. **Update summary fields** with rich content
3. **Maintain JSON structure** (don't break existing questions)
4. **Add metadata** if needed (content source, difficulty, etc.)

### Phase 4: Validation
1. **Verify JSON structure** is valid
2. **Check all lessons updated** for Clasa a V-A
3. **Test in application** (API returns correct summaries)

---

## 📖 MANUAL STRUCTURE (To Confirm)

Location: `/Users/mdica/PycharmProjects/EduPex/Manuale word/Clasa a V-A/Manual ROMANA.doc`

**Expected content**:
- Introduction/Overview
- Unități (Units/Chapters) numbered 1-5 (or more)
- Lecții (Lessons) within each unit
- Theory, examples, exercises
- Images, tables, diagrams
- Study summaries

---

## 🔑 KEY QUESTIONS

Before proceeding, please confirm:

1. **Unit/Chapter Matching**:
   - Does Manual ROMANA.doc have units like "Despre mine. Selfie"?
   - Do lesson names in manual match curriculum_structure.json?

2. **Content Depth**:
   - How detailed should summaries be? (100 words? 500 words?)
   - Include practice exercises in summary or keep separate?

3. **Images/Visual Content**:
   - Should images be referenced as URLs?
   - Embedded as base64 in JSON?
   - Or described in text?

4. **Examples & Tables**:
   - Include full text of literary examples?
   - How to represent tables from manual?

---

## 📊 LESSONS IN Clasa a V-A (Current Placeholder)

### Unitatea 1: Despre mine. Selfie
1. Textul literar. Prietenul meu de Ioana Pârvu
2. Trăsături ale textului literar (actualizare)
3. Cuvânt-cheie. Tema. Planul simplu de idei
4. (More lessons to be confirmed)

---

## ⚙️ TECHNICAL APPROACH

### Option 1: Manual Mapping (Recommended for quality)
1. Manually read Manual ROMANA.doc
2. Copy relevant summaries for each lesson
3. Paste into curriculum_structure.json
4. Format and clean text
5. Test

### Option 2: Automated Extraction (If similar structure)
1. Use Python docx library to extract content
2. Parse document structure
3. Match to curriculum JSON structure
4. Automatically update fields
5. Manual review and cleanup
6. Test

### Option 3: Hybrid Approach (Best)
1. Automated extraction to get structure
2. Manual review and enhancement
3. Update JSON with enriched content
4. Validation and testing

---

## 📝 NEXT STEPS

Please confirm:
1. **Which approach** would you prefer? (Manual, Automated, or Hybrid)
2. **Content depth** - how detailed should summaries be?
3. **Image handling** - how to represent visual content?
4. **Timeline** - how many lessons to update initially? (Start with Unit 1? All units?)

Once confirmed, I'll proceed with:
- Extracting content from Manual ROMANA.doc
- Mapping to curriculum structure
- Updating curriculum_structure.json
- Testing the changes

---

## 🎯 SUCCESS CRITERIA

- ✅ All summaries in Clasa a V-A updated
- ✅ Content is richer and more educational
- ✅ JSON structure remains valid
- ✅ Questions unchanged and working
- ✅ Images/content properly referenced
- ✅ Application displays updated summaries correctly

---

**Ready to proceed once you confirm the approach and details above!**


