# JSON Structure Used in the Application

## Overview
The endpoint `http://localhost:3000/lesson/Limba%20și%20literatura%20română/1/1` retrieves lesson data from the **`curriculum_structure.json`** file on the frontend, not from a backend API.

---

## Root-Level Structure

The JSON is organized by **Class Level** (Grade):

```json
{
  "Clasa a V a": { ... },
  "Clasa a VI a": { ... },
  "Clasa a VII a": { ... },
  "Clasa a VIII a": { ... }
}
```

---

## Subject Level (Inside Class)

Under each class, subjects are organized:

```json
{
  "Clasa a V a": {
    "Limba și literatura romnă": [ ... ],
    "Matematica": [ ... ]
  }
}
```

---

## Chapter Structure (Inside Subject)

Chapters are an array of objects with the following structure:

```json
{
  "number": "1",
  "name": "Despre mine. Selfie",
  "lectii": [ ... ]
}
```

**Fields:**
- `number`: String - Chapter number/identifier
- `name`: String - Chapter title
- `lectii`: Array - Array of lessons in this chapter

---

## Lesson Structure (Inside Chapter)

Each lesson object contains:

```json
{
  "number": "1",
  "name": "Textul literar. Prietenul meu de Ioana Prvu",
  "summary": "## Textul Literar: 'Prietenul meu' de Ioana Prvu\n\n### Ce este un text literar?\n...",
  "questions": [ ... ],
  "sections": [ ... ]
}
```

**Main Fields:**
- `number`: String - Lesson number/identifier
- `name`: String - Lesson title
- `summary`: String - Full lesson summary (markdown formatted)
- `questions`: Array - Quiz questions for this lesson
- `sections`: Array - Educational content sections

---

## Questions Array Structure

Each question in the `questions` array:

```json
{
  "questionNumber": 1,
  "questionText": "Care este motivul principal pentru care Bogdan duce pe Joi (chiul huahua-ul) la scoala?",
  "options": [
    "A. Sa-si arate dragostea fata de animale",
    "B. Sa ilustreze compunerea 'Prietenul meu cel mai bun' care i-a iesit prea scurta",
    "C. Sa joace o pacaleala colegilor",
    "D. Pentru ca profesorul de roman i l-a cerut"
  ],
  "correctAnswerIndex": 1,
  "nivelDificultate": 2
}
```

**Fields:**
- `questionNumber`: Number - Question sequence number
- `questionText`: String - The question text
- `options`: Array<String> - 4 answer options (labeled A, B, C, D)
- `correctAnswerIndex`: Number - Index of correct answer (0-3)
- `nivelDificultate`: Number - Difficulty level (1-3, where 3 is hardest)

---

## Sections Array Structure

Each section in the `sections` array:

```json
{
  "title": "Ce este un text literar?",
  "content": "Textul literar este o creație artistică a unui autor care transmite idei, emoții și sentimente ntr-un limbaj expresiv și plin de imaginație.",
  "order": 1
}
```

**Fields:**
- `title`: String - Section heading
- `content`: String - Section body text (plain or markdown formatted)
- `order`: Number - Display order of sections

---

## How the URL Maps to Data

### Example 1: Limba și Literatura Română
For the URL: `http://localhost:3000/lesson/Limba%20și%20literatura%20română/1/1`

**Parameters extracted in `LessonDetailPage.js`:**
- `subject` = "Limba și literatura română" (URL decoded)
- `chapterId` = "1" (Chapter number)
- `lessonId` = "1" (Lesson number)

**Data retrieval process:**
1. Load `curriculum_structure.json` from the frontend's public folder
2. Get user's grade level from localStorage (defaults to 5)
3. Find the appropriate class (e.g., "Clasa a V a")
4. Find the subject within that class → "Limba și literatura romnă"
5. Find the chapter by `number` matching `chapterId` → Chapter 1
6. Find the lesson by `number` matching `lessonId` → Lesson 1
7. Return complete lesson object with `sections` and `questions`

Returns lesson: **"Textul literar. Prietenul meu de Ioana Prvu"**

---

### Example 2: Matematica
For the URL: `http://localhost:3000/lesson/Matematica/1/1`

**Parameters extracted in `LessonDetailPage.js`:**
- `subject` = "Matematica" (URL decoded)
- `chapterId` = "1" (Chapter number)
- `lessonId` = "1" (Lesson number)

**Data retrieval process:**
1. Load `curriculum_structure.json` from the frontend's public folder
2. Get user's grade level from localStorage (defaults to 5)
3. Find the appropriate class (e.g., "Clasa a V a")
4. Find the subject within that class → "Matematica"
5. Find the chapter by `number` matching `chapterId` → Chapter 1
6. Find the lesson by `number` matching `lessonId` → Lesson 1
7. Return complete lesson object with `sections` and `questions`

Returns lesson: **"Scrierea și citirea numerelor naturale"**

---

## Complete Examples: Full Lesson JSON

### Example 1: Limba și Literatura Română

```json
{
  "number": "1",
  "name": "Textul literar. Prietenul meu de Ioana Prvu",
  "summary": "## Textul Literar: 'Prietenul meu' de Ioana Prvu\n\n### Ce este un text literar?\nTextul literar este o creație artistică a unui autor care transmite idei, emoții și sentimente ntr-un limbaj expresiv și plin de imaginație...",
  "questions": [
    {
      "questionNumber": 1,
      "questionText": "Care este motivul principal pentru care Bogdan duce pe Joi (chiul huahua-ul) la scoala?",
      "options": [
        "A. Sa-si arate dragostea fata de animale",
        "B. Sa ilustreze compunerea 'Prietenul meu cel mai bun' care i-a iesit prea scurta",
        "C. Sa joace o pacaleala colegilor",
        "D. Pentru ca profesorul de roman i l-a cerut"
      ],
      "correctAnswerIndex": 1,
      "nivelDificultate": 1
    },
    {
      "questionNumber": 2,
      "questionText": "Ce tip de text este 'Prietenul meu' de Ioana Prvu?",
      "options": [
        "A. Text descriptiv",
        "B. Text nonliterar",
        "C. Text literar narativ",
        "D. Text argumentativ"
      ],
      "correctAnswerIndex": 2,
      "nivelDificultate": 2
    },
    {
      "questionNumber": 3,
      "questionText": "Care dintre urmatorii enunturi este adevarat cu privire la Joi?",
      "options": [
        "A. Este o pasare mic cu codita de semicerc",
        "B. Este un chihuahua cafeniu, delicat, cu 35 cm inaltime si doar putin peste un kilogram",
        "C. Este un catel mare si puternic care latrca des",
        "D. Este un catel cu lungimea de 50 cm si care vorbeste cuvinte"
      ],
      "correctAnswerIndex": 1,
      "nivelDificultate": 3
    }
  ],
  "sections": [
    {
      "title": "Ce este un text literar?",
      "content": "Textul literar este o creație artistică a unui autor care transmite idei, emoții și sentimente ntr-un limbaj expresiv și plin de imaginație.",
      "order": 1
    },
    {
      "title": "Ce este un text literar?",
      "content": "Spre deosebire de alte texte care doar informează (textele nonliterare), textul literar creează o lume imaginară care captivează cititorul și l face să simtă profund.",
      "order": 2
    },
    {
      "title": "Povestea 'Prietenul meu'",
      "content": "Povestea lui Ioana Prvu ne prezintă aventura unui copil pe nume Bogdan din clasa a V-a...",
      "order": 3
    }
    // ... more sections ...
  ]
}
```

### Example 2: Matematica

```json
{
  "number": "1",
  "name": "Scrierea și citirea numerelor naturale",
  "summary": "## Definiții\n- • pută. Linia nesfrșită, astfel obținută, este o dreaptă . Ea este nemărginită și este formată din pu\n- • toare  adouă puncte. Primul punct este originea semidreptei, iar cel de  ‑al doilea es te un punct\n\n## Formule și Reguli\n- • A  B Punctele A și B coincid. A = B\n- • M   N Punctele M și N sunt distincte. M ≠ NDe reținut\n- • a B ≠ C ≠ D;    b A ≠ B ≠ C;    c A ≠ B = C;    d A ≠ B ≠ D.\n\n## Exemple\n- • 11 P riviți figura 9 și dați cte trei exemple de:\n- • 0 1 2 3 4 5ExempleDe reținut\n",
  "questions": [
    {
      "questionNumber": 1,
      "questionText": "Cte cifre sunt utilizate n sistemul de numerație zecimal?",
      "options": [
        "A. 9 cifre",
        "B. 10 cifre (de la 0 la 9)",
        "C. 8 cifre",
        "D. 11 cifre"
      ],
      "correctAnswerIndex": 1,
      "nivelDificultate": 1
    },
    {
      "questionNumber": 2,
      "questionText": "Care este valoarea cifrei 5 n numărul 2531?",
      "options": [
        "A. 5 unități",
        "B. 50 de unități",
        "C. 500 de unități",
        "D. 5000 de unități"
      ],
      "correctAnswerIndex": 2,
      "nivelDificultate": 2
    },
    {
      "questionNumber": 3,
      "questionText": "Cum se grupează cifrele pentru a citi numerele mari?",
      "options": [
        "A. Grupuri de 2 cifre",
        "B. Grupuri de 5 cifre",
        "C. Grupuri de 3 cifre",
        "D. Grupuri de 4 cifre"
      ],
      "correctAnswerIndex": 2,
      "nivelDificultate": 3
    }
  ],
  "sections": [
    {
      "title": "Conținut",
      "content": "Numerele naturale sunt utilizate pentru a număra și pentru a ordona obiecte. Scrierea numerelor naturale \n            se face utiliznd zece cifre: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. n sistemul de numerație zecimal (baza 10), poziția \n            unei cifre determină valoarea acesteia.",
      "order": 1
    },
    {
      "title": "Conținut",
      "content": "De exemplu, n numărul 3245, cifra 3 reprezintă 3 mii, 2 reprezintă 2 sute, \n            4 reprezintă 4 zeci, iar 5 reprezintă 5 unități. Citirea numerelor naturale se face respectnd poziția cifrelor și \n            grupurile de cte trei cifre (mii, milioane, miliarde).",
      "order": 2
    },
    {
      "title": "Conținut",
      "content": "Aceasta este fundamentală pentru nțelegerea calculelor \n            matematice ulterioare.",
      "order": 3
    }
  ]
}
```

---

## Database Involvement During Lesson Completion

### YES - Database IS Involved, But ONLY at Completion

**During the lesson (sections & questions phases):**
- ❌ **NO database access**
- ❌ **NO API calls**
- ✅ Uses only `localStorage` to track user session data
- Content is served entirely from `curriculum_structure.json`

**When the user completes the lesson (result phase):**
- ✅ **YES - Database IS involved**
- Lesson progress can be saved via backend API
- Database models: `Progress`, `Achievement`, `User`

---

### LocalStorage Usage During Lesson

The frontend uses browser **localStorage** to track lesson progress without needing a database:

```javascript
// User data (loaded at start)
const user = localStorage.getItem('user');

// Lesson progress (updated at completion)
const progress = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
progress[`${subject}_${chapterId}_${lessonId}`] = 'completed';
localStorage.setItem('lessonProgress', JSON.stringify(progress));
```

**Data stored in localStorage:**
- `user`: User account information (ID, name, gradeLevel)
- `lessonProgress`: Object tracking completed lessons by key format: `"{subject}_{chapterId}_{lessonId}": "completed"`

---

### Optional Database API Endpoints (For Progress Tracking)

These backend endpoints exist but are **NOT automatically called** during a lesson:

#### 1. **GET** `/api/progress/lesson/:lessonId` (Authenticated)
Retrieves saved progress for a specific lesson from MongoDB.

**Response:**
```json
{
  "_id": "...",
  "user": "userId",
  "lesson": "lessonId",
  "answers": [0, 1, 1, 0],
  "timeSpent": 300,
  "score": 75,
  "xpEarned": 75,
  "heartsLost": 1,
  "completed": true,
  "completedAt": "2026-01-27T10:00:00Z"
}
```

#### 2. **POST** `/api/progress/submit` (Authenticated)
Saves completed lesson progress to MongoDB with the following data:

**Request Body:**
```json
{
  "lessonId": "...",
  "answers": [0, 1, 1, 0],
  "timeSpent": 300,
  "score": 75
}
```

**What the backend does:**
- Calculates XP earned based on score
- Calculates hearts lost based on wrong answers
- Creates or updates Progress record in MongoDB
- Updates user's XP points and hearts in User collection
- Checks for level-ups and achievements
- Returns updated user stats

**Response:**
```json
{
  "message": "Progress submitted successfully",
  "progress": { /* full progress object */ },
  "user": {
    "xpPoints": 250,
    "hearts": 4,
    "level": 3,
    "leveledUp": false
  }
}
```

---

### Database Models Involved

These MongoDB collections store lesson-related data:

#### **Progress Model**
```javascript
{
  _id: ObjectId,
  user: ObjectId,           // Reference to User
  lesson: ObjectId,         // Reference to Lesson
  answers: [Number],        // Array of user's answer indices
  timeSpent: Number,        // Seconds spent on lesson
  score: Number,            // Percentage score (0-100)
  xpEarned: Number,         // XP points earned
  heartsLost: Number,       // Hearts lost due to wrong answers
  completed: Boolean,       // true if lesson completed
  completedAt: Date,        // Timestamp of completion
  createdAt: Date,
  updatedAt: Date
}
```

#### **User Model** (Updated by progress submission)
```javascript
{
  _id: ObjectId,
  xpPoints: Number,         // Total XP accumulated
  hearts: Number,           // Current hearts count
  level: Number,            // User's level (calculated from XP)
  streak: Number,           // Daily learning streak
  achievements: [ObjectId], // Array of achieved badges
  gradeLevel: Number,       // User's grade (5-8)
  completedLessons: [ObjectId]  // Array of completed lesson IDs
}
```

#### **Achievement Model** (Optional unlocks)
```javascript
{
  _id: ObjectId,
  name: String,             // Achievement name
  category: String,         // 'streak', 'lesson', 'xp', 'quiz'
  requirement: Number,      // Threshold to unlock
  xpReward: Number,         // XP gained when unlocked
  isActive: Boolean,        // Whether achievement is enabled
  icon: String,             // Badge icon reference
  description: String
}
```

---

## Complete Lesson Flow with Database Tracking

```
1. USER NAVIGATES TO LESSON
   ↓
   Load curriculum_structure.json (client-side)
   ↓
   Display lesson sections
   ↓
2. USER READS SECTIONS (No database access)
   ↓
   User clicks "Continue to evaluation"
   ↓
3. USER ANSWERS QUESTIONS (No database access)
   ↓
   Calculate score locally
   ↓
4. USER SEES RESULTS
   ↓
5. [OPTIONAL] SAVE PROGRESS TO DATABASE
   ↓
   POST /api/progress/submit with answers & score
   ↓
   Backend calculates XP, checks achievements
   ↓
   MongoDB updated with:
      - Progress record
      - User stats (XP, hearts, level)
      - New achievements (if any)
   ↓
6. USER CONTINUES TO NEXT LESSON
   ↓
   localStorage updated with completed status
```

---

## Key Characteristics

1. **Hierarchical Structure**: Class → Subject → Chapter → Lesson
2. **Client-Side Loading**: The entire `curriculum_structure.json` is loaded on the frontend
3. **Markdown Support**: The `summary` and `content` fields may contain markdown formatting
4. **Educational Design**: 
   - Each lesson has multiple sections for progressive learning
   - Questions include difficulty levels for assessment
   - Correct answer index enables automatic grading
5. **User Customization**: Lessons adapt based on user's grade level stored in localStorage
6. **Database Optional**: Content delivery is 100% client-side; database is only used for optional progress tracking

---

## File Locations
- **Frontend**: `/frontend/public/curriculum_structure.json`
- **Component**: `/frontend/src/pages/LessonDetailPage.js`
- **Backend Routes**: `/routes/progressRoutes.js`
- **MongoDB Models**: `/models/Progress.js`, `/models/User.js`, `/models/Achievement.js`

This JSON structure provides a complete, self-contained curriculum system that can function entirely on the client side. Database integration is optional and only used when progress tracking and gamification features (XP, hearts, achievements) are enabled.

