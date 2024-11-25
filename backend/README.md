# Portfolio Maker Backend

This is the backend API for the Portfolio Maker application, built with Django and Django REST Framework.

## Features

- RESTful API endpoints for portfolio management
- User authentication and authorization
- Profile management
- Skills management
- Projects management
- Experience management
- Education management
- File upload support for profile pictures and project images
- Admin interface for data management

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

5. Create a .env file:
   ```bash
   cp .env.example .env
   ```
   Then edit .env with your settings

6. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

8. Run the development server:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

- `/api/profiles/` - User profiles
- `/api/skills/` - Skills
- `/api/projects/` - Projects
- `/api/experiences/` - Work experiences
- `/api/education/` - Education history

## Authentication

The API uses token-based authentication. To obtain a token:

1. Create a user account
2. Use the login endpoint to get your token
3. Include the token in the Authorization header of your requests

## Admin Interface

Access the admin interface at `/admin/` to manage:

- User profiles
- Skills
- Projects
- Experiences
- Education records

## Development

1. Make sure all tests pass:
   ```bash
   python manage.py test
   ```

2. Run migrations after model changes:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
