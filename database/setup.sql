-- Run this once in cPanel → phpMyAdmin after creating your database.
-- Select your database first, then paste this into the SQL tab and click Go.

CREATE TABLE IF NOT EXISTS users (
  id           CHAR(32)     NOT NULL,
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  role         ENUM('member','admin') NOT NULL DEFAULT 'member',
  password_hash VARCHAR(255) NOT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          CHAR(32)  NOT NULL,
  user_id     CHAR(32)  NOT NULL,
  token_hash  CHAR(64)  NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_token_hash (token_hash),
  KEY idx_user_id (user_id),
  CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Event registration system ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscriptions (
  id          CHAR(32)      NOT NULL,
  user_id     CHAR(32)      NOT NULL,
  type        ENUM('lunar') NOT NULL,
  valid_from  DATE          NOT NULL,
  valid_until DATE          NOT NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sub_user (user_id),
  CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS events (
  id             VARCHAR(64)  NOT NULL,
  title          VARCHAR(255) NOT NULL,
  event_type     ENUM('casual-commander','board-game','special-formats',
                      'pauper','pauper-prize','cedh-showdown','cedh-league',
                      'open-market') NOT NULL,
  format         VARCHAR(50)  NOT NULL DEFAULT '',
  scheduled_date DATE         NOT NULL,
  scheduled_time TIME         NOT NULL,
  location       VARCHAR(255) NOT NULL DEFAULT 'Locație centrală, București',
  capacity       SMALLINT     NOT NULL DEFAULT 30,
  spots_left     SMALLINT     NOT NULL DEFAULT 30,
  status         ENUM('upcoming','today','full','past') NOT NULL DEFAULT 'upcoming',
  description    TEXT,
  fee_standard   DECIMAL(7,2) NOT NULL DEFAULT 0.00,
  fee_member     DECIMAL(7,2) NOT NULL DEFAULT 0.00,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS event_registrations (
  id          CHAR(32)      NOT NULL,
  user_id     CHAR(32)      NOT NULL,
  event_id    VARCHAR(64)   NOT NULL,
  amount_paid DECIMAL(7,2)  NOT NULL DEFAULT 0.00,
  status      ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_event (user_id, event_id),
  KEY idx_reg_event (event_id),
  CONSTRAINT fk_reg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed events (adjust dates as needed each month)
INSERT IGNORE INTO events
  (id, title, event_type, scheduled_date, scheduled_time, location, capacity, spots_left, status, description, fee_standard, fee_member)
VALUES
  ('cedh-league-2026-04-22', 'cEDH League Night', 'cedh-league', '2026-04-22', '18:00:00',
   'Locație centrală, București', 30, 25, 'upcoming',
   'Meciuri din Liga Lunară cEDH. Acumulează puncte pentru clasament și calificare în finala lunară.', 200.00, 180.00),
  ('pauper-2026-04-23', 'Pauper Night', 'pauper', '2026-04-23', '18:00:00',
   'Locație centrală, București', 30, 18, 'upcoming',
   'Format Pauper pentru jucători noi și veterani. 4 runde Swiss, premii pentru top finishers.', 35.00, 30.00),
  ('cmd-casual-2026-04-24', 'Casual Commander Night', 'casual-commander', '2026-04-24', '18:00:00',
   'Locație centrală, București', 30, 22, 'upcoming',
   'Seară dedicată Commander casual, atmosferă prietenoasă, power level 1–7.', 30.00, 0.00),
  ('board-game-2026-04-25', 'Board Game Night', 'board-game', '2026-04-25', '18:00:00',
   'Locație centrală, București', 30, 20, 'upcoming',
   'Seară dedicată board game-urilor și activităților sociale.', 30.00, 0.00),
  ('cmd-saturday-2026-04-26', 'Commander Saturday – Casual', 'casual-commander', '2026-04-26', '14:00:00',
   'Locație centrală, București', 30, 15, 'upcoming',
   'Zi dedicată Commander casual. Vino cu orice deck de power level 1–7.', 30.00, 0.00),
  ('cedh-showdown-2026-04-26', 'cEDH Showdown', 'cedh-showdown', '2026-04-26', '14:00:00',
   'Locație centrală, București', 16, 11, 'upcoming',
   'Eveniment competitiv dedicat jucătorilor de cEDH, organizat în cadrul zilei de sâmbătă.', 35.00, 30.00),
  ('open-market-2026-04-27', 'Open Market Sunday', 'open-market', '2026-04-27', '12:00:00',
   'Locație centrală, București', 30, 30, 'upcoming',
   'Zi deschisă comunității pentru trade, vânzare și schimburi. Participare gratuită.', 0.00, 0.00);


-- ─── Leveling system ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_xp (
  user_id      CHAR(32) NOT NULL,
  total_xp     INT      NOT NULL DEFAULT 0,
  last_seen_xp INT      NOT NULL DEFAULT 0,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                         ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_uxp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS event_attendances (
  id          CHAR(32)    NOT NULL,
  user_id     CHAR(32)    NOT NULL,
  event_id    VARCHAR(64) NOT NULL,
  xp_awarded  INT         NOT NULL DEFAULT 0,
  attended_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_event_att (user_id, event_id),
  CONSTRAINT fk_att_user  FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE,
  CONSTRAINT fk_att_event FOREIGN KEY (event_id) REFERENCES events(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
