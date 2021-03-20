CREATE DATABASE hr;

CREATE TABLE empoyee
(
    em_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    address VARCHAR(255),
    phoneNum NUMBER(12),
    hire_date DATE,
    job_id VARCHAR(255),
    dep_id VARCHAR(255),
    mgt_id VARCHAR(255),
    color VARCHAR(255)
);

CREATE TABLE department
(
    dep_id SERIAL PRIMARY KEY,
    department_name VARCHAR(255),
    mgt_id VARCHAR(255)
);

CREATE TABLE job_history
(
    employee_id VARCHAR(255),
    start_date DATE,
    end_date DATE,
    job_id VARCHAR(255),
    dep_id VARCHAR(255)
);

CREATE TABLE notify
(
    nti_id SERIAL PRIMARY KEY,
    MESSAGE VARCHAR(255)
);

