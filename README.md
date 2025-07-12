# Task-IT
Task Allocation meets Collaboration

Task-IT is a **task management and employee efficiency tracking platform** built with the MERN stack. It helps supervisors assign tasks to employees, track progress, and view efficiency reports seamlessly.

---

## 🌟 **Features**

✅ **Landing page** with marks the start 

✅ **Login page** with role based toggle login i.e., Employee or Supervisor 

✅ User authentication for **employees** and **supervisors** 

✅ **Supervisor Dashboard**:
- Add new tasks with team lead and teammates
- View all tasks with filtering and sorting based on Real-time status and deadline sorting
- View employee progress reports with efficiency meters

✅ **Employee Dashboard**:
- View assigned tasks (based on email inclusion)
- Update task statuses
- Add events/meetings/important dates to Calender with time. Supports Alarm.
- Socket.IO for real time communication beween teammates
  
LANDING PAGE
---<img width="1887" height="902" alt="Screenshot 2025-07-13 025837" src="https://github.com/user-attachments/assets/d2b097dd-d7d0-40f7-86c6-c39fe4613de1" />
LOGIN PAGE
<img width="1919" height="899" alt="Screenshot 2025-07-13 025121" src="https://github.com/user-attachments/assets/e31c018d-d179-4583-87d4-411dd2b510fb" />
SUPERVISOR'S DASHBOARD
<img width="1919" height="897" alt="Screenshot 2025-07-13 020502" src="https://github.com/user-attachments/assets/e4ee44ba-2213-4e1b-b1e2-61845a71b7de" />
<img width="1919" height="905" alt="Screenshot 2025-07-13 020544" src="https://github.com/user-attachments/assets/2644efaf-7bb9-41be-8de3-75eb4e70359e" />
<img width="1919" height="837" alt="Screenshot 2025-07-13 020821" src="https://github.com/user-attachments/assets/21227b9f-7835-460d-84f4-97b7c6b008fd" />

EMPLOYEE'S DASHBOARD
<img width="1919" height="909" alt="Screenshot 2025-07-13 023439" src="https://github.com/user-attachments/assets/1488b168-d483-4e16-9ab3-15faceb86c66" />
<img width="1919" height="900" alt="Screenshot 2025-07-13 023509" src="https://github.com/user-attachments/assets/a2020956-61d4-4a9e-9660-d9caa0989218" />
<img width="1919" height="900" alt="Screenshot 2025-07-13 023720" src="https://github.com/user-attachments/assets/8d17b68e-a57c-4a87-9671-19e59a318414" />


## 💻 **Tech Stack**

- **Frontend:** React.js, CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT-based login system
- **Utils:** Socket.IO
- **Styling:** Google Sans Text, custom CSS

---

1. **Clone the repository**

```bash
git clone https://github.com/beingnehallish/Task-IT.git
cd Task-IT
```
2. ## ⚙️ **Setup Instructions**
```bash
cd backend
npm install
# Configure MongoDB URI and JWT secret in .env
npm install express mongoose dotenv cors jsonwebtoken bcryptjs
npm install --save-dev nodemon
npm run dev

cd ../frontend
npm install
npm install react react-dom react-router-dom axios
npm install --save-dev vite
npm run dev
```
License
This project is licensed under the MIT License.

