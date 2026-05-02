# How to Run the Scalable Image Upload Project

Follow these exact steps to fully spin up the local environment with NGINX load-balancing!

## 1. Verify Configuration
Ensure your `.env` file is properly populated with your AWS S3 credentials and region settings.
*(See `.env.example` if you need a template).*

## 2. Start NGINX Load Balancer
Open a PowerShell terminal and navigate to your NGINX directory to spin up the router:
```powershell
cd "C:\Users\Amish Verma\Downloads\nginx-1.30.0\nginx-1.30.0"
.\nginx
```
*(If it's already running, you can apply updates via `.\nginx -s reload`)*

## 3. Spin Up Backend Clusters
We need to start two separate Node.js server instances on different ports so NGINX can intelligently bounce traffic between them.

Open a **new PowerShell window (Terminal 1)** and run:
```powershell
cd "C:\Users\Amish Verma\Desktop\scalable-image-upload"
$env:PORT=3001
node server.js
```

Open a **second PowerShell window (Terminal 2)** and run:
```powershell
cd "C:\Users\Amish Verma\Desktop\scalable-image-upload"
$env:PORT=3002
node server.js
```

## 4. Test the Application
Everything is now globally connected! 

**Option A (Visual Interface):**
Simply open up your browser and navigate to `http://localhost`. This will load your premium glassmorphism frontend and allow you to intuitively test dragging & dropping images.

**Option B (CURL Command):**
To test the RAW API via command-line, submit an image directly to the NGINX router:
```powershell
curl.exe -X POST http://localhost/upload -F "image=@test.jpg"
```

*Look at your 3001 and 3002 terminal windows while testing. You will see `🔥 Request handled by port [PORT]` naturally alternate between them!*
