from pydantic import BaseModel


class FlagSubmit(BaseModel):
    flag: str 