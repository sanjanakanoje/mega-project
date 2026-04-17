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