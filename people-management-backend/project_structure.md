src/
│
├── app.module.ts                # Root module
├── main.ts                      # Entry point
│
├── auth/                        # Authentication and authorization
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── guards/                  # JWT & Role guards
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/              # JWT strategy
│   │   └── jwt.strategy.ts
│   └── dto/                     # Login/Register DTOs
│
├── users/                       # Admins and employees
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       └── user-response.dto.ts
│
├── attendance/                  # Punch-in, punch-out, logs
│   ├── attendance.module.ts
│   ├── attendance.controller.ts
│   ├── attendance.service.ts
│   ├── entities/
│   │   └── attendance.entity.ts
│   └── dto/
│       ├── create-attendance.dto.ts
│       └── attendance-report.dto.ts
│
├── leaves/                      # Leave requests and approvals
│   ├── leaves.module.ts
│   ├── leaves.controller.ts
│   ├── leaves.service.ts
│   ├── entities/
│   │   └── leave.entity.ts
│   └── dto/
│       ├── create-leave.dto.ts
│       ├── update-leave.dto.ts
│       └── leave-approval.dto.ts
│
├── configs/                     # Holiday configs, leave buckets
│   ├── configs.module.ts
│   ├── configs.controller.ts
│   ├── configs.service.ts
│   ├── entities/
│   │   └── holiday.entity.ts
│   └── dto/
│       ├── create-holiday.dto.ts
│       └── create-leave-bucket.dto.ts
│
├── reports/                     # Reports and dashboards
│   ├── reports.module.ts
│   ├── reports.controller.ts
│   └── reports.service.ts
│
├── common/                      # Shared utilities, decorators, filters
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── user.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── interceptors/
│       └── logging.interceptor.ts
│
└── utils/                       # Helper functions, constants
    └── file-upload.util.ts
