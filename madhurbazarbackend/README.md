# MadhurBazar Node Backend (Legacy MySQL Compatible)

This backend is designed to work with the existing PHP database schema in `madhurbazar`.

## 1) Setup

```bash
npm install
copy .env.example .env
```

Update `.env` values for your local MySQL.

## 2) Run

```bash
npm run dev
```

## 3) Core API endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/login/login` (compat alias)
- `GET /api/users/profile` (Bearer token required)
- `GET /api/results` (Bearer token required)
- `GET /api/results/today` (Bearer token required)
- `GET /api/results/bazar/:bazarId/visibility` (Bearer token required)

## 4) Legacy module routes (scaffolded)

All major legacy controller names now exist as REST modules:

- `/api/aakda`
- `/api/account`
- `/api/admin`
- `/api/adminaakda`
- `/api/adminagent`
- `/api/adminbalancereport`
- `/api/admindouble`
- `/api/admindpmotor`
- `/api/adminfamily`
- `/api/admingamereport`
- `/api/adminjodi`
- `/api/adminmaster`
- `/api/adminmpana`
- `/api/adminplayer`
- `/api/adminplreport`
- `/api/adminsingle`
- `/api/adminspmotor`
- `/api/admintriple`
- `/api/agentmaster`
- `/api/balancereport`
- `/api/batcontroller`
- `/api/bazar`
- `/api/client`
- `/api/double`
- `/api/dpmotor`
- `/api/family`
- `/api/gameopen`
- `/api/gamereport`
- `/api/gameresult`
- `/api/home`
- `/api/jodi`
- `/api/jodifamily`
- `/api/multipatti`
- `/api/plreport`
- `/api/profile`
- `/api/single`
- `/api/spmotor`
- `/api/tripple`
- `/api/user`

Each scaffolded module currently supports:
- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

## 5) Login payload (legacy-compatible names)

```json
{
  "userName": "your_username",
  "passWord": "your_password"
}
```

## 6) Notes for migration from PHP

- Password check currently follows old behavior (`md5`).
- Existing table names are used directly (no migrations yet).
- This is intentional for safe module-by-module migration.
- Core models are added for: `game_user_personal`, `game_user_account`, `game_result`, `game_bazar`, `lucky_number`, `notice`, `game_user_bazar`, `game_bazar_day`, `game_ticket`, `user_passbook`, `game_user_commission`.
