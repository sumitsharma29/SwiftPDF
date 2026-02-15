from fastapi import APIRouter, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from typing import List
import shutil
import os
import zipfile
from utils.pdf_processors import PDFProcessors
from utils.file_utils import generate_session_id, get_session_folder

router = APIRouter()

@router.post("/process/merge")
async def merge_pdfs(
    files: List[UploadFile] = File(...),
    background_tasks: BackgroundTasks = None
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    
    file_paths = []
    try:
        for file in files:
            file_path = os.path.join(folder, file.filename)
            
            # Read first 4 bytes for magic number validation
            header = await file.read(4)
            await file.seek(0)
            
            if not header.startswith(b'%PDF'):
                 # Allow image headers for conversion tools, but basic check for PDF tools
                 pass 
                 # For this strict implementation, we will enforce PDF magic bytes for PDF-only tools
                 # But since we have shared logic, we will do a tool-specific check below or generic safe save
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            file_paths.append(file_path)
        
        PDFProcessors.merge_pdfs(file_paths, output_path)
        
        return FileResponse(
            output_path, 
            filename=output_filename,
            media_type="application/pdf",
            background=BackgroundTasks().add_task(shutil.rmtree, folder, ignore_errors=True)
        )
    except Exception as e:
        shutil.rmtree(folder, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...)):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    images_folder = os.path.join(folder, "images")
    os.makedirs(images_folder, exist_ok=True)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Convert
        image_paths = PDFProcessors.pdf_to_images(file_path, images_folder)
        
        if len(image_paths) == 1:
            return FileResponse(
                image_paths[0], 
                filename=os.path.basename(image_paths[0]), 
                media_type="image/jpeg",
                background=BackgroundTasks().add_task(shutil.rmtree, folder, ignore_errors=True)
            )
        else:
            # Zip
            zip_filename = "images.zip"
            zip_path = os.path.join(folder, zip_filename)
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for img in image_paths:
                    zipf.write(img, os.path.basename(img))
                    
            return FileResponse(
                zip_path, 
                filename=zip_filename, 
                media_type="application/zip",
                background=BackgroundTasks().add_task(shutil.rmtree, folder, ignore_errors=True)
            )
    except Exception as e:
        shutil.rmtree(folder, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/jpg-to-pdf")
async def jpg_to_pdf(files: List[UploadFile] = File(...)):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    
    image_paths = []
    try:
        for file in files:
            file_path = os.path.join(folder, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            image_paths.append(file_path)
            
        output_filename = "converted.pdf"
        output_path = os.path.join(folder, output_filename)
        
        PDFProcessors.images_to_pdf(image_paths, output_path)
        
        return FileResponse(
            output_path, 
            filename=output_filename, 
            media_type="application/pdf",
            background=BackgroundTasks().add_task(shutil.rmtree, folder, ignore_errors=True)
        )
    except Exception as e:
        shutil.rmtree(folder, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/process/split")
async def split_pdf(
    file: UploadFile = File(...),
    page_range: str = Form(...)
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        output_filename = "split.pdf"
        output_path = os.path.join(folder, output_filename)
        
        PDFProcessors.split_pdf(file_path, output_path, page_range)
        
        return FileResponse(
            output_path, 
            filename=output_filename,
            media_type="application/pdf",
            background=BackgroundTasks().add_task(shutil.rmtree, folder, ignore_errors=True)
        )
    except Exception as e:
        shutil.rmtree(folder, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/preview")
async def preview_pdf(
    file: UploadFile = File(...),
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Generate previews
        previews = PDFProcessors.preview_pdf(file_path)
        
        # Cleanup immediately
        shutil.rmtree(folder, ignore_errors=True)
            
        return {"pages": previews}

    except Exception as e:
        shutil.rmtree(folder, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/organize")
async def organize_pdf(
    file: UploadFile = File(...),
    page_order: str = Form(...), # Comma separated indices
    rotation: str = Form("{}") # JSON string
):
    import json
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        output_filename = "organized.pdf"
        output_path = os.path.join(folder, output_filename)
        
        order_list = [int(i) for i in page_order.split(',')]
        rotation_dict = json.loads(rotation)
        
        PDFProcessors.organize_pdf(file_path, output_path, order_list, rotation_dict)
        
        return FileResponse(
            output_path, 
            filename=output_filename,
            background=BackgroundTasks().add_task(shutil.rmtree, folder, ignore_errors=True)
        )
    except Exception as e:
        shutil.rmtree(folder, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/compress")
async def compress_pdf(
    file: UploadFile = File(...),
    level: str = Form("medium")
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        output_filename = "compressed.pdf"
        output_path = os.path.join(folder, output_filename)
        
        PDFProcessors.compress_pdf(file_path, output_path, level)
        
        return FileResponse(
            output_path, 
            filename=output_filename, 
            media_type="application/pdf",
            background=BackgroundTasks().add_task(shutil.rmtree, folder, ignore_errors=True)
        )
    except Exception as e:
        shutil.rmtree(folder, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/lock")
async def lock_pdf(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        output_filename = "locked.pdf"
        output_path = os.path.join(folder, output_filename)
        
        PDFProcessors.lock_pdf(file_path, output_path, password)
        
        return FileResponse(
            output_path, 
            filename=output_filename, 
            media_type="application/pdf",
            background=BackgroundTasks().add_task(shutil.rmtree, folder, ignore_errors=True)
        )
    except Exception as e:
        shutil.rmtree(folder, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/unlock")
async def unlock_pdf(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        output_filename = "unlocked.pdf"
        output_path = os.path.join(folder, output_filename)
        
        PDFProcessors.unlock_pdf(file_path, output_path, password)
        
        return FileResponse(
            output_path, 
            filename=output_filename, 
            media_type="application/pdf",
            background=BackgroundTasks().add_task(shutil.rmtree, folder, ignore_errors=True)
        )
    except Exception as e:
        shutil.rmtree(folder, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/watermark")
async def watermark_pdf(
    file: UploadFile = File(...),
    text: str = Form(...)
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        output_filename = "watermarked.pdf"
        output_path = os.path.join(folder, output_filename)
        
        PDFProcessors.watermark_pdf(file_path, output_path, text, folder)
        
        return FileResponse(
            output_path, 
            filename=output_filename, 
            media_type="application/pdf",
            background=BackgroundTasks().add_task(shutil.rmtree, folder, ignore_errors=True)
        )
    except Exception as e:
        shutil.rmtree(folder, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))
