# 🚨 SOS Elevator System

A **SOS Elevator Emergency System** built using **React.js, Node.js, Express.js, and MySQL**.
This system helps **trapped passengers or agents inside an elevator** to quickly contact support via **video call and chat**, and allows **agents to assign technicians** to resolve the issue.

---

## 🔧 Tech Stack

### Frontend

* React.js
* Redux Toolkit
* Axios
* agora (for Video Call)
* Bootstrap / CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* Socket.IO (Real-time Chat & Call signaling)

### Database

* MySQL

---

## 🎯 Features

### Passenger / Agent (Inside Elevator)

* 🔴 Emergency SOS Button
* 📹 Start Video Call with Agent
* 💬 Real-time Chat Message
* 📍 Elevator ID based request

### Agent (Support Team)

* 📞 Receive SOS Call
* 💬 Chat with trapped person
* 🧑‍🔧 Assign Technician
* 📊 View Elevator & Case Details

### Technician

* 🛠 Receive Assignment
* 📍 View Elevator Location
* ✅ Update Job Status

---

## 📁 Project Structure

```
SOS-Elevator/
│
├── frontend/              # React Application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/               # Node.js + Express API
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── database/              # MySQL schema
│   └── sos_elevator.sql
│
└── README.md
```

---

## ⚙️ Prerequisites

* Node.js (v18+ recommended)
* MySQL (v8+)
* npm or yarn

---

## 🛠 Backend Setup (Node.js + Express)

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create `.env` File

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sos_elevator
JWT_SECRET=your_secret_key
```

### 4️⃣ Run Server

```bash
npm run dev
# or
npm start
```

Backend will run on:

```
http://localhost:5000
```


## 🖥 Frontend Setup (React.js)

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start React App

```bash
npm start
```

Frontend will run on:

```
http://localhost:3000
```

---

## 📡 Real-Time Communication

* **Socket.IO** → Chat & call signaling
* **Agora Web SDK** → Video Call (UAE / Middle East region)

---

## 🎥 Agora Video Call Integration (UAE Region)

This project uses **Agora Web SDK** for real-time video calling between trapped passengers/agents and support agents.

### 🌍 Region

* **Region:** Middle East (UAE)
* Agora automatically routes to the nearest data center for low latency.

---

### 1️⃣ Create Agora Account

* Create an account on Agora Console
* Create a new **Project**
* Copy:

  * **App ID**
  * **App Certificate** (required for token generation)

---

### 2️⃣ Backend Setup (Agora Token Server)

Install Agora SDK on backend:

```bash
npm install agora-access-token
```

Create token utility:

```js
// utils/agoraToken.js
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

exports.generateRtcToken = (channelName, uid = 0) => {
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const role = RtcRole.PUBLISHER;
  const expireTime = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTimestamp + expireTime;

  return RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );
};
```

API Endpoint:

```js
// routes/agora.js
router.get('/token', (req, res) => {
  const { channelName, uid } = req.query;
  const token = generateRtcToken(channelName, uid);
  res.json({ token });
});
```

---

### 3️⃣ Backend `.env`

```env
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_certificate
```

---

### 4️⃣ Frontend Setup (React + Agora)

Install Agora SDK:

```bash
npm install agora-rtc-sdk-ng
```

Basic Video Call Example:

```js
import AgoraRTC from 'agora-rtc-sdk-ng';

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8'
});

await client.join(APP_ID, channelName, token, uid);

const localTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
await client.publish(localTrack);

localTrack[1].play('local-video');
```

---

### 5️⃣ SOS Video Call Flow

1. Passenger presses **SOS Button**
2. Channel created → `elevator_{ID}`
3. Backend generates Agora token
4. Agent joins same channel
5. Secure video call starts

---

## 🔐 Authentication Flow

1. User Login (JWT Token)
2. Token stored in frontend
3. Protected API routes
4. Role-based access (Agent / Technician)

---




