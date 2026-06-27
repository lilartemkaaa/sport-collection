from pydantic import BaseModel, field_validator
from app.models.user import UserRole


class RegisterRequest(BaseModel):
    username: str
    password: str
    role: UserRole = UserRole.user

    @field_validator("username")
    @classmethod
    def username_not_empty(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3:
            raise ValueError("username must be at least 3 characters")
        return v

    @field_validator("password")
    @classmethod
    def password_not_empty(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("password must be at least 6 characters")
        if "\x00" in v:
            raise ValueError("password must not contain NULL bytes")
        return v


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    username: str
    role: UserRole
    tickets_balance: int

    model_config = {"from_attributes": True}
