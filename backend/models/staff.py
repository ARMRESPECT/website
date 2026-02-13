from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class StaffBase(BaseModel):
    name: str
    nationalId: str
    code: str
    rank: str
    image: Optional[str] = None
    certificates: List[str] = []

class StaffCreate(StaffBase):
    pass

class StaffUpdate(StaffBase):
    pass

class Staff(StaffBase):
    id: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
