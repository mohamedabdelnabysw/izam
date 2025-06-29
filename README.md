# E-izam

A modern e-commerce platform built with Laravel and React/TypeScript.

## Description

E-izam is a full-featured e-commerce application that provides a complete shopping experience with product management, order processing, user authentication, and a modern responsive interface.

## Features

- **User Authentication**: Secure login/registration with email verification
- **Product Management**: Browse, search, and filter products by category
- **Shopping Cart**: Add products to cart and manage quantities
- **Order Processing**: Complete checkout process with order tracking
- **Admin Dashboard**: Manage products, categories, and orders
- **Responsive Design**: Modern UI that works on all devices
- **API Integration**: RESTful API for mobile and third-party integrations

## Tech Stack

### Backend
- **Laravel 11**: PHP framework for robust backend development
- **MySQL**: Database for data persistence
- **Laravel Sanctum**: API authentication
- **Eloquent ORM**: Database abstraction layer

### Frontend
- **React 18**: Modern UI library
- **TypeScript**: Type-safe JavaScript
- **Inertia.js**: Seamless SPA experience
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Beautiful component library

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-izam
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Start development servers**
   ```bash
   # Terminal 1: Start Laravel development server
   php artisan serve
   
   # Terminal 2: Start Vite development server
   npm run dev
   ```

## API Documentation

The API documentation is available in `API_DOCUMENTATION.md` file.

## Project Structure

```
E-izam/
├── app/                    # Laravel application logic
│   ├── Http/Controllers/   # API and web controllers
│   ├── Models/            # Eloquent models
│   ├── Events/            # Event classes
│   └── Listeners/         # Event listeners
├── resources/js/          # React/TypeScript frontend
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   └── services/         # API services
├── database/             # Migrations, seeders, factories
└── routes/               # Route definitions
```

## Development

### Running Tests
```bash
php artisan test
```

### Code Quality
```bash
# PHP CS Fixer
./vendor/bin/php-cs-fixer fix

# ESLint
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Nasr** - *Lead Developer*
- GitHub: [@nasr](https://github.com/nasr)
- Email: nasr@example.com

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.
