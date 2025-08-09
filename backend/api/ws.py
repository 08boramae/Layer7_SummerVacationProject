from typing import Dict, Set

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.utils.scoreboard import get_scoreboard


router = APIRouter(tags=["ws"])


class ConnectionManager:
    def __init__(self) -> None:
        self.channels: Dict[str, Set[WebSocket]] = {"scoreboard": set(), "challenges": set()}

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
        await websocket.send_json({"type": "snapshot", "data": get_scoreboard(db)})
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, "scoreboard")


@router.websocket("/ws/challenges")
async def websocket_challenges(websocket: WebSocket):
    await manager.connect(websocket, "challenges")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, "challenges")


async def broadcast_scoreboard(db: Session) -> None:
    await manager.broadcast("scoreboard", {"type": "update", "data": get_scoreboard(db)})


async def broadcast_challenges_update(payload: dict) -> None:
    await manager.broadcast("challenges", {"type": "challenges_update", "data": payload}) 