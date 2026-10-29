# TaskFlow — Student Task Manager

TaskFlow is a clean, modern, beginner-friendly web dashboard crafted specifically for students to organize assignments, coursework, deadlines, and daily goals. 

Built with pure **HTML5, CSS3, and Vanilla JavaScript**, it runs entirely offline in any modern web browser with zero installation steps, backend setup, or external dependencies.

---

## 📸 Overview

As a student, keeping track of varying deadlines across multiple subjects can quickly become overwhelming. TaskFlow provides a streamlined, distraction-free environment with:
- An at-a-glance dashboard with dynamic progress metrics
- Categorized student tasks (Study, Project, Personal, Other)
- Due date tracking with smart indicators (Overdue, Due Today, Tomorrow)
- Seamless browser-level data persistence through `localStorage`

---

## ✨ Features

1. **Interactive Dashboard**:
   - Welcome banner: *"Welcome back! Let's organize your day."*
   - Four real-time calculated statistic cards:
     - **Total Tasks**: Total count of all registered tasks.
     - **Completed Tasks**: Tasks you have successfully checked off.
     - **Pending Tasks**: Upcoming items requiring your attention.
     - **Completion Rate**: Visual progress percentage indicator.
   - Dynamic today's date badge in the header.

2. **Task Management**:
   - Quick "Add Task" modal dialog with keyboard accessibility (press `ESC` or click cancel).
   - Form fields for:
     - **Task Title** (validated to prevent blank entries)
     - **Category** (*Study*, *Project*, *Personal*, or *Other*)
     - **Due Date** (with helpful defaults)
   - Real-time updates: statistics and task lists refresh immediately upon addition.

3. **Task List & Interactive Controls**:
   - Clean card-based layout with custom interactive checkboxes.
   - Distinctive visual styling for finished tasks (strikethrough and subtle opacity change).
   - Color-coded category tags for quick visual scanning.
   - Smart due date tags displaying relative time (*"Due Today"*, *"Due Tomorrow"*, or *"Overdue"*).
   - One-click deletion with instantaneous list updates and feedback toast.

4. **Multi-level Filtering & Live Search**:
   - Filter by status: **All Tasks**, **Pending Tasks**, and **Completed Tasks**.
   - Filter by category: **Study**, **Project**, **Personal**, and **Other**.
   - Live search input: Filter tasks as you type without page reloads.
   - Quick sorting: Sort by earliest due date, latest due date, alphabetical, or newest added.

5. **Beginner-Friendly Empty States**:
   - Helpful, friendly empty state messages when no tasks match a selected filter.
   - Quick action button to create a task directly from the empty screen.

6. **Sample Data on First Launch**:
   - Automatically populates 5 realistic student sample tasks on first launch:
     1. *Complete assignment* (Study)
     2. *Prepare presentation* (Project)
     3. *Revise computer networks* (Study)
     4. *Submit internship report* (Project)
     5. *Review project documentation* (Other, Completed)
   - Does not repopulate if the user clears or modifies their tasks.

7. **Responsive & Modern Design**:
   - Tasteful purple and blue accent color scheme (`#4f46e5`, `#2563eb`).
   - Clean white and light-grey background (`#f8fafc`).
   - Sidebar navigation drawer on mobile and tablet devices.
   - Zero external font or icon downloads needed (uses embedded SVG icons for instant 100% offline loading).

---

## 🛠️ Technologies Used

* **HTML5**: Semantic document structure (`<aside>`, `<header>`, `<main>`, `<section>`).
* **CSS3**: Custom CSS variables, Flexbox, CSS Grid, media queries, and smooth transitions.
* **Vanilla JavaScript (ES6+)**: Event listeners, array methods (`map`, `filter`, `sort`), DOM manipulation, and `localStorage` API.

> **No frameworks, no build tools, no Node.js, and no external libraries required.**

---

## 📁 Folder Structure

```
TaskFlow/
│
├── index.html        # Main HTML structure and semantic dashboard layout
├── style.css         # Styling, purple & blue color theme, and responsive breakpoints
├── script.js         # JavaScript application logic, state management, and LocalStorage
└── README.md         # Comprehensive documentation and project guide
```

*(Note: The project files are also available directly in the root workspace directory for immediate convenience).*

---

## 🚀 How to Run the Project Locally

Running TaskFlow requires **no terminal commands, no package installations, and no local server**:

### Method 1: Direct File Open (Easiest)
1. Navigate to the project folder on your computer:
   ```
   d:\riddhima project\
   ```
   or
   ```
   d:\riddhima project\TaskFlow\
   ```
2. Double-click **`index.html`** (or right-click and choose **Open With** → **Google Chrome**, **Microsoft Edge**, **Mozilla Firefox**, or **Safari**).
3. The application will open instantly in your web browser.

### Method 2: Via Visual Studio Code Live Server (Optional)
1. Open the project folder in VS Code.
2. If you have the **Live Server** extension installed, right-click `index.html` and select **"Open with Live Server"**.

---

## 💾 How LocalStorage is Used

The browser's `localStorage` API allows web applications to store key-value data persistently on your laptop's browser without requiring an external database or server:

1. **Storage Keys**:
   - `taskflow_tasks`: Stores the array of task objects as a JSON string.
   - `taskflow_initialized`: Stores a boolean flag (`'true'`) to remember that sample tasks have already been populated.

2. **How Data is Saved**:
   Whenever a task is added, marked as complete/pending, or deleted, the updated task array is converted to a string using `JSON.stringify()`:
   ```javascript
   localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
   ```

3. **How Data is Loaded**:
   When `index.html` loads, the app reads the stored string using `localStorage.getItem()` and converts it back into JavaScript objects using `JSON.parse()`:
   ```javascript
   const savedTasks = localStorage.getItem('taskflow_tasks');
   tasks = savedTasks ? JSON.parse(savedTasks) : [];
   ```

4. **Persistence**:
   Even if you refresh the browser page, restart your browser, or shut down your laptop, all your tasks and completion states remain safely preserved.

---

## 👨‍💻 Understanding the Code (For Beginners)

- **`index.html`**: Structured into a responsive sidebar (`<aside class="sidebar">`), top navigation (`<header class="topbar">`), 4 stat cards (`<section class="stats-grid">`), and a task list (`<section class="task-section">`).
- **`style.css`**: Uses centralized CSS variables at the top of the file (`:root`) so you can easily change accent colors, card radii, or font sizes.
- **`script.js`**: Separated into numbered, documented modules:
  1. *State & LocalStorage Keys*
  2. *DOM Element References*
  3. *Sample Data Generator*
  4. *LocalStorage Save/Load*
  5. *Dashboard Dynamic Calculations*
  6. *Filtering and Sorting*
  7. *HTML Rendering & Date Formatting*
  8. *Task Add/Toggle/Delete Actions*
  9. *Modal Dialog Controls & Validation*
  10. *Filter Event Handlers*
  11. *App Bootstrap Initialization*

---

## 📄 License

This project is created for educational and personal productivity use. Feel free to customize and expand it!

