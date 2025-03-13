# Baseball StatGen Application

A web-based application for generating customizable tables of baseball statistics, similar to Baseball Savant's statistics page.

## Features

- Dynamic statistic type selection (batting, pitching)
- Advanced filtering options (date ranges, teams, specific metrics)
- Head-to-head player comparisons
- Exportable data tables
- Real-time data updates from Statcast API

## Tech Stack

- Backend: Python/Flask
- Frontend: React
- Database: PostgreSQL
- Caching: Redis
- Testing: pytest

## Project Structure

```
baseballstatsquizgame/
├── backend/                 # Flask application
│   ├── app/                # Application package
│   ├── tests/              # Test suite
│   └── config.py           # Configuration settings
├── frontend/               # React application
│   ├── src/               # Source code
│   ├── public/            # Static files
│   └── package.json       # Dependencies
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Initialize the database:
   ```bash
   flask db upgrade
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Development

- Backend runs on http://localhost:5000
- Frontend runs on http://localhost:3000
- API documentation available at http://localhost:5000/api/docs

## Testing

Run the test suite:
```bash
pytest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 