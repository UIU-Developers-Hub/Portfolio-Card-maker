# Portfolio Maker Backend

This is the backend API for the Portfolio Maker application, built with Django and Django REST Framework.

## Features

- RESTful API endpoints for portfolio management
- User authentication using JWT
- Profile management
- Skills management
- Projects management
- Experience management
- Education management
- File upload support for profile pictures and project images

## Prerequisites

- Python 3.8+
- pip (Python package manager)

## Installation

1. Clone the repository

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Run the development server:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- POST `/api/accounts/register/` - Register new user
- POST `/api/accounts/login/` - Login and get JWT token
- POST `/api/accounts/token/refresh/` - Refresh JWT token
- POST `/api/accounts/logout/` - Logout (blacklist token)

### Profile
- GET/PUT `/api/accounts/profile/` - Get or update user profile

### Portfolio
- GET/POST `/api/portfolio/` - List or create portfolios
- GET/PUT/DELETE `/api/portfolio/{id}/` - Retrieve, update or delete portfolio

## Authentication

The API uses JWT (JSON Web Token) authentication:

1. Register a new account using `/api/accounts/register/`
2. Login using `/api/accounts/login/` to get access and refresh tokens
3. Include the access token in the Authorization header:
   ```
   Authorization: Bearer <your_access_token>
   ```
4. Use `/api/accounts/token/refresh/` to get a new access token when it expires
