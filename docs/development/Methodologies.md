# 🛠️ Methodologies

## 🤼 Agile Scrum

We follow the Agile Scrum methodology to ensure adaptive planning, early delivery, and continuous improvement. Scrum also helps us **stay flexible with requirements** and **deliver value to stakeholders incrementally**.  

### Core Practices
- 🧍 **Standups:**  
  Held on **Tuesdays, Thursdays, and Sundays** to sync up on progress and blockers. These days were chosen based on our academic timetable, ensuring regular check-ins without clashing with classes.  
  - Each standup is short (10–15 minutes).  
  - Members report on:  
    1. What they worked on since the last meeting.  
    2. What they plan to work on next.  
    3. Any blockers they are facing.  

- 📝 **Sprint Retrospectives and Planning:**  
  Conducted after every sprint to reflect on what went well, what could be improved, and which practices to continue. Retros usually happen **immediately after receiving tutor feedback**, so we can incorporate external insights into the next sprint. We also record agreed-upon **action items** and assign owners. Before each sprint, we review the backlog, refine tasks, and select items to commit to. This ensures the sprint goal is realistic and aligned with deadlines (like rubric submissions).  

- 🔁 **Role Rotation:**  
  Team roles (e.g., Scrum Master, DevOps, Product Owner) **rotate every sprint**.  
  This helps distribute responsibilities, prevent silos, and encourages members to **learn new skills**. Role rotation also gives everyone exposure to leadership and technical roles, preparing us for industry teamwork.  

- 🗃️ **Backlog Management:**  
  We use **Trello** as our product backlog and sprint board.  
  Cards are labeled, prioritized, and assigned. This keeps tasks visible, avoids duplication, and ensures accountability.  

---

## 🚣‍♀️ GitHub Flow

Our source control process follows the **GitHub Flow** to maintain code quality and smooth deployment. This workflow aligns well with Agile, since it supports frequent updates, small iterations, and peer collaboration.  

### 📑 Core Practices
- The **main** (or **master**) branch is always deployable and reflects production-ready code.  
- Development happens on **short-lived feature branches** created off `main`. Each branch corresponds to a Trello card or backlog item.  
- When a feature is complete, a **Pull Request (PR)** is opened.  
- The PR undergoes **peer review** by Github copilot and at least one other member to maintain code quality and share knowledge.  
- The feature branch is **merged into main** only after approval and successful automated tests.  
- The `main` branch triggers **continuous integration (CI)** checks and **deployment to production/staging environments**.  

### 📈 Benefits
- Encourages **collaboration** through reviews.  
- Ensures a **clean commit history**.  
- Keeps production stable while allowing **rapid iteration**.  
- Provides an opportunity to integrate **automated testing** and **code quality checks** into the workflow.  

---
