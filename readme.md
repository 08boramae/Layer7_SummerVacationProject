## Layer7 CTF Backend

선린인터넷고등학교 해킹 전공 동아리 — 여름방학 프로젝트 (백엔드)

### Installation for Development

```bash
git clone https://github.com/Layer7-2025/SummerVacationProject
cd SummerVacationProject
# venv
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
# Ignition
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Production Deploy (Docker)

```bash
git clone https://github.com/Layer7-2025/SummerVacationProject
cd SummerVacationProject

# Build
docker build -f backend/Dockerfile -t layer7-ctf-backend .

# Run
docker run -d --name ctf-backend \
  -p 8000:8000 \
  -e SECRET_KEY="change-me" \
  -v $(pwd)/backend/db:/app/backend/db \
  -v $(pwd)/backend/storage/challenges:/app/backend/storage/challenges \
  layer7-ctf-backend
```

- ENV
  - `SECRET_KEY`: JWT 비밀키
  - `DATABASE_URL` (선택): e.g. `postgresql+psycopg://user:pass@host:5432/dbname`
  - `ACCESS_TOKEN_MINUTES` (선택)

### Frontend

Not yet

### LICENSE

BSD-4-Clause

### Developers

- Frontend: [25기 김지후](https://github.com/swap-dh)
- Backend: [24기 장재영](https://github.com/08boramae), [25기 이가윤](https://github.com/2gayn030)
