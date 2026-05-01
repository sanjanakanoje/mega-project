CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255),
    Role VARCHAR(50)
);

CREATE TABLE Samples (
    SampleID SERIAL PRIMARY KEY,
    UserID INT,
    SampleType VARCHAR(100),
    Barcode VARCHAR(100) UNIQUE,
    Status VARCHAR(50),
    PredictedCompletionTime TIMESTAMP,
    DateReceived TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Tests (
    TestID SERIAL PRIMARY KEY,
    TestName VARCHAR(100)
);

CREATE TABLE TestPerformed (
    TestPerformedID SERIAL PRIMARY KEY,
    SampleID INT,
    TestID INT,
    Result TEXT,
    Status VARCHAR(50),
    FOREIGN KEY (SampleID) REFERENCES Samples(SampleID),
    FOREIGN KEY (TestID) REFERENCES Tests(TestID)
);

CREATE TABLE Reports (
    ReportID SERIAL PRIMARY KEY,
    SampleID INT,
    ReportDate TIMESTAMP,
    FinalResult TEXT,
    FOREIGN KEY (SampleID) REFERENCES Samples(SampleID)
);

CREATE TABLE Tracking (
    TrackingID SERIAL PRIMARY KEY,
    SampleID INT,
    StageName VARCHAR(100),
    Timestamp TIMESTAMP,
    UpdatedBy INT,
    FOREIGN KEY (SampleID) REFERENCES Samples(SampleID),
    FOREIGN KEY (UpdatedBy) REFERENCES Users(UserID)
);

CREATE TABLE test_requests (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    sample_id BIGINT,
    customer_id BIGINT,

    request_no VARCHAR(50),
    company_name VARCHAR(255),
    submitted_by VARCHAR(255),
    merchant_name VARCHAR(255),
    brand_label_name VARCHAR(255),
    vendor_code VARCHAR(100),

    email VARCHAR(255),
    phone_no VARCHAR(30),

    sample_description VARCHAR(255),
    style_no VARCHAR(100),
    season VARCHAR(50),
    fiber_content VARCHAR(255),
    fabric_weight VARCHAR(50),
    count_no VARCHAR(50),
    color VARCHAR(100),
    construction VARCHAR(100),
    end_use VARCHAR(100),

    fabric_report_no VARCHAR(100),
    trim_fabric_report_no VARCHAR(100),
    previous_test_report_no VARCHAR(100),
    bo_no VARCHAR(100),
    co_no VARCHAR(100),

    finish_type JSONB,
    division JSONB,
    package_type JSONB,
    tests_required JSONB,

    wash_instruction TEXT,
    wash_code VARCHAR(100),

    priority VARCHAR(30),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


SELECT * FROM users;



SELECT column_name
FROM information_schema.columns
WHERE table_name='samples';


SELECT * FROM samples;

SELECT * FROM samples;

SELECT * FROM Users;

SELECT * FROM test_requests;