# University Management System

A comprehensive web-based university management system built with React, Node.js, and MongoDB. The system provides different interfaces for administrators, teachers, and students to manage various aspects of university operations.

## Features

### Admin Dashboard
- User Management (Add/Edit/Delete users)
- Course Management
- Event Management
- Report Generation
- Natural Language Query Interface for Database Operations

### Teacher Interface
- Dashboard with Schedule
- Attendance Management
- Marks Management
- Leave Management

### Student Interface
- Course Enrollment
- View Grades
- Check Attendance
- Access Course Materials
- View Events

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI for components
- TailwindCSS for styling
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/ddv2311/university-management.git
cd university-management
```

2. Install dependencies
```bash
npm install
```

3. Create a .env file in the root directory and add your environment variables
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
project/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── context/       # Context providers
│   ├── services/      # API services
│   └── types/         # TypeScript types
├── server/
│   ├── routes/        # API routes
│   ├── models/        # Database models
│   ├── controllers/   # Route controllers
│   └── middleware/    # Custom middleware
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the component library
- TailwindCSS for the utility-first CSS framework
- MongoDB for the database
- All contributors who have helped with the project