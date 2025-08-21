# 📝 Codexa: Scrum 01 Meeting Minutes

**Date:** August 20, 2025  
**Time:** 22:08 – 23:35  
**Location:** Online (Discord)  

---

## 👥 Attendees
- Given  
- Kutlwano  
- Molemo  
- Ntando  
- Ntobeko  

**Absentees:**  
- Alfred  

---

## 📌 Agenda Items

### Sprint 2 Goals
- Guest management: discussed (see `EventsPage` branch on GitHub for details)  
- Vendor management: discussed (see `EventsPage` branch on GitHub)  
- Event schedules: how to allow users to schedule events  
- Deployment issues: backend deployed, frontend deployment ongoing  
- API integration: Event Management is main target; API must be consumable by other groups  
- Stakeholder reviews: friends, family, and Claire identified as reviewers  
- Documentation: find ways to create a sprint timeline documentation. Edit the repo READme file. Documentation database schema and data model, api usage and justification. Gather stakeholder feedback via google forms, interviews or site practicality  
- Exporting event data: discussed  
- Impact of losing Alfred (one team member): discussed implications  

### Implementation Specifics
- RSVP links via SMS or email  
- Add `price` to vendor schema for comparison  
- Vendors shared across users  
- Vendor search functionality required  
- Event scheduling: choose template, then edit  
- File uploads: store generated URL + metadata in DB, actual files in **Azure storage**  
- “Add Event” via calendar click — pre-fill event details (e.g., start-date)  
- Events with “Other” category → category cannot be edited (for sorting purposes)  
- Share event details via links (email, WhatsApp, etc.)  

---

## 🚀 Next Steps
- Document database schema + MongoDB models (include snippets where needed)  
- Add code coverage badge  
- Improve backend + database documentation  
- Use GitHub Issues for bug tracking  
- Update team roles (due to workload + fewer members)  
- Deploy frontend application  
- Increase focus on **testing**  

---

## ✅ Action Items
- **Given** → Documentation; assist frontend or backend when needed  
- **Ntando** → Frontend development + testing  
- **Kutlwano** → Testing, DevOps, backend development  
- **Molemo** → Full-stack development  
- **Ntobeko** → Frontend development  

---

## 📅 Next Meeting
**Date:** August 24, 2025  
**Time:** TBD  
**Location:** Online (Discord)  
