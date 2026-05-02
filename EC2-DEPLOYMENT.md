# EC2 Deployment Guide

Deploying the **Scalable Image Upload** architecture directly onto a brand new AWS EC2 Instance involves setting up Docker, cloning your project, and spinning up the Docker-Compose orchestration.

## 1. Launching EC2
1. Log into your AWS Console and go to **EC2**.
2. Click **Launch Instances**.
3. Choose **Ubuntu Server 22.04 LTS**.
4. Instance Type: `t2.micro` (Eligibility for free tier is fine).
5. In **Network Settings**, ensure **Allow HTTP traffic from the internet** and **Allow SSH traffic** are checked!
6. Launch instance and download your `.pem` key.

## 2. Connect via SSH
Open your local terminal:
```bash
chmod 400 your-key.pem
ssh -i "your-key.pem" ubuntu@<your-ec2-public-ip>
```

## 3. Install Docker & Git
Once connected to the EC2 shell, run the following exactly:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose git -y
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
```
*(Logout or reboot by typing `exit` and reconnecting so docker permissions apply)*

## 4. Setup Architecture
Clone your GitHub repository into the EC2 instance:
```bash
git clone https://github.com/yourusername/scalable-image-upload.git
cd scalable-image-upload
```

Create your production environment file securely on the cloud:
```bash
nano .env
```
*(Paste your real `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `AWS_REGION`, and `S3_BUCKET` here. Press `Ctrl+O` to save, `Ctrl+X` to exit)*

## 5. Launch The Cluster!
Since we've provided a `docker-compose.yml` file, spinning up the 3001 Instance, 3002 Instance, AND the internal NGINX load balancer happens in exactly one command:

```bash
docker-compose up -d --build
```

**Congratulations!** 
Your EC2 Public IP address will now serve traffic on Port 80 directly to your premium Frontend UI, securely proxying optimized images directly to your S3 Bucket!
