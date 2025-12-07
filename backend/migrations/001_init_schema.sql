-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  state VARCHAR(2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- States table
CREATE TABLE states (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  abbreviation VARCHAR(2) UNIQUE NOT NULL,
  rules JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  state_id INTEGER REFERENCES states(id),
  question_text TEXT NOT NULL,
  image_url VARCHAR(255),
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  category VARCHAR(50),
  difficulty VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Signs table
CREATE TABLE signs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mutcd_code VARCHAR(50),
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(255),
  description TEXT,
  state_variations JSONB,
  penalties TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Performance table
CREATE TABLE user_performance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  state_id INTEGER REFERENCES states(id),
  questions_answered INTEGER,
  correct_answers INTEGER,
  score DECIMAL(5, 2),
  test_type VARCHAR(50),
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Sign Scans table
CREATE TABLE user_sign_scans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  sign_id INTEGER REFERENCES signs(id),
  image_url VARCHAR(255),
  confidence DECIMAL(3, 2),
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Progress table
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  state_id INTEGER REFERENCES states(id),
  category VARCHAR(50),
  completed_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_questions_state ON questions(state_id);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_user_performance_user ON user_performance(user_id);
CREATE INDEX idx_user_performance_state ON user_performance(state_id);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
