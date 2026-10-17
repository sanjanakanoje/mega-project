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


CREATE TABLE test_reports (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sample_id BIGINT NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    result VARCHAR(255),
    observation TEXT,
    remarks TEXT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE test_reports
ADD COLUMN IF NOT EXISTS test_method VARCHAR(255),
ADD COLUMN IF NOT EXISTS test_date DATE,
ADD COLUMN IF NOT EXISTS notes TEXT;





SELECT * FROM users;



SELECT column_name
FROM information_schema.columns
WHERE table_name='samples';


SELECT * FROM samples;


SELECT * FROM samples;

SELECT * FROM Users;

SELECT * FROM test_requests;


SELECT *
FROM test_requests
WHERE email = 'ram@gmail.co';

UPDATE test_requests
SET tests_required = '[]'
WHERE tests_required IS NULL;

ALTER TABLE test_requests
ADD COLUMN completed_tests JSON;

SELECT completed_tests FROM test_requests WHERE id = 4;


SELECT * FROM test_reports;

CREATE TABLE ai_conversations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES Users(UserID)
        ON DELETE CASCADE
);


CREATE TABLE ai_messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    conversation_id BIGINT NOT NULL,

    role VARCHAR(20) NOT NULL,

    message TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (conversation_id)
        REFERENCES ai_conversations(id)
        ON DELETE CASCADE
);


SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Tracking';


SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;



SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'tracking';


  
SELECT EXISTS (
    SELECT 1
    FROM test_reports
    WHERE sample_id = 6
) AS "reportGenerated";



SELECT
    tr.id,
    tr.sample_id,
    s.sampleid,
    s.userid,
    tr.test_name
FROM test_reports tr
LEFT JOIN samples s
    ON s.sampleid = tr.sample_id
WHERE tr.sample_id = 6;


SELECT
    s.sampleid,
    s.userid,
    tr.id AS report_id,
    tr.sample_id
FROM samples s
LEFT JOIN test_reports tr
    ON tr.sample_id = s.sampleid
WHERE s.sampleid = 6;


SELECT
    userid,
    name,
    email,
    role
FROM users
WHERE email = 'ram@gmail.com';


SELECT sampleid, userid, sampletype, barcode
FROM samples
WHERE sampleid = 6;


UPDATE samples
SET userid = 5
WHERE sampleid = 6;


SELECT *
FROM test_requests
WHERE id = 12;


SELECT
  id,
  company_name,
  tests_required,
  completed_tests
FROM test_requests
WHERE id = 12;

ALTER TABLE reports
ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE reports
ADD COLUMN IF NOT EXISTS observation TEXT;


ALTER TABLE reports
ADD COLUMN IF NOT EXISTS remarks TEXT;

ALTER TABLE reports
ADD COLUMN IF NOT EXISTS created_by INTEGER;


SELECT
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'reports'
ORDER BY ordinal_position;


SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'reports';

ALTER TABLE reports
ADD COLUMN IF NOT EXISTS test_name TEXT,
ADD COLUMN IF NOT EXISTS test_method TEXT;


SELECT *
FROM samples
WHERE sampleid = 12;

SELECT * FROM samples ORDER BY sampleid;

SELECT *
FROM samples
WHERE sampleid = 16;


SELECT sampleid, userid, sampletype, barcode, status
FROM samples
ORDER BY sampleid;


SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'reports'
ORDER BY ordinal_position;

SELECT id
FROM test_requests
WHERE id = 16;

SELECT *
FROM test_reports
WHERE sample_id = 12;