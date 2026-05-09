from fastapi import APIRouter, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from typing import List
import shutil
import os
import zipfile
import json
from utils.pdf_processors import PDFProcessors
from utils.ai_processors import ai_processor
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
@router.post("/process/extract-pages")
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

@router.post("/process/ocr")
async def ocr_pdf(
    file: UploadFile = File(...),
    lang: str = Form("eng"),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "ocr_result.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.ocr_pdf(file_path, output_path, lang)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/crop-pdf")
async def crop_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "cropped_document.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.crop_pdf(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/remove-bg")
async def remove_bg(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "bg_removed.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.remove_bg(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/psd-to-pdf")
async def psd_to_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"{os.path.splitext(file.filename)[0]}.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.pdf_from_psd(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/tiff-to-pdf")
async def tiff_to_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"{os.path.splitext(file.filename)[0]}.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.pdf_from_images([file_path], output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/pdf-to-tiff")
async def pdf_to_tiff(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"{os.path.splitext(file.filename)[0]}.tiff"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.pdf_to_tiff(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="image/tiff")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/ppt-to-pdf")
async def ppt_to_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"{os.path.splitext(file.filename)[0]}.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.pdf_from_pptx(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/pdf-to-pdfa")
async def pdf_to_pdfa(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"{os.path.splitext(file.filename)[0]}_a.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.pdf_to_pdfa(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/remove-pages")
async def remove_pages(
    file: UploadFile = File(...),
    page_range: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "pages_removed.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.remove_pages(file_path, output_path, page_range)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/rotate-pdf")
async def rotate_pdf(
    file: UploadFile = File(...),
    angle: str = Form("90"),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "rotated_document.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.rotate_pdf(file_path, output_path, int(angle))
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/pdf-to-word")
async def pdf_to_word(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"{os.path.splitext(file.filename)[0]}.docx"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.pdf_to_word(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/word-to-pdf")
async def word_to_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"{os.path.splitext(file.filename)[0]}.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.word_to_pdf(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/excel-to-pdf")
async def excel_to_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"{os.path.splitext(file.filename)[0]}.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.excel_to_pdf(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/html-to-pdf")
async def html_to_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"{os.path.splitext(file.filename)[0]}.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.html_to_pdf(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/json-to-pdf")
@router.post("/process/xml-to-pdf")
@router.post("/process/yaml-to-pdf")
async def data_to_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"{os.path.splitext(file.filename)[0]}.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        with open(file_path, "r", encoding="utf-8") as f:
            data = f.read()
        PDFProcessors.pdf_from_data(data, "data", output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))



# Redefining to handle correctly
@router.post("/process/pdf-to-json")
async def pdf_to_json(file: UploadFile = File(...)):
    return await _handle_pdf_to_data(file, "json")

@router.post("/process/pdf-to-xml")
async def pdf_to_xml(file: UploadFile = File(...)):
    return await _handle_pdf_to_data(file, "xml")

@router.post("/process/pdf-to-yaml")
async def pdf_to_yaml(file: UploadFile = File(...)):
    return await _handle_pdf_to_data(file, "yaml")

async def _handle_pdf_to_data(file: UploadFile, format_type: str):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        result = PDFProcessors.pdf_to_data(file_path, format_type)
        safe_rmtree(folder)
        return {"result": result}
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/base64-to-pdf")
async def base64_to_pdf(
    b64_string: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "decoded_document.pdf"
    output_path = os.path.join(folder, output_filename)
    try:
        PDFProcessors.pdf_from_base64(b64_string, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/pdf-to-base64")
async def pdf_to_base64(
    file: UploadFile = File(...),
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        import base64
        with open(file_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
        
        safe_rmtree(folder)
        return {"base64": encoded}
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/pdf-to-excel")
async def pdf_to_excel(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = f"{os.path.splitext(file.filename)[0]}.xlsx"
    output_path = os.path.join(folder, output_filename)
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        PDFProcessors.pdf_to_excel(file_path, output_path)
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
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

@router.post("/process/edit")
async def edit_pdf(
    file: UploadFile = File(...),
    edits: str = Form(...), # JSON string of edits: [{"page": 0, "x": 100, "y": 100, "text": "Hello"}]
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    session_id = generate_session_id()
    folder = get_session_folder(session_id)
    output_filename = "edited_document.pdf"
    output_path = os.path.join(folder, output_filename)
    
    try:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        edit_data = json.loads(edits)
        
        # We need a new processor method for this
        PDFProcessors.apply_edits(file_path, output_path, edit_data, folder)
        
        background_tasks.add_task(safe_rmtree, folder)
        return FileResponse(output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        safe_rmtree(folder)
        raise HTTPException(status_code=500, detail=str(e))


