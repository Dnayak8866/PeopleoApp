CREATE TABLE "role" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR NOT NULL UNIQUE
);

CREATE TABLE "user" (
  "id" INT PRIMARY KEY,
  "firstName" VARCHAR NOT NULL,
  "lastName" VARCHAR NOT NULL,
  "jobTitle" VARCHAR NOT NULL,
  "phone" BIGINT NOT NULL,
  "email" VARCHAR NOT NULL UNIQUE,
  "gender" VARCHAR NOT NULL,
  "dob" DATE NOT NULL,
  "joiningDate" DATE NOT NULL,
  "roleId" INT NOT NULL,
  "AddressLine1" VARCHAR NOT NULL,
  "AddressLine2" VARCHAR NOT NULL,
  "City" VARCHAR NOT NULL,
  "State" VARCHAR NOT NULL,
  "Country" VARCHAR NOT NULL,
  "Zipcode" VARCHAR NOT NULL,
  "AadharNumber" VARCHAR NOT NULL,
  "PANNumber" VARCHAR NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now(),
  "isDeleted" BOOLEAN NOT NULL,
  CONSTRAINT "FK_roleId" FOREIGN KEY ("roleId") REFERENCES "role"("id")
);

INSERT INTO "role" ("name") VALUES
('admin'),
('employee');