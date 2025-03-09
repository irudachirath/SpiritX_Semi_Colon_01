# SpiritX_Semi_Colon_01
Implementation of SecureConnect, a secure and user-friendly authentication system!
.

## 🚀 Guidelines for Stage 1
Outline the requirements or objectives for the first stage of development.

## 🛠️ Prerequisites
Make sure you have the following installed before running the project:
- **npm** or any other package manager
- **Docker** (Ensure Docker Engine is running)   
 
## 📥 Clone the Repository
```sh
git clone https://github.com/irudachirath/SpiritX_Semi_Colon_01.git
cd SpiritX_Semi_Colon_01
```

## ⚙️ Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Build the backend server
   ```sh
   npm run build
   ```


## 🎨 Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Build the frontend server:
   ```sh
   npm run build
   ```

## 🐳 Ensure Docker Engine is Running
Before running the project, make sure **Docker Engine** is running in the background.

- **🐳 Dockerization**: The project can be run using Docker for easier deployment.
  - Build and run using:
    ```sh
    docker-compose up --build
    ```


## 🤔 Assumptions Made During Development
- The backend API assumes authentication using JWT.
- The frontend fetches data from `http://localhost:5000/api` by default.
- Users must have **Docker installed and running** for an easy setup.


## 📜 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

