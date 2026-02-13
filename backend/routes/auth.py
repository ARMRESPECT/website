from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.admin import AdminLogin, Token
from utils.auth import verify_password, get_password_hash, create_access_token
import os

router = APIRouter(prefix='/auth', tags=['Authentication'])

# Get database from app state
from server import db

@router.post('/login', response_model=Token)
async def login(credentials: AdminLogin):
    """
    Admin login endpoint
    Returns JWT token on successful authentication
    """
    # Find admin by username
    admin = await db.admins.find_one({'username': credentials.username})
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='اسم المستخدم أو كلمة المرور غير صحيحة',
        )
    
    # Verify password
    if not verify_password(credentials.password, admin['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='اسم المستخدم أو كلمة المرور غير صحيحة',
        )
    
    # Create access token
    access_token = create_access_token(data={'sub': admin['username']})
    
    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'user': {
            'username': admin['username'],
            'id': str(admin['_id'])
        }
    }

@router.post('/setup-admin')
async def setup_admin():
    """
    Setup default admin account
    This endpoint creates the default admin if it doesn't exist
    """
    # Check if admin already exists
    existing_admin = await db.admins.find_one({'username': 'admin'})
    
    if existing_admin:
        return {'message': 'Admin already exists'}
    
    # Create default admin
    hashed_password = get_password_hash('admin123')
    admin_data = {
        'username': 'admin',
        'password': hashed_password
    }
    
    result = await db.admins.insert_one(admin_data)
    
    return {
        'message': 'Default admin created successfully',
        'username': 'admin',
        'password': 'admin123'
    }
