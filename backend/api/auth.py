"""Authentication API for the Omnia AI platform."""
from datetime import datetime, timedelta
from typing import Optional
import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from models.user import UserCreate, UserResponse, UserLogin

# Create router
router = APIRouter(prefix="/auth", tags=["auth"])

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# Secret key for JWT
SECRET_KEY = os.environ.get("SECRET_KEY", "omnia_ai_secret_key_change_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class Token(BaseModel):
    """Token model for authentication."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Token data model for authentication."""
    username: Optional[str] = None


def verify_password(plain_password, hashed_password):
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Get password hash."""
    return pwd_context.hash(password)


async def get_user(db, username: str):
    """Get a user from the database by username."""
    user = await db.users.find_one({"username": username})
    if user:
        return user
    return None


async def authenticate_user(db, username: str, password: str):
    """Authenticate a user."""
    user = await get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create an access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get the current user from the token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    # user = get_user(fake_users_db, username=token_data.username)
    # if user is None:
    #     raise credentials_exception
    # return user
    return {"username": token_data.username}


async def get_current_active_user(current_user = Depends(get_current_user)):
    """Get the current active user."""
    # if current_user.disabled:
    #     raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db = Depends(lambda: None)):
    """Register a new user."""
    # Check if user exists
    existing_user = await db.users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    
    # Create user
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict.pop("password")
    user_dict["hashed_password"] = hashed_password
    user_dict["created_at"] = datetime.utcnow()
    user_dict["updated_at"] = datetime.utcnow()
    user_dict["is_active"] = True
    user_dict["id"] = str(await db.users.insert_one(user_dict).inserted_id)
    
    return UserResponse(**user_dict)


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(lambda: None)):
    """Login for an access token."""
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
