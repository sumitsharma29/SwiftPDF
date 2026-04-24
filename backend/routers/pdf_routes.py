from fastapi import APIRouter, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from typing import List
import shutil
import os
import zipfile
import json
from utils.pdf_processors import PDFProcessors
from utils.file_utils import generate_session_id, get_session_folder

router = APIRouter()

def safe_rmtree(path):
    shutil.rmtree(path, ignore_errors=True)

@router.post("/process/merge")
async def merge_pdfs(
    files: List[UploadFile] = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "merged_document.pdf"
    output_path = os.path.join(folder, output_filename)
    
    file_paths = []
    try:
        for file in files:
            file_path = os.path.join(folder, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            file_paths.append(file_path)
        
        PDFProcessors.merge_pdfs(file_paths, output_path)
        
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(
            output_path, 
            filename=output_filename,
            media_type="application/pdf"
        )
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/split")
async def split_pdf(
    file: UploadFile = File(...),
    page_range: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "split_pages.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        PDFProcessors.split_pdf(file_path, output_path, page_range)
        
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/pdf-to-jpg")
async def pdf_to_jpg(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    images_folder = os.path.join(folder, "images")
    os.makedirs(images_folder, exist_ok=True)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        image_paths = PDFProcessors.pdf_to_images(file_path, images_folder)
        
        if len(image_paths) == 1:
            background_tasks.add_task(safe_rmtree, folder)
            return FileResponse(image_paths[0], filename="page_1.jpg", media_type="image/jpeg")
        else:
            zip_filename = "extracted_images.zip"
            zip_path = os.path.join(folder, zip_filename)
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for img in image_paths:
                    zipf.write(img, os.path.basename(img))
            
            background_tasks.add_task(safe_rmtree, folder)
            return FileResponse(zip_path, filename=zip_filename, media_type="application/zip")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/jpg-to-pdf")
async def jpg_to_pdf(
    files: List[UploadFile] = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "converted_images.pdf"
    output_path = os.path.join(folder, output_filename)
    
    image_paths = []
    try:
        for file in files:
            file_path = os.path.join(folder, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            image_paths.append(file_path)
            
        PDFProcessors.images_to_pdf(image_paths, output_path)
        
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/compress")
async def compress_pdf(
    file: UploadFile = File(...),
    level: str = Form("medium"),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"compressed_{level}.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        PDFProcessors.compress_pdf(file_path, output_path, level)
        
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/lock")
async def lock_pdf(
    file: UploadFile = File(...),
    password: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "protected_document.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        PDFProcessors.lock_pdf(file_path, output_path, password)
        
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/unlock")
async def unlock_pdf(
    file: UploadFile = File(...),
    password: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "unlocked_document.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        PDFProcessors.unlock_pdf(file_path, output_path, password)
        
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/organize")
async def organize_pdf(
    file: UploadFile = File(...),
    page_order: str = Form(...),
    rotation: str = Form("{}"),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "reorganized_document.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        order_list = [int(i) for i in page_order.split(',')]
        rotation_dict = json.loads(rotation)
        
        PDFProcessors.organize_pdf(file_path, output_path, order_list, rotation_dict)
        
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/watermark")
async def watermark_pdf(
    file: UploadFile = File(...),
    text: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "watermarked_document.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        PDFProcessors.watermark_pdf(file_path, output_path, text, folder)
        
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/extract-text")
async def extract_text(file: UploadFile = File(...)):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        text = PDFProcessors.extract_text(file_path)
        safe_rmtree(folder)
        return {"text": text}
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/repair")
async def repair_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "repaired_document.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.repair_pdf(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/edit-metadata")
async def edit_metadata(
    file: UploadFile = File(...),
    title: str = Form(None),
    author: str = Form(None),
    subject: str = Form(None),
    keywords: str = Form(None),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "updated_metadata.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        metadata = {k: v for k, v in {"title": title, "author": author, "subject": subject, "keywords": keywords}.items() if v}
        PDFProcessors.edit_metadata(file_path, output_path, metadata)
        
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/add-page-numbers")
async def add_page_numbers(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "numbered_document.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.add_page_numbers(file_path, output_path, folder)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/preview")
async def preview_pdf(file: UploadFile = File(...)):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        previews = PDFProcessors.preview_pdf(file_path)
        safe_rmtree(folder)
        return {"pages": previews}
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/redact")
async def redact_pdf(
    file: UploadFile = File(...),
    search_text: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "redacted_document.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.redact_pdf(file_path, output_path, search_text)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/compare")
async def compare_pdfs(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    try:
        path1 = os.path.join(folder, "doc1.pdf")
        path2 = os.path.join(folder, "doc2.pdf")
        with open(path1, "wb") as b1: shutil.copyfileobj(file1.file, b1)
        with open(path2, "wb") as b2: shutil.copyfileobj(file2.file, b2)
        
        report = PDFProcessors.compare_pdfs(path1, path2)
        safe_rmtree(folder)
        return {"report": report}
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/sign")
async def sign_pdf(
    file: UploadFile = File(...),
    signature_text: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "signed_document.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.sign_pdf(file_path, output_path, signature_text, folder)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))


