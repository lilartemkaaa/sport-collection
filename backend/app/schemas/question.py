from pydantic import BaseModel, Field
from typing import Optional


class QuestionCreate(BaseModel):
    question: str
    option_1: str
    option_2: str
    option_3: str
    option_4: str
    correct_option: int = Field(ge=1, le=4)


class QuestionUpdate(BaseModel):
    question: Optional[str] = None
    option_1: Optional[str] = None
    option_2: Optional[str] = None
    option_3: Optional[str] = None
    option_4: Optional[str] = None
    correct_option: Optional[int] = Field(default=None, ge=1, le=4)


class QuestionOut(BaseModel):
    id: int
    question: str
    option_1: str
    option_2: str
    option_3: str
    option_4: str
    correct_option: int

    model_config = {"from_attributes": True}
