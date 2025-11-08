"Project context
- Repo: people-management-backend (NestJS)
- Follow existing project structure and coding patterns (controllers → services → modules → dtos → entities/repositories)
- Mirror style of an existing module in repo (use same decorators, DI, error handling and file naming)

Resource
- <ResourceName> — singular PascalCase (e.g. Attendance)
- <resource-name> — kebab-case route (e.g. attendance)
- <resourcePlural> — plural kebab-case (e.g. attendances)
- <Fields> — list of fields with types and constraints (e.g. userId: uuid required, date: ISO date required, status: enum[present,absent], notes?: string)
- <Relations> — relations to existing entities (e.g. Attendance -> User many-to-one)

ORM & infra
- ORM: <typeorm|prisma> (choose)
- DB migrations: <yes|no> (if yes include migration/prisma migrate steps)
- Soft delete: <true|false>
- Auth: <none|jwt|roles> (if roles, list allowed roles e.g. admin,teacher)
- ValidationPipe: assume enabled globally (if not, add explicit pipes)

Endpoints to generate
- POST   /api/<resource-name>         -> create
- GET    /api/<resource-name>         -> list (pagination, sort, filters)
- GET    /api/<resource-name>/:id     -> get by id
- PATCH  /api/<resource-name>/:id     -> partial update
- DELETE /api/<resource-name>/:id     -> soft or hard delete per project setting

Controller requirements
- Keep controller thin; call service methods
- Use DTOs for body and query parameters
- Apply guards/roles consistent with project (e.g. @UseGuards(JwtAuthGuard), @Roles(...))
- Use proper HTTP codes and Swagger decorators (@ApiTags, @ApiOperation, @ApiResponse)

Service requirements
- Implement create, findAll (page, limit, sort, filters), findOne, update, remove
- Use repository/ORM pattern consistent with repo
- Use transactions for multi-step operations
- Map entities to output DTOs (do not return raw DB objects with sensitive fields)

DTOs & validation
- Create Create<Resource>Dto and Update<Resource>Dto (Update extends PartialType)
- Create Query DTO (page, limit, sort, order, q, filters)
- Use class-validator decorators for each field and class-transformer where needed

Entity / Schema
- Add entity/schema fields and relations consistent with existing models
- Add appropriate indices and unique constraints
- If TypeORM: add migration file
- If Prisma: update schema.prisma and include migrate steps

Error handling & logging
- Throw Nest exceptions (NotFoundException, BadRequestException, ConflictException)
- Use project logger for warnings/errors
- Do not log sensitive data

Security & best practices
- Validate & sanitize inputs
- Enforce authorization checks and ownership where applicable
- Omit sensitive properties from responses
- Rate-limit or throttle endpoints if project uses it

Testing
- Unit tests for service (happy path + error cases)
- Controller tests with mocked service
- Optional e2e tests against test DB (use sqlite or test container if project uses it)
- Ensure tests run with existing jest config

Docs & CI
- Add Swagger annotations and example requests/responses
- Update README or docs if new public API added
- Ensure lint, type-check, and tests pass in CI

Files to add/modify (suggested)
- src/<module>/<resource>.controller.ts
- src/<module>/<resource>.service.ts
- src/<module>/<resource>.module.ts
- src/<module>/dtos/create-<resource>.dto.ts
- src/<module>/dtos/update-<resource>.dto.ts
- src/<module>/dtos/<resource>-query.dto.ts
- src/entities/<resource>.entity.ts

Notes:
Please create single dto class file for add/update etc.


Notes
- If unsure about an exact pattern in this repo, ask to inspect an example module file to mirror style.
- Keep generated code consistent with repo lint and formatting rules."
