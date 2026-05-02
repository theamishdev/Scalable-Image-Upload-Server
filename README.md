# 📦 Scalable Image Upload Server (No Database)

## 🚀 Overview

This project implements a **scalable backend system** for image uploads using:

* **NGINX** as a load balancer
* **Multiple backend servers (Node.js)**
* **AWS S3** for image storage
* **GitHub Actions** for CI pipeline
* **No database** (stateless architecture)

---

## 🧠 Architecture

```
Client
   ↓
NGINX (Load Balancer)
   ↓
 ┌───────────────┬───────────────┐
 │ Server 3001   │ Server 3002   │
 └───────────────┴───────────────┘
        ↓
     AWS S3
```

---

## ⚙️ Tech Stack

* Node.js (Express)
* Multer (file upload handling)
* AWS SDK (S3 integration)
* NGINX (reverse proxy & load balancing)
* GitHub Actions (CI)

---

## 📁 Project Structure

```
scalable-image-upload/
│
├── server.js
├── package.json
├── .env.example
├── nginx.conf
├── docker-compose.yml (optional)
├── Dockerfile (optional)
├── .github/workflows/ci.yml
├── README.md
└── test.jpg
```

---

## 🔧 Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/Scalable-Image-Upload-Server.git
cd Scalable-Image-Upload-Server
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Configure Environment Variables

Create `.env` file:

```env
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
PORT=3001
```

---

### 4️⃣ Start Backend Servers

Open two terminals:

#### Terminal 1

```powershell
$env:PORT=3001
node server.js
```

#### Terminal 2

```powershell
$env:PORT=3002
node server.js
```

---

## 🌐 NGINX Configuration

### nginx.conf

```nginx
worker_processes 1;

events {
    worker_connections 1024;
}

http {
    upstream backend_servers {
        server localhost:3001;
        server localhost:3002;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://backend_servers;
        }
    }
}
```

---

### ▶️ Run NGINX

```powershell
.\nginx
```

Reload after changes:

```powershell
.\nginx -s reload
```

---

## 🧪 API Usage

### Endpoint

```
POST /upload
```

### Request

* Content-Type: `multipart/form-data`
* Field: `image`

---

### Example (curl)

```bash
curl.exe -X POST http://localhost/upload -F "image=@test.jpg"
```

---

### Response

```json
{
  "url": "https://your-bucket.s3.amazonaws.com/image.jpg"
}
```

---

## ☁️ AWS S3 Setup

1. Create S3 bucket
2. Disable block public access
3. Add bucket policy (public read)
4. Create IAM user with S3 access
5. Use credentials in `.env`

---

## ⚖️ Load Balancing

* Implemented using NGINX
* Uses **round-robin algorithm (default)**
* Requests are distributed across:

  * `localhost:3001`
  * `localhost:3002`

---

## 🔁 CI Pipeline (GitHub Actions)

File: `.github/workflows/ci.yml`

### Pipeline Features:

* Runs on push & pull request
* Installs dependencies
* Runs Node.js server
* Fails if build fails

---

## 🚫 Constraints

* No database
* No authentication
* Focus on scalability and infrastructure

---

## ⭐ Bonus Features (Optional)

* Docker support
* EC2 deployment
* Image resizing
* Signed URLs

---

## 🧠 Key Concepts Demonstrated

* Stateless backend architecture
* Horizontal scaling
* Reverse proxy & load balancing
* Cloud object storage (S3)
* CI/CD basics

---

## 🧪 Testing

* Use Postman or curl
* Upload multiple images
* Verify:

  * Images stored in S3
  * Requests distributed across servers

---

## 📌 Sample Output

```
Request handled by port 3001
Request handled by port 3002
```

---

## 🧠 Viva / Interview Explanation

> This system uses NGINX as a reverse proxy with round-robin load balancing across stateless backend instances. AWS S3 is used as centralized object storage, enabling scalability without maintaining a database.

---

## 👨‍💻 Author

Amish Verma

---

