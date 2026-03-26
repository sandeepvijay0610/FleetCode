# ⚡ FleetCode: Tactical Algorithmic Command

FleetCode is a competitive, squad-based platform designed to gamify the LeetCode grind. Unlike static trackers, FleetCode uses live GraphQL telemetry to monitor squad progress, visualize technical "Muscle Maps," and deploy an Adaptive Recommender engine to target and eliminate algorithmic weaknesses.

---

## 🛠️ Tech Stack

### Frontend (The Command Center)
* **React.js (Vite)** – High-performance reactive UI.
* **Tailwind CSS** – Cyberpunk-inspired utility styling.
* **Lucide React** – Precision vector iconography.
* **Recharts** – Dynamic Radar Chart (Muscle Map) visualization.
* **Axios** – Asynchronous telemetry fetching.

### Backend (The Engine)
* **Node.js & Express** – RESTful API & logic orchestration.
* **MongoDB & Mongoose** – Document-based persistence for squads and activity.
* **Node-Cron** – Automated background "Radar Sweep" poller.
* **GraphQL Client** – Direct integration with LeetCode’s internal API.

---

## 🔄 System Architecture & Workflow

### 1. The Onboarding (Neutral Link)
Users register using their **LeetCode Username**. The system performs a real-time handshake with the LeetCode API to verify account validity before granting squad access.

### 2. The Radar Sweep (Poller)
A background microservice initiates a "Radar Sweep" every 30 seconds.
* **Verification:** It only grants XP for problems solved *after* the user joined FleetCode.
* **Idempotency:** Cross-references `problemSlug` with the MongoDB Activity ledger to prevent "double-dipping" XP for the same problem.

### 3. Weighted Scoring Function
XP isn't just a count; it’s a reflection of difficulty:
* **Easy:** +10 XP | **Medium:** +20 XP | **Hard:** +50 XP
* **Global Ranking:** Calculated in $O(1)$ time using a MongoDB count query: `count(squads.score > my.score) + 1`.

### 4. Adaptive Recommender (The Wow Factor)
The engine calculates a **Mastery Index** ($Easy \times 1 + Medium \times 2 + Hard \times 3$) across 6 core algorithmic topics. 
* **Gap Analysis:** Identifies the topic with the lowest weighted score.
* **Progression Curve:** Dynamically adjusts mission difficulty (Easy if solves < 3, Medium if < 5, Hard for masters) to ensure optimal learning flow.

---

## 🚀 Installation & Setup

### Prerequisites
* **Node.js** (v18+)
* **MongoDB Atlas** Account

### 1. Clone the Repository
```bash
git clone [https://github.com/sandeepvijay0610/fleetcode.git](https://github.com/sandeepvijay0610/fleetcode.git)
cd fleetcode
