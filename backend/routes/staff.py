from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models.staff import Staff, StaffCreate, StaffUpdate
from utils.dependencies import get_current_user
from datetime import datetime

router = APIRouter(prefix='/staff', tags=['Staff Management'])

# Get database from app state
from server import db

@router.get('', response_model=List[Staff])
async def get_all_staff(search: Optional[str] = Query(None)):
    """
    Get all staff members
    Optional search parameter to filter by name, nationalId, or code
    """
    query = {}
    
    if search:
        query = {
            '$or': [
                {'name': {'$regex': search, '$options': 'i'}},
                {'nationalId': {'$regex': search, '$options': 'i'}},
                {'code': {'$regex': search, '$options': 'i'}}
            ]
        }
    
    staff_list = await db.staff_members.find(query).to_list(1000)
    
    # Convert MongoDB documents to Staff models
    result = []
    for staff in staff_list:
        staff['id'] = str(staff['_id'])
        del staff['_id']
        result.append(Staff(**staff))
    
    return result

@router.get('/{staff_id}', response_model=Staff)
async def get_staff_by_id(staff_id: str):
    """Get a specific staff member by ID"""
    from bson import ObjectId
    
    try:
        staff = await db.staff_members.find_one({'_id': ObjectId(staff_id)})
    except:
        raise HTTPException(status_code=400, detail='Invalid staff ID format')
    
    if not staff:
        raise HTTPException(status_code=404, detail='Staff member not found')
    
    staff['id'] = str(staff['_id'])
    del staff['_id']
    
    return Staff(**staff)

@router.post('', response_model=Staff)
async def create_staff(staff_data: StaffCreate, current_user: dict = Depends(get_current_user)):
    """
    Create a new staff member (Protected - requires authentication)
    """
    # Check if nationalId already exists
    existing_staff = await db.staff_members.find_one({'nationalId': staff_data.nationalId})
    if existing_staff:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='الرقم الوطني موجود بالفعل'
        )
    
    # Prepare staff document
    staff_dict = staff_data.dict()
    staff_dict['createdAt'] = datetime.utcnow()
    staff_dict['updatedAt'] = datetime.utcnow()
    
    # Insert into database
    result = await db.staff_members.insert_one(staff_dict)
    
    # Fetch the created staff
    created_staff = await db.staff_members.find_one({'_id': result.inserted_id})
    created_staff['id'] = str(created_staff['_id'])
    del created_staff['_id']
    
    return Staff(**created_staff)

@router.put('/{staff_id}', response_model=Staff)
async def update_staff(
    staff_id: str,
    staff_data: StaffUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update a staff member (Protected - requires authentication)
    """
    from bson import ObjectId
    
    try:
        object_id = ObjectId(staff_id)
    except:
        raise HTTPException(status_code=400, detail='Invalid staff ID format')
    
    # Check if staff exists
    existing_staff = await db.staff_members.find_one({'_id': object_id})
    if not existing_staff:
        raise HTTPException(status_code=404, detail='Staff member not found')
    
    # Check if nationalId is being changed and if it's already taken
    if staff_data.nationalId != existing_staff['nationalId']:
        duplicate = await db.staff_members.find_one({
            'nationalId': staff_data.nationalId,
            '_id': {'$ne': object_id}
        })
        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='الرقم الوطني موجود بالفعل'
            )
    
    # Update staff
    staff_dict = staff_data.dict()
    staff_dict['updatedAt'] = datetime.utcnow()
    
    await db.staff_members.update_one(
        {'_id': object_id},
        {'$set': staff_dict}
    )
    
    # Fetch updated staff
    updated_staff = await db.staff_members.find_one({'_id': object_id})
    updated_staff['id'] = str(updated_staff['_id'])
    del updated_staff['_id']
    
    return Staff(**updated_staff)

@router.delete('/{staff_id}')
async def delete_staff(staff_id: str, current_user: dict = Depends(get_current_user)):
    """
    Delete a staff member (Protected - requires authentication)
    """
    from bson import ObjectId
    
    try:
        object_id = ObjectId(staff_id)
    except:
        raise HTTPException(status_code=400, detail='Invalid staff ID format')
    
    # Check if staff exists
    existing_staff = await db.staff_members.find_one({'_id': object_id})
    if not existing_staff:
        raise HTTPException(status_code=404, detail='Staff member not found')
    
    # Delete staff
    await db.staff_members.delete_one({'_id': object_id})
    
    return {'message': 'تم حذف الموظف بنجاح', 'id': staff_id}
