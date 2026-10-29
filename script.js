/**
 * TaskFlow — Student Task Manager
 * Main JavaScript Application File
 * Designed for beginners: simple, cleanly organized, well-commented code.
 */

// ==========================================
// 1. STATE & LOCAL STORAGE KEYS
// ==========================================

// Keys used to save and retrieve information from browser LocalStorage
const STORAGE_KEY_TASKS = 'taskflow_tasks';
const STORAGE_KEY_INIT = 'taskflow_initialized';

// In-memory application state
let tasks = [];
let currentFilter = 'all';       // 'all' | 'pending' | 'completed'
let currentCategory = 'all';     // 'all' | 'Study' | 'Project' | 'Personal' | 'Other'
let searchQuery = '';
let currentSort = 'due-asc';     // 'due-asc' | 'due-desc' | 'title-asc' | 'created-desc'


// ==========================================
// 2. DOM ELEMENT REFERENCES
// ==========================================

// Dashboard Stat Elements
const statTotalEl = document.getElementById('statTotal');
const statCompletedEl = document.getElementById('statCompleted');
const statPendingEl = document.getElementById('statPending');
const statRateEl = document.getElementById('statRate');
const statRateBarEl = document.getElementById('statRateBar');

// Sidebar Badges
const badgeAllEl = document.getElementById('badgeAll');
const badgePendingEl = document.getElementById('badgePending');
const badgeCompletedEl = document.getElementById('badgeCompleted');

// Task List & Empty State Elements
const taskListContainer = document.getElementById('taskListContainer');
const emptyStateContainer = document.getElementById('emptyState');
const emptyStateTitleEl = document.getElementById('emptyStateTitle');
const emptyStateDescEl = document.getElementById('emptyStateDesc');
const activeFilterLabelEl = document.getElementById('activeFilterLabel');
const taskCountTextEl = document.getElementById('taskCountText');

// Modal & Form Elements
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitleInput');
const taskCategorySelect = document.getElementById('taskCategorySelect');
const taskDueDateInput = document.getElementById('taskDueDateInput');
const titleError = document.getElementById('titleError');
const openAddModalBtn = document.getElementById('openAddModalBtn');
const quickAddBtn = document.getElementById('quickAddBtn');
const emptyAddBtn = document.getElementById('emptyAddBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');

// Filter & Search Controls
const filterButtons = document.querySelectorAll('.filter-btn');
const navButtons = document.querySelectorAll('.nav-item');
const categoryButtons = document.querySelectorAll('.category-item');
const taskSearchInput = document.getElementById('taskSearchInput');
const taskSortSelect = document.getElementById('taskSortSelect');

// Mobile Sidebar Controls
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('openSidebarBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Header Date Display
const currentDateText = document.getElementById('currentDateText');

// Toast Notification
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');
let toastTimer = null;


// ==========================================
// 3. SAMPLE DATA GENERATOR
// ==========================================

/**
 * Creates 5 realistic initial tasks for student users
 * Used only when the application is launched for the first time.
 */
function getInitialSampleTasks() {
  const today = new Date();
  
  // Helper to format a relative date as YYYY-MM-DD
  const formatDateOffset = (offsetDays) => {
    const target = new Date();
    target.setDate(today.getDate() + offsetDays);
    return target.toISOString().split('T')[0];
  };

  return [
    {
      id: 'task_' + Date.now() + '_1',
      title: 'Complete assignment',
      category: 'Study',
      dueDate: formatDateOffset(1), // Tomorrow
      completed: false,
      createdAt: new Date(today.getTime() - 86400000 * 2).toISOString()
    },
    {
      id: 'task_' + Date.now() + '_2',
      title: 'Prepare presentation',
      category: 'Project',
      dueDate: formatDateOffset(3), // In 3 days
      completed: false,
      createdAt: new Date(today.getTime() - 86400000).toISOString()
    },
    {
      id: 'task_' + Date.now() + '_3',
      title: 'Revise computer networks',
      category: 'Study',
      dueDate: formatDateOffset(2), // In 2 days
      completed: false,
      createdAt: new Date(today.getTime() - 86400000 * 3).toISOString()
    },
    {
      id: 'task_' + Date.now() + '_4',
      title: 'Submit internship report',
      category: 'Project',
      dueDate: formatDateOffset(0), // Today
      completed: false,
      createdAt: new Date(today.getTime() - 86400000 * 4).toISOString()
    },
    {
      id: 'task_' + Date.now() + '_5',
      title: 'Review project documentation',
      category: 'Other',
      dueDate: formatDateOffset(-1), // Yesterday
      completed: true,
      createdAt: new Date(today.getTime() - 86400000 * 5).toISOString()
    }
  ];
}


// ==========================================
// 4. LOCAL STORAGE FUNCTIONS
// ==========================================

/**
 * Loads tasks from the browser's LocalStorage.
 * If opened for the very first time, loads sample tasks.
 */
function loadTasksFromStorage() {
  try {
    const isInitialized = localStorage.getItem(STORAGE_KEY_INIT);
    const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);

    if (!isInitialized) {
      // First time launch: populate sample tasks
      tasks = getInitialSampleTasks();
      saveTasksToStorage();
      localStorage.setItem(STORAGE_KEY_INIT, 'true');
    } else {
      // Return saved tasks or empty array if user deleted everything
      tasks = savedTasks ? JSON.parse(savedTasks) : [];
    }
  } catch (error) {
    console.error('Error loading tasks from LocalStorage:', error);
    tasks = [];
  }
}

/**
 * Saves the current tasks array to browser LocalStorage as JSON.
 */
function saveTasksToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to LocalStorage:', error);
  }
}


// ==========================================
// 5. DASHBOARD CALCULATIONS
// ==========================================

/**
 * Calculates statistics (Total, Completed, Pending, Completion Rate)
 * and updates the 4 dashboard summary cards dynamically.
 */
function updateDashboardStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Update Summary Cards
  statTotalEl.textContent = total;
  statCompletedEl.textContent = completed;
  statPendingEl.textContent = pending;
  statRateEl.textContent = `${rate}%`;
  statRateBarEl.style.width = `${rate}%`;

  // Update Sidebar Badges
  if (badgeAllEl) badgeAllEl.textContent = total;
  if (badgePendingEl) badgePendingEl.textContent = pending;
  if (badgeCompletedEl) badgeCompletedEl.textContent = completed;
}


// ==========================================
// 6. TASK FILTERING & SORTING
// ==========================================

/**
 * Filters and sorts tasks based on active filter, category, search, and sort order.
 * @returns {Array} List of tasks ready for rendering
 */
function getFilteredAndSortedTasks() {
  let result = tasks.filter(task => {
    // 1. Status Filter (All, Pending, Completed)
    if (currentFilter === 'pending' && task.completed) return false;
    if (currentFilter === 'completed' && !task.completed) return false;

    // 2. Category Filter
    if (currentCategory !== 'all' && task.category !== currentCategory) return false;

    // 3. Search Query Filter (case-insensitive)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      const titleMatch = (task.title || '').toLowerCase().includes(query);
      const catMatch = (task.category || '').toLowerCase().includes(query);
      if (!titleMatch && !catMatch) return false;
    }

    return true;
  });

  // 4. Sorting logic
  result.sort((a, b) => {
    if (currentSort === 'due-asc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    } else if (currentSort === 'due-desc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return b.dueDate.localeCompare(a.dueDate);
    } else if (currentSort === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (currentSort === 'created-desc') {
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    }
    return 0;
  });

  return result;
}


// ==========================================
// 7. TASK LIST RENDERING & EMPTY STATES
// ==========================================

/**
 * Formats a due date string (YYYY-MM-DD) into user-friendly text
 * with smart indicators (Due Today, Tomorrow, Overdue, or Formatted Date).
 */
function formatDueDate(dateString, isCompleted) {
  if (!dateString) {
    return { text: 'No due date', className: '' };
  }

  const parts = dateString.split('-');
  const dueDate = new Date(parts[0], parts[1] - 1, parts[2]);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (!isCompleted && diffDays < 0) {
    return { text: `Overdue (${Math.abs(diffDays)}d ago)`, className: 'overdue' };
  } else if (!isCompleted && diffDays === 0) {
    return { text: 'Due Today', className: 'due-today' };
  } else if (!isCompleted && diffDays === 1) {
    return { text: 'Due Tomorrow', className: '' };
  } else {
    // Formats like "Oct 30, 2026"
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return { text: dueDate.toLocaleDateString(undefined, options), className: '' };
  }
}

/**
 * Renders the tasks list and handles empty states.
 */
function renderTaskList() {
  const filteredTasks = getFilteredAndSortedTasks();

  // Update Section Subheading
  let filterName = 'All Tasks';
  if (currentFilter === 'pending') filterName = 'Pending Tasks';
  if (currentFilter === 'completed') filterName = 'Completed Tasks';
  if (currentCategory !== 'all') filterName += ` · ${currentCategory}`;
  if (searchQuery.trim()) filterName += ` · Matching "${searchQuery}"`;

  activeFilterLabelEl.textContent = filterName;
  taskCountTextEl.textContent = `${filteredTasks.length} task${filteredTasks.length === 1 ? '' : 's'}`;

  // Handle Empty State
  if (filteredTasks.length === 0) {
    taskListContainer.innerHTML = '';
    taskListContainer.style.display = 'none';
    emptyStateContainer.style.display = 'flex';

    if (searchQuery.trim() !== '') {
      emptyStateTitleEl.textContent = 'No matching tasks found';
      emptyStateDescEl.textContent = `No tasks match "${searchQuery}". Try adjusting your search term or clearing filters.`;
    } else if (currentFilter === 'completed') {
      emptyStateTitleEl.textContent = 'No completed tasks yet';
      emptyStateDescEl.textContent = 'Keep working on your pending tasks. Check them off when finished!';
    } else if (currentFilter === 'pending') {
      emptyStateTitleEl.textContent = 'No pending tasks!';
      emptyStateDescEl.textContent = 'You are all caught up on your assignments! Time to relax or set new goals.';
    } else if (currentCategory !== 'all') {
      emptyStateTitleEl.textContent = `No tasks in ${currentCategory}`;
      emptyStateDescEl.textContent = `You don't have any tasks categorized under ${currentCategory} yet.`;
    } else {
      emptyStateTitleEl.textContent = 'Your task list is empty';
      emptyStateDescEl.textContent = 'Start organizing your day by adding your first school assignment or personal task.';
    }
    return;
  }

  // Hide empty state and show list container
  emptyStateContainer.style.display = 'none';
  taskListContainer.style.display = 'flex';

  // Build task cards HTML
  taskListContainer.innerHTML = filteredTasks.map(task => {
    const isCompletedClass = task.completed ? 'is-completed' : '';
    const isCheckedClass = task.completed ? 'checked' : '';
    const categoryLower = (task.category || 'other').toLowerCase();
    const dateInfo = formatDueDate(task.dueDate, task.completed);

    // Escape HTML to prevent injection
    const escapedTitle = escapeHtml(task.title);

    return `
      <div class="task-card ${isCompletedClass}" data-id="${task.id}">
        <div class="task-left">
          
          <!-- Checkbox Toggle -->
          <div 
            class="custom-checkbox ${isCheckedClass}" 
            role="checkbox" 
            aria-checked="${task.completed}" 
            tabindex="0"
            title="${task.completed ? 'Mark as pending' : 'Mark as completed'}"
            onclick="toggleTaskStatus('${task.id}')"
            onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleTaskStatus('${task.id}');}"
          >
            <svg class="checkmark-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <!-- Task Information -->
          <div class="task-info">
            <span class="task-title">${escapedTitle}</span>
            <div class="task-meta">
              <!-- Category Badge -->
              <span class="badge-category badge-${categoryLower}">
                ${task.category}
              </span>

              <!-- Due Date Badge -->
              <span class="badge-date ${dateInfo.className}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${dateInfo.text}</span>
              </span>
            </div>
          </div>

        </div>

        <!-- Task Actions -->
        <div class="task-right">
          <button 
            class="btn-icon-delete" 
            onclick="deleteTask('${task.id}')" 
            title="Delete task"
            aria-label="Delete task: ${escapedTitle}"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Escapes unsafe characters for safe DOM insertion.
 */
function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}


// ==========================================
// 8. TASK ACTIONS (ADD, COMPLETE, DELETE)
// ==========================================

/**
 * Adds a new task to the list after form validation.
 */
function handleAddTask(event) {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const category = taskCategorySelect.value;
  const dueDate = taskDueDateInput.value;

  // Validation: Check if title is empty
  if (!title) {
    titleError.classList.add('visible');
    taskTitleInput.classList.add('has-error');
    taskTitleInput.focus();
    return;
  }

  // Create new task object
  const newTask = {
    id: 'task_' + Date.now(),
    title: title,
    category: category || 'Other',
    dueDate: dueDate || '',
    completed: false,
    createdAt: new Date().toISOString()
  };

  // Add to state and save to LocalStorage
  tasks.unshift(newTask);
  saveTasksToStorage();

  // Refresh UI
  updateDashboardStats();
  renderTaskList();

  // Close modal and show feedback toast
  closeModal();
  showToast(`Task "${title}" added successfully!`);
}

/**
 * Toggles a task's status between completed and pending.
 * @param {string} taskId - The unique ID of the task
 */
function toggleTaskStatus(taskId) {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;

  const currentStatus = tasks[taskIndex].completed;
  tasks[taskIndex].completed = !currentStatus;

  saveTasksToStorage();
  updateDashboardStats();
  renderTaskList();

  if (tasks[taskIndex].completed) {
    showToast('Task marked as completed! 🎉');
  } else {
    showToast('Task moved back to pending');
  }
}

/**
 * Deletes a task from the list and LocalStorage.
 * @param {string} taskId - The unique ID of the task
 */
function deleteTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  const taskName = task ? task.title : 'Task';

  tasks = tasks.filter(t => t.id !== taskId);

  saveTasksToStorage();
  updateDashboardStats();
  renderTaskList();

  showToast(`Deleted "${taskName}"`);
}


// ==========================================
// 9. MODAL CONTROLS & FORM HELPERS
// ==========================================

/**
 * Opens the task creation modal.
 */
function openModal() {
  taskModal.classList.add('open');
  taskForm.reset();
  titleError.classList.remove('visible');
  taskTitleInput.classList.remove('has-error');
  
  // Set default due date to tomorrow for convenience
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  taskDueDateInput.value = tomorrow.toISOString().split('T')[0];

  // Auto-focus title input
  setTimeout(() => {
    taskTitleInput.focus();
  }, 100);
}

/**
 * Closes the task creation modal.
 */
function closeModal() {
  taskModal.classList.remove('open');
  titleError.classList.remove('visible');
  taskTitleInput.classList.remove('has-error');
}

/**
 * Shows a friendly toast notification for 2.5 seconds.
 */
function showToast(message) {
  toastMessage.textContent = message;
  toastNotification.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 2500);
}


// ==========================================
// 10. FILTER & SEARCH HANDLERS
// ==========================================

/**
 * Sets the active status filter ('all', 'pending', 'completed')
 * and synchronizes top toolbar buttons and sidebar navigation buttons.
 */
function setFilter(filterType) {
  currentFilter = filterType;

  // Sync toolbar pill buttons
  filterButtons.forEach(btn => {
    if (btn.dataset.filter === filterType) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Sync sidebar navigation items
  navButtons.forEach(btn => {
    if (btn.dataset.filter === filterType) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderTaskList();
}

/**
 * Sets category filter ('all', 'Study', 'Project', 'Personal', 'Other')
 */
function setCategory(category) {
  currentCategory = category;

  categoryButtons.forEach(btn => {
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderTaskList();
}


// ==========================================
// 11. INITIALIZATION & EVENT LISTENERS
// ==========================================

/**
 * Sets up all click, change, and key event listeners.
 */
function setupEventListeners() {
  // Modal open triggers
  if (openAddModalBtn) openAddModalBtn.addEventListener('click', openModal);
  if (quickAddBtn) quickAddBtn.addEventListener('click', openModal);
  if (emptyAddBtn) emptyAddBtn.addEventListener('click', openModal);

  // Modal close triggers
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
  if (taskModal) {
    taskModal.addEventListener('click', (e) => {
      // Close when clicking outside dialog
      if (e.target === taskModal) closeModal();
    });
  }

  // Keyboard accessibility: ESC key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && taskModal.classList.contains('open')) {
      closeModal();
    }
  });

  // Form Submission
  taskForm.addEventListener('submit', handleAddTask);

  // Clear validation error when user types
  taskTitleInput.addEventListener('input', () => {
    if (taskTitleInput.value.trim()) {
      titleError.classList.remove('visible');
      taskTitleInput.classList.remove('has-error');
    }
  });

  // Toolbar Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
    });
  });

  // Sidebar Nav Items (also act as filters)
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
      // On mobile, close sidebar after clicking nav link
      closeSidebar();
    });
  });

  // Sidebar Category Filters
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setCategory(btn.dataset.category);
      closeSidebar();
    });
  });

  // Search input handler (instant live filtering)
  taskSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTaskList();
  });

  // Sort dropdown handler
  taskSortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTaskList();
  });

  // Mobile Sidebar Drawer
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
  }

  if (openSidebarBtn) openSidebarBtn.addEventListener('click', openSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);
}

/**
 * Displays today's date in the top bar header.
 */
function displayCurrentDate() {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const todayStr = new Date().toLocaleDateString(undefined, options);
  if (currentDateText) {
    currentDateText.textContent = todayStr;
  }
}

/**
 * Main application bootstrap function.
 */
function initTaskFlow() {
  displayCurrentDate();
  loadTasksFromStorage();
  updateDashboardStats();
  renderTaskList();
  setupEventListeners();
}

// Start application once DOM is fully parsed
document.addEventListener('DOMContentLoaded', initTaskFlow);
