src/
│
├── controllers/                    # All API endpoints (organized per stakeholder or module)
│   ├── auth.controller.ts
│   ├── users.controller.ts
│   ├── attendance.controller.ts
│   ├── leaves.controller.ts
│   ├── configs.controller.ts
│   └── reports.controller.ts
│
├── services/                       # All business logic
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── attendance.service.ts
│   ├── leaves.service.ts
│   ├── configs.service.ts
│   └── reports.service.ts
│
├── repositories/                   # Persistence/database operations
│   ├── user.repository.ts
│   ├── attendance.repository.ts
│   ├── leave.repository.ts
│   └── holiday.repository.ts
│
├── entities/                       # TypeORM entities or schemas
│   ├── user.entity.ts
│   ├── attendance.entity.ts
│   ├── leave.entity.ts
│   └── holiday.entity.ts
│
├── dtos/                           # All DTOs
│   ├── auth/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── users/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   └── user-response.dto.ts
│   ├── attendance/
│   │   ├── create-attendance.dto.ts
│   │   └── attendance-report.dto.ts
│   ├── leaves/
│   │   ├── create-leave.dto.ts
│   │   ├── update-leave.dto.ts
│   │   └── leave-approval.dto.ts
│   └── configs/
│       ├── create-holiday.dto.ts
│       └── create-leave-bucket.dto.ts
│
├── guards/                         # Guards (JWT, Roles)
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
│
├── strategies/                     # Passport strategies
│   └── jwt.strategy.ts
│
├── interceptors/                   # Interceptors (e.g., logging)
│   └── logging.interceptor.ts
│
├── decorators/                     # Custom decorators
│   ├── roles.decorator.ts
│   └── user.decorator.ts
│
├── filters/                        # Exception filters
│   └── http-exception.filter.ts
│
├── utils/                          # Helpers
│   └── file-upload.util.ts
│
├── app.module.ts                   # Root module
└── main.ts                         # Bootstrap entry point
