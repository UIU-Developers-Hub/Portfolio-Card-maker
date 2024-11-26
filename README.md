# Portfolio Maker Website

A full-stack web application for creating and managing professional portfolios. Built with Next.js and Django.

## Features

- User authentication and authorization
- Profile management
- Portfolio customization
- Project showcase
- Skills and experience sections
- Education history
- Social media integration

## Tech Stack

### Frontend
- Next.js 13+
- TypeScript
- React Context for state management
- Tailwind CSS for styling

### Backend
- Django 5.0
- Django REST Framework
- Simple JWT for authentication
- SQLite database (can be configured for PostgreSQL)

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:9090
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
