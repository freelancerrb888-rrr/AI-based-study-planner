/* =========================
   QUOTES
========================= */

const quotes = [
    {
      text: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier"
    },
    {
      text: "The future depends on what you do today.",
      author: "unknown"
    },
    {
      text: "Don’t watch the clock; do what it does. Keep going.",
      author: "Sam Levenson"
    },
    {
      text: "Education is the passport to the future.",
      author: "Malcolm X"
    },
    {
      text: "Push yourself because no one else is going to do it for you.",
      author: "Unknown"
    }
  ];
  
  function loadQuotes() {
  
    const quoteElement = document.getElementById("quote");
    const authorElement = document.getElementById("author");
  
    if(!quoteElement) return;
  
    let index = 0;
  
    function showQuote() {
      quoteElement.innerText = quotes[index].text;
      authorElement.innerText = "- " + quotes[index].author;
  
      index++;
  
      if(index >= quotes.length){
        index = 0;
      }
    }
  
    showQuote();
  
    setInterval(showQuote, 4000);
  }
  
  loadQuotes();
  
  /* =========================
     TASK STORAGE
  ========================= */
  
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
  
  /* =========================
     ADD TASK
  ========================= */
  
  function addTask(){
  
    const taskName = document.getElementById("taskName").value;
    const taskSubject = document.getElementById("taskSubject").value;
    const taskDeadline = document.getElementById("taskDeadline").value;
    const taskPriority = document.getElementById("taskPriority").value;
  
    if(
      !taskName ||
      !taskSubject ||
      !taskDeadline
    ){
      alert("Please fill all task fields.");
      return;
    }
  
    const task = {
      id: Date.now(),
      name: taskName,
      subject: taskSubject,
      deadline: taskDeadline,
      priority: taskPriority,
      status: "pending",
      weak: false
    };
  
    tasks.push(task);
  
    localStorage.setItem("tasks", JSON.stringify(tasks));
  
    renderTaskList();
  
    document.getElementById("taskName").value = "";
    document.getElementById("taskSubject").value = "";
    document.getElementById("taskDeadline").value = "";
  }
  
  function renderTaskList(){
  
    const taskList = document.getElementById("taskList");
  
    if(!taskList) return;
  
    if(tasks.length === 0){
      taskList.innerHTML = "<p>No tasks added yet.</p>";
      return;
    }
  
    taskList.innerHTML = "";
  
    tasks.forEach(task => {
  
      taskList.innerHTML += `
        <div class="task-item">
          <strong>${task.name}</strong><br>
          ${task.subject}<br>
          Deadline: ${task.deadline}<br>
          Priority: ${task.priority}
        </div>
      `;
    });
  }
  
  renderTaskList();
  
  /* =========================
     GENERATE SCHEDULE
  ========================= */
  
  function generateSchedule(){
  
    const studyGoal = document.getElementById("studyGoal")?.value;
    const subjects = document.getElementById("subjects")?.value;
    const hoursPerDay = document.getElementById("hoursPerDay")?.value;
  
    if(
      !studyGoal ||
      !subjects ||
      !hoursPerDay
    ){
      alert("Please fill all study information.");
      return;
    }
  
    localStorage.setItem("studyGoal", studyGoal);
    localStorage.setItem("subjects", subjects);
    localStorage.setItem("hoursPerDay", hoursPerDay);
  
    tasks.sort((a,b)=>{
  
      const priorityValue = {
        high:3,
        medium:2,
        low:1
      };
  
      return priorityValue[b.priority] - priorityValue[a.priority];
    });
  
    const schedule = [];
  
    let day = 1;
  
    tasks.forEach(task => {
  
      schedule.push({
        day: `Day ${day}`,
        task: task.name,
        subject: task.subject,
        duration: task.weak ? "2.5 Hours" : "2 Hours"
      });
  
      if(task.weak){
        schedule.push({
          day: `Day ${day}`,
          task: `Extra Review: ${task.subject}`,
          subject: task.subject,
          duration: "30 Minutes"
        });
      }
  
      day++;
    });
  
    localStorage.setItem("schedule", JSON.stringify(schedule));
  
    window.location.href = "dashboard.html";
  }
  
  /* =========================
     DASHBOARD
  ========================= */
  
  function renderDashboard(){
  
    const scheduleContainer = document.getElementById("scheduleContainer");
  
    if(!scheduleContainer) return;
  
    const schedule =
      JSON.parse(localStorage.getItem("schedule")) || [];
  
    if(schedule.length === 0){
      scheduleContainer.innerHTML =
        "<p>No schedule generated yet.</p>";
    }
  
    scheduleContainer.innerHTML = "";
  
    schedule.forEach(item => {
  
      scheduleContainer.innerHTML += `
        <div class="schedule-item">
          <h3>${item.day}</h3>
          <p><strong>${item.task}</strong></p>
          <p>${item.subject}</p>
          <p>${item.duration}</p>
        </div>
      `;
    });
  
    renderProgress();
    renderTaskActions();
  }
  
  renderDashboard();
  
  /* =========================
     PROGRESS
  ========================= */
  
  function renderProgress(){
  
    const progressFill =
      document.getElementById("progressFill");
  
    if(!progressFill) return;
  
    const progressText =
      document.getElementById("progressText");
  
    const readinessScore =
      document.getElementById("readinessScore");
  
    const total = tasks.length;
  
    const completed =
      tasks.filter(t => t.status === "done").length;
  
    const missed =
      tasks.filter(t => t.status === "missed").length;
  
    const weak =
      tasks.filter(t => t.weak).length;
  
    const progress =
      total === 0 ? 0 :
      (completed / total) * 100;
  
    progressFill.style.width = progress + "%";
  
    progressText.innerText =
      `${completed} Completed / ${total} Total`;
  
    let score =
      (completed * 25) -
      (missed * 10) -
      (weak * 5);
  
    if(score < 0){
      score = 0;
    }
  
    if(score > 100){
      score = 100;
    }
  
    readinessScore.innerText = score + "%";
  }
  
  /* =========================
     TASK ACTIONS
  ========================= */
  
  function renderTaskActions(){
  
    const taskActions =
      document.getElementById("taskActions");
  
    if(!taskActions) return;
  
    taskActions.innerHTML = "";
  
    tasks.forEach(task => {
  
      taskActions.innerHTML += `
        <div class="task-item">
          <h3>${task.name}</h3>
  
          <p>${task.subject}</p>
  
          <p>Status: ${task.status}</p>
  
          <button class="done-btn"
          onclick="markDone(${task.id})">
          Done
          </button>
  
          <button class="missed-btn"
          onclick="markMissed(${task.id})">
          Missed
          </button>
  
          <br>
  
          <button class="weak-btn"
          onclick="markWeak(${task.id})">
          Weak Topic
          </button>
        </div>
      `;
    });
  }
  
  function markDone(id){
  
    tasks = tasks.map(task => {
  
      if(task.id === id){
        task.status = "done";
      }
  
      return task;
    });
  
    saveAndRefresh();
  }
  
  function markMissed(id){
  
    tasks = tasks.map(task => {
  
      if(task.id === id){
        task.status = "missed";
      }
  
      return task;
    });
  
    adjustSchedule();
  
    saveAndRefresh();
  }
  
  function markWeak(id){
  
    tasks = tasks.map(task => {
  
      if(task.id === id){
        task.weak = true;
      }
  
      return task;
    });
  
    adjustSchedule();
  
    saveAndRefresh();
  }
  
  function adjustSchedule(){
  
    let schedule =
      JSON.parse(localStorage.getItem("schedule")) || [];
  
    tasks.forEach(task => {
  
      if(task.status === "missed"){
  
        schedule.push({
          day: "Rescheduled",
          task: task.name,
          subject: task.subject,
          duration: "2 Hours"
        });
      }
  
      if(task.weak){
  
        schedule.push({
          day: "Upcoming Review",
          task: `Review ${task.subject}`,
          subject: task.subject,
          duration: "30 Minutes"
        });
      }
    });
  
    localStorage.setItem(
      "schedule",
      JSON.stringify(schedule)
    );
  }
  
  /* =========================
     SAVE
  ========================= */
  
  function saveAndRefresh(){
  
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );
  
    renderDashboard();
  }
  
  /* =========================
     AI TUTOR
  ========================= */
  
  const knowledgeBase = {
  
    arrays: {
      explanation:
        "Arrays are data structures used to store multiple values in a single variable using indexes.",
  
      technique:
        "Use active recall by solving array problems daily."
    },
  
    calculus: {
      explanation:
        "Calculus studies change and motion using derivatives and integrals.",
  
      technique:
        "Use spaced repetition and formula revision sheets."
    },
  
    physics: {
      explanation:
        "Physics explains matter, energy, force, and motion through scientific laws.",
  
      technique:
        "Practice numerical problem solving using Pomodoro sessions."
    },
  
    programming: {
      explanation:
        "Programming is the process of writing instructions for computers using logic and code.",
  
      technique:
        "Learn by building mini projects consistently."
    },
    
  };
  
  function askAITutor(){
  
    const question =
      document.getElementById("aiQuestion")
      .value
      .toLowerCase();
  
    const aiResponse =
      document.getElementById("aiResponse");
  
    if(!question){
      aiResponse.innerHTML =
        "Please enter a topic.";
      return;
    }
  
    let found = false;
  
    for(let key in knowledgeBase){
  
      if(question.includes(key)){
  
        aiResponse.innerHTML = `
          <h3>${key.toUpperCase()}</h3>
  
          <p>
            ${knowledgeBase[key].explanation}
          </p>
  
          <br>
  
          <strong>Suggested Study Technique:</strong>
  
          <p>
            ${knowledgeBase[key].technique}
          </p>
        `;
  
        found = true;
        break;
      }
    }
  
    if(!found){
  
      aiResponse.innerHTML = `
        <p>
          AI Tutor Analysis:
        </p>
  
        <br>
  
        <p>
          "${question}" is an important concept.
          Break it into smaller parts, revise actively,
          and use the Feynman Technique by teaching it
          in simple words.
        </p>
  
        <br>
  
        <strong>Recommended Strategy:</strong>
  
        <p>
          Use Pomodoro sessions, flashcards,
          and spaced repetition for long-term memory.
        </p>
      `;
    }
  }
  function resetApp() {

    localStorage.removeItem("tasks");
    localStorage.removeItem("schedule");
    localStorage.removeItem("progress");
  
    // Reset task container
    const task = document.getElementById("taskContainer");
    if (task) task.innerHTML = "";
  
    // Reset schedule container
    const schedule = document.getElementById("scheduleContainer");
    if (schedule) schedule.innerHTML = "";
  
    // Reset progress bar
    const progress = document.getElementById("progressFill");
    if (progress) progress.style.width = "0%";
  
    const progressText = document.getElementById("progressText");
    if (progressText) progressText.innerText = "0%";
  }