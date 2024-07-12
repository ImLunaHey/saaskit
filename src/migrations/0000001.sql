CREATE TABLE
    IF NOT EXISTS user (
        id TEXT NOT NULL PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        two_factor_secret TEXT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS session (
        id TEXT NOT NULL PRIMARY KEY,
        user_agent TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        two_factor_verified_at INTEGER NULL,
        user_id TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user (id)
    );

CREATE TABLE
    IF NOT EXISTS audit_log (
        id TEXT NOT NULL PRIMARY KEY,
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user (id)
    );