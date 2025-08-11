from typing import Dict, Set

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.utils.scoreboard import get_scoreboard
from backend.utils.challenges import get_challenge_stats


router = APIRouter(tags=["ws"])


class ConnectionManager:
    def __init__(self) -> None:
        self.channels: Dict[str, Set[WebSocket]] = {
            "scoreboard": set(),
            "challenges": set(),
            "announcements": set(),
        }

    async def connect(self, websocket: WebSocket, channel: str) -> None:
        await websocket.accept()
        self.channels.setdefault(channel, set()).add(websocket)

    def disconnect(self, websocket: WebSocket, channel: str) -> None:
        if channel in self.channels and websocket in self.channels[channel]:
            self.channels[channel].remove(websocket)

    async def broadcast(self, channel: str, message: dict) -> None:
        dead = []
        for ws in list(self.channels.get(channel, [])):
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            for ch in self.channels:
                self.channels[ch].discard(ws)


manager = ConnectionManager()


@router.websocket("/ws/scoreboard")
async def websocket_scoreboard(websocket: WebSocket, db: Session = Depends(get_db)):
    await manager.connect(websocket, "scoreboard")
    try:
        await websocket.send_json({"type": "scoreboard_snapshot", "data": get_scoreboard(db)})
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, "scoreboard")


@router.websocket("/ws/challenges")
async def websocket_challenges(websocket: WebSocket, db: Session = Depends(get_db)):
    await manager.connect(websocket, "challenges")
    try:
        await websocket.send_json({"type": "challenges_snapshot", "data": get_challenge_stats(db)})
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, "challenges")


@router.websocket("/ws/announcements")
async def websocket_announcements(websocket: WebSocket):
    await manager.connect(websocket, "announcements")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, "announcements")


async def broadcast_scoreboard(db: Session) -> None:
    await manager.broadcast("scoreboard", {"type": "scoreboard_update", "data": get_scoreboard(db)})


async def broadcast_challenges_update(payload: dict) -> None:
    await manager.broadcast("challenges", {"type": "challenges_update", "data": payload})


async def broadcast_challenges_stats_update(db: Session) -> None:
    await manager.broadcast("challenges", {"type": "challenges_stats", "data": get_challenge_stats(db)})


async def broadcast_announcement(message: str) -> None:
    await manager.broadcast("announcements", {"type": "announcement", "message": message}) 