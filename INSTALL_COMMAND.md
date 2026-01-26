# 🚀 INSTALLATION COMMAND - COPY & PASTE

## The Problem You Had:
```
adb: failed to install /Users/mdica/PycharmProjects/EduPex/EduPex-release.apk: 
Failure [INSTALL_PARSE_FAILED_NO_CERTIFICATES: Failed to collect certificates...]
```

---

## ✅ The Solution:

The release APK is **unsigned**. Instead, use the **debug APK** which is already properly signed.

---

## 🎯 COMMAND TO RUN:

```bash
adb install -r /Users/mdica/PycharmProjects/EduPex/EduPex-debug.apk
```

**Just copy-paste this command into your terminal and run it!**

---

## ✨ What Will Happen:

✅ APK will install successfully
✅ No certificate errors
✅ App will be ready to use
✅ You can test the evaluation form with real curriculum questions

---

## 📦 APK FILES AVAILABLE:

**Use THIS one** (Signed - Works):
```
✅ EduPex-debug.apk
```

**NOT this one** (Unsigned - Fails):
```
❌ EduPex-release.apk
```

---

## 🎯 That's It!

Just run the command above and your app will install perfectly.

---

**Status**: Ready to install ✅

**Command**: `adb install -r /Users/mdica/PycharmProjects/EduPex/EduPex-debug.apk`

**Result**: App installs and works! 🎉

