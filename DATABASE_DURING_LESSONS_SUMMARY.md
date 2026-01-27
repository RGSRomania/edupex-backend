# Database Usage During Lessons - Quick Reference

## Short Answer: **NO database access during the lesson itself**

When a user is actively doing a lesson (reading content and answering questions), **zero database calls** are made. Everything is loaded from the local JSON file and browser storage.

---

## Detailed Breakdown

### 📖 **WHILE DOING A LESSON** (Sections & Questions Phases)

| Operation | Uses Database? | Uses API? | Storage Used |
|-----------|---|---|---|
| Load lesson content | ❌ No | ❌ No | `curriculum_structure.json` (local file) |
| Read sections | ❌ No | ❌ No | Client memory |
| Submit answer | ❌ No | ❌ No | Client memory |
| Show results | ❌ No | ❌ No | Client memory |
| **Total Database Hits** | **0** | **0** | - |

**Code Example:**
```javascript
// No fetch calls here - everything is local
const lesson = curriculumData[classKey][subject].find(ch => ch.number === chapterId);
const questions = lesson.questions; // Already in memory
```

---

### 🎯 **AFTER COMPLETING A LESSON** (Optional)

When user clicks "Next Lesson" after getting results, the app CAN optionally save progress:

```javascript
// Save to localStorage (browser storage - NOT database)
const progress = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
progress[`${subject}_${chapterId}_${lessonId}`] = 'completed';
localStorage.setItem('lessonProgress', JSON.stringify(progress));
```

If backend integration is enabled, progress could be saved to database:
```javascript
// OPTIONAL - Only if explicitly called by app
POST /api/progress/submit
{
  lessonId, 
  answers, 
  score
}
```

---

## What Happens Behind the Scenes

### **Phase 1: Section Reading** (No Database)
```
LessonDetailPage loaded
  ↓
curriculum_structure.json fetched (once, at start)
  ↓
Lesson data extracted (in-memory)
  ↓
Section 1 displayed
  → User reads → User clicks "Next"
  ↓
Section 2 displayed
  → User reads → User clicks "Next" / "Go to Quiz"
  ↓
Phase transitions to questions
```

### **Phase 2: Quiz/Questions** (No Database)
```
Questions displayed one at a time
  ↓
User selects answer
  → Stored in local state (React component)
  ↓
User clicks "Next" or "Submit"
  → Answer added to answers array in state
  ↓
All questions answered
  → Score calculated locally
  ↓
Results displayed
```

### **Phase 3: Results** (Optional Database)
```
Score calculation complete
  ↓
User clicks "Next Lesson" or "Back to Chapter"
  ↓
Progress saved to localStorage (browser storage)
  → lessonProgress[key] = 'completed'
  ↓
[OPTIONAL] If app calls POST /api/progress/submit:
  → MongoDB updated
  → User XP updated
  → Achievements checked
  → Database operations complete
```

---

## Data Flow Visualization

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  curriculum_structure.json (loaded once)         │   │
│  │  - Lesson content                                │   │
│  │  - Questions                                     │   │
│  │  - Sections                                      │   │
│  └──────────────────────────────────────────────────┘   │
│                      ↓ (read only)                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  LessonDetailPage Component                      │   │
│  │  - Displays sections                             │   │
│  │  - Shows questions                               │   │
│  │  - Calculates score                              │   │
│  └──────────────────────────────────────────────────┘   │
│                      ↓                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  localStorage (browser storage)                  │   │
│  │  - lessonProgress: {subject_chapter_lesson: "completed"} │
│  │  - user: {...}                                   │   │
│  └──────────────────────────────────────────────────┘   │
│                      ↓ (optional)                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  POST /api/progress/submit                       │   │
│  │  (if progress tracking enabled)                  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                      ↓ (network call)
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Server)                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  /api/progress/submit endpoint                          │
│  - Receives: answers, timeSpent, score                  │
│  - Calculates: XP earned, hearts lost                   │
│  - Updates MongoDB: Progress, User, Achievements        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Network Activity During a Lesson

### Requests Made:
1. **First Load**: Fetch `curriculum_structure.json` (~1 request)
2. **During Lesson**: 0 network requests
3. **After Completion** (optional): 1 POST request to `/api/progress/submit`

### Bandwidth Usage:
- Loading lesson: ~50-200 KB (JSON file size)
- During lesson: 0 KB
- Saving progress (optional): ~1-2 KB

---

## MongoDB Collections That COULD Be Updated

These are only updated if the backend progress endpoint is called:

```javascript
// Only touched if POST /api/progress/submit is called

Progress.create({
  user: userId,
  lesson: lessonId,
  answers: [0, 1, 2, 0],
  timeSpent: 300,
  score: 75,
  xpEarned: 75,
  heartsLost: 1,
  completed: true,
  completedAt: Date.now()
});

User.updateOne({ _id: userId }, {
  $inc: { xpPoints: 75 },
  $set: { hearts: user.hearts - 1 }
});

// Check & award achievements based on new stats
Achievement.find({ /* criteria */ });
// If unlocked:
User.updateOne({ _id: userId }, {
  $push: { achievements: achievementId }
});
```

---

## Summary Table

| Aspect | During Lesson | After Completion |
|--------|---|---|
| **Lesson Content** | Loaded from JSON | - |
| **Questions** | From JSON in memory | - |
| **User Answers** | React state + localStorage | Optionally saved to DB |
| **Score Calculation** | Client-side JavaScript | - |
| **Progress Tracking** | localStorage only | DB (if enabled) |
| **Database Calls** | **0** | **1 optional** |
| **API Calls** | **0** | **1 optional** |
| **Network Requests** | **0** | **0-1** |

---

## Files Involved

### **Frontend Only (No Database)**
- `/frontend/src/pages/LessonDetailPage.js` - Main lesson component
- `/frontend/public/curriculum_structure.json` - Content source
- Browser `localStorage` - Session tracking

### **Backend (Optional, Only After Completion)**
- `/routes/progressRoutes.js` - POST /api/progress/submit endpoint
- `/models/Progress.js` - MongoDB Progress schema
- `/models/User.js` - MongoDB User schema
- `/models/Achievement.js` - MongoDB Achievement schema

---

## Real-World Example

When user navigates to: `http://localhost:3000/lesson/Matematica/1/1`

1. ✅ Load curriculum_structure.json (network)
2. ✅ Extract lesson #1 from chapter #1 (in-memory)
3. ✅ Display section 1/3 (no network)
4. ✅ User reads → clicks "Next" (no network)
5. ✅ Display section 2/3 (no network)
6. ✅ User reads → clicks "Next" (no network)
7. ✅ Display section 3/3 (no network)
8. ✅ User reads → clicks "Start Quiz" (no network)
9. ✅ Display question 1/3 (no network)
10. ✅ User selects answer → clicks "Next" (no network)
11. ✅ Display question 2/3 (no network)
12. ✅ User selects answer → clicks "Next" (no network)
13. ✅ Display question 3/3 (no network)
14. ✅ User selects answer → clicks "Submit" (no network)
15. ✅ Display results: 2/3 correct (no network)
16. ⚠️ User clicks "Next Lesson":
    - localStorage updated (no network)
    - [IF ENABLED] POST /api/progress/submit (1 network request)

**Total Network Requests: 2 (1 to load JSON, 1 optional for progress)**
**Total Database Hits: 0-1 (depends on if progress endpoint is called)**

---

## Conclusion

- **Lessons are 100% client-side** - No database needed during the lesson
- **Progress tracking is optional** - Database can be enabled or disabled
- **The app is completely offline-capable** - Users can do lessons without internet
- **Database is only used for gamification** - XP, hearts, achievements, streaks, etc.


