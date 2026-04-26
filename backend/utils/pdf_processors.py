import os
from typing import List
from pypdf import PdfReader, PdfWriter

class PDFProcessors:
    """
    Class containing all PDF manipulation logic.
    """

    @staticmethod
    def merge_pdfs(file_paths: List[str], output_path: str):
        merger = PdfWriter()
        for pdf in file_paths:
            merger.append(pdf)
        merger.write(output_path)
        merger.close()

    @staticmethod
    def split_pdf(file_path: str, output_path: str, page_range: str):
        # page_range format: "1-5", "1,3,5" or "1-2, 5"
        reader = PdfReader(file_path)
        writer = PdfWriter()
        
        try:
            pages_to_keep = set()
            for part in page_range.split(','):
                part = part.strip()
                if '-' in part:
                    start, end = map(int, part.split('-'))
                    pages_to_keep.update(range(start-1, end))
                else:
                    pages_to_keep.add(int(part)-1)

            for i in range(len(reader.pages)):
                if i in pages_to_keep:
                    writer.add_page(reader.pages[i])
            
            with open(output_path, "wb") as f:
                writer.write(f)
        except Exception:
            raise ValueError("Invalid page range format. Use '1-5', '1,3,5' or '1-2, 5'.")

    @staticmethod
    def organize_pdf(file_path: str, output_path: str, page_order: List[int], rotation: dict):
        # page_order: list of 0-based indices in desired order
        # rotation: dict of {page_index: angle}
        reader = PdfReader(file_path)
        writer = PdfWriter()
        
        for page_idx in page_order:
            if 0 <= page_idx < len(reader.pages):
                page = reader.pages[page_idx]
                if str(page_idx) in rotation:
                    # pypdf rotation is relative to current, usually just set it
                    page.rotate(int(rotation[str(page_idx)]))
                writer.add_page(page)
        
        with open(output_path, "wb") as f:
            writer.write(f)

    @staticmethod
    def images_to_pdf(image_paths: List[str], output_path: str):
        import img2pdf
        # input: list of image paths
        # output: single pdf path
        with open(output_path, "wb") as f:
            f.write(img2pdf.convert(image_paths))

    @staticmethod
    def pdf_to_images(file_path: str, output_folder: str):
        import fitz  # PyMuPDF
        # Returns list of paths to generated images
        # Uses PyMuPDF (fitz) which doesn't require system poppler
        doc = fitz.open(file_path)
        image_paths = []
        
        for i in range(len(doc)):
            page = doc.load_page(i)
            # Render page to an image
            pix = page.get_pixmap()
            image_path = os.path.join(output_folder, f"page_{i + 1}.jpg")
            pix.save(image_path)
            image_paths.append(image_path)
            
        doc.close()
        return image_paths

    @staticmethod
    def compress_pdf(file_path: str, output_path: str, level: str):
        import pikepdf
        # Use pikepdf for better compression
        try:
            with pikepdf.open(file_path) as pdf:
                # Remove unused resources
                pdf.remove_unreferenced_resources()
                
                # Save with linearization and object stream generation
                pdf.save(
                    output_path, 
                    linearize=True, 
                    object_stream_mode=pikepdf.ObjectStreamMode.generate
                )
        except Exception as e:
            # Fallback to pypdf if pikepdf fails
            print(f"Pikepdf failed: {e}, using fallback")
            reader = PdfReader(file_path)
            writer = PdfWriter()
            for page in reader.pages:
                page.compress_content_streams()
                writer.add_page(page)
            with open(output_path, "wb") as f:
                writer.write(f)

    @staticmethod
    def lock_pdf(file_path: str, output_path: str, password: str):
        import pikepdf
        with pikepdf.Pdf.open(file_path) as pdf:
            pdf.save(output_path, encryption=pikepdf.Encryption(
                user=password, owner=password, R=6
            ))

    @staticmethod
    def unlock_pdf(file_path: str, output_path: str, password: str):
        import pikepdf
        try:
            with pikepdf.Pdf.open(file_path, password=password) as pdf:
                pdf.save(output_path)
        except pikepdf.PasswordError:
            raise ValueError("Incorrect password")

    @staticmethod
    def watermark_pdf(file_path: str, output_path: str, watermark_text: str, output_folder: str):
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        # 1. Create watermark PDF
        watermark_file = os.path.join(output_folder, "watermark_temp.pdf")
        c = canvas.Canvas(watermark_file, pagesize=letter)
        c.setFont("Helvetica", 40)
        c.setFillColorRGB(0.5, 0.5, 0.5, 0.5) # Grey, 50% opacity
        c.saveState()
        c.translate(300, 400)
        c.rotate(45)
        c.drawCentredString(0, 0, watermark_text)
        c.restoreState()
        c.save()

        # 2. Merge with source
        watermark_reader = PdfReader(watermark_file)
        if len(watermark_reader.pages) > 0:
            watermark_page = watermark_reader.pages[0]
            reader = PdfReader(file_path)
            writer = PdfWriter()
            for page in reader.pages:
                page.merge_page(watermark_page)
                writer.add_page(page)
            with open(output_path, "wb") as f:
                writer.write(f)
        
        if os.path.exists(watermark_file):
            os.remove(watermark_file)

    @staticmethod
    def extract_text(file_path: str) -> str:
        import fitz
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text

    @staticmethod
    def pdf_from_images(image_paths: List[str], output_path: str):
        import img2pdf
        with open(output_path, "wb") as f:
            f.write(img2pdf.convert(image_paths))

    @staticmethod
    def pdf_from_psd(file_path: str, output_path: str):
        from psd_tools import PSDImage
        import img2pdf
        from io import BytesIO
        psd = PSDImage.open(file_path)
        img = psd.composite()
        img_byte_arr = BytesIO()
        img.save(img_byte_arr, format='PNG')
        with open(output_path, "wb") as f:
            f.write(img2pdf.convert(img_byte_arr.getvalue()))

    @staticmethod
    def pdf_from_base64(b64_string: str, output_path: str):
        import base64
        if ',' in b64_string:
            b64_string = b64_string.split(',')[1]
        pdf_data = base64.b64decode(b64_string)
        with open(output_path, "wb") as f:
            f.write(pdf_data)

    @staticmethod
    def pdf_from_data(data: str, format_type: str, output_path: str):
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        c = canvas.Canvas(output_path, pagesize=letter)
        textobject = c.beginText()
        textobject.setTextOrigin(50, 750)
        textobject.setFont("Helvetica", 10)
        
        lines = data.split('\n')
        for line in lines:
            textobject.textLine(line)
        
        c.drawText(textobject)
        c.showPage()
        c.save()

    @staticmethod
    def pdf_to_data(file_path: str, format_type: str) -> str:
        import json
        import yaml
        text = PDFProcessors.extract_text(file_path)
        data = {"content": text, "filename": os.path.basename(file_path)}
        if format_type == 'json':
            return json.dumps(data, indent=4)
        elif format_type == 'yaml':
            return yaml.dump(data)
        elif format_type == 'xml':
            return f"<pdf><filename>{data['filename']}</filename><content>{data['content']}</content></pdf>"
        return text

    @staticmethod
    def pdf_to_tiff(file_path: str, output_path: str):
        import fitz
        doc = fitz.open(file_path)
        from PIL import Image
        images = []
        for page in doc:
            pix = page.get_pixmap()
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            images.append(img)
        if images:
            images[0].save(output_path, save_all=True, append_images=images[1:], compression="tiff_deflate")
        doc.close()

    @staticmethod
    def ocr_pdf(file_path: str, output_path: str, lang: str = "eng"):
        import fitz
        import pytesseract
        from PIL import Image
        
        # Check if tesseract is installed
        try:
            pytesseract.get_tesseract_version()
        except Exception:
            raise RuntimeError("Tesseract OCR binary not found. Please install Tesseract-OCR on your system and add it to PATH.")

        doc = fitz.open(file_path)
        pdf_writer = fitz.open()
        for page in doc:
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) # Higher res for OCR
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            ocr_pdf_bytes = pytesseract.image_to_pdf_or_hocr(img, extension='pdf', lang=lang)
            ocr_page_doc = fitz.open("pdf", ocr_pdf_bytes)
            pdf_writer.insert_pdf(ocr_page_doc)
        pdf_writer.save(output_path)
        pdf_writer.close()
        doc.close()

    @staticmethod
    def remove_bg(file_path: str, output_path: str):
        try:
            from rembg import remove
            import fitz
            from PIL import Image
            import img2pdf
            from io import BytesIO
            
            doc = fitz.open(file_path)
            images_data = []
            for page in doc:
                # Explicitly use RGB colorspace to ensure compatibility with PIL
                pix = page.get_pixmap(colorspace=fitz.csRGB)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                
                # Perform background removal
                output_img = remove(img)
                
                # rembg returns RGBA, we save as PNG to preserve transparency for img2pdf
                img_byte_arr = BytesIO()
                output_img.save(img_byte_arr, format='PNG')
                images_data.append(img_byte_arr.getvalue())
            
            if not images_data:
                raise ValueError("No pages found in PDF")

            # Convert images back to PDF
            pdf_bytes = img2pdf.convert(images_data)
            with open(output_path, "wb") as f:
                f.write(pdf_bytes)
            doc.close()
        except ImportError:
            raise RuntimeError("The 'rembg' library is not correctly installed. Try running: pip install rembg onnxruntime")
        except Exception as e:
            raise RuntimeError(f"Background removal failed: {str(e)}. This tool requires a local AI model download (~170MB) and may fail if the connection is unstable or onnxruntime is incompatible.")

    @staticmethod
    def pdf_to_pdfa(file_path: str, output_path: str):
        import pikepdf
        with pikepdf.open(file_path) as pdf:
            pdf.save(output_path, pdf_a=True)

    @staticmethod
    def pdf_from_pptx(file_path: str, output_path: str):
        try:
            import comtypes.client
            import pythoncom
            # Initialize COM for this thread
            pythoncom.CoInitialize()
            try:
                # Create PowerPoint instance
                powerpoint = comtypes.client.CreateObject("Powerpoint.Application")
                
                # Open presentation (FileName, ReadOnly, Untitled, WithWindow)
                # Using positional arguments for maximum compatibility with comtypes
                abs_file_path = os.path.abspath(file_path)
                abs_output_path = os.path.abspath(output_path)
                
                deck = powerpoint.Presentations.Open(abs_file_path, 1, 0, 0) # ReadOnly=1, Untitled=0, WithWindow=0
                
                # SaveAs (FileName, FileFormat=32 for PDF)
                deck.SaveAs(abs_output_path, 32)
                deck.Close()
            finally:
                # Uninitialize COM
                pythoncom.CoUninitialize()
        except Exception as e:
            raise RuntimeError(f"PPT to PDF failed: {str(e)}. Please ensure MS PowerPoint is installed.")

    @staticmethod
    def remove_pages(file_path: str, output_path: str, page_range: str):
        reader = PdfReader(file_path)
        writer = PdfWriter()
        
        # Parse range like "1, 3-5"
        pages_to_remove = set()
        for part in page_range.split(','):
            if '-' in part:
                start, end = map(int, part.split('-'))
                pages_to_remove.update(range(start-1, end))
            else:
                pages_to_remove.add(int(part)-1)
        
        for i in range(len(reader.pages)):
            if i not in pages_to_remove:
                writer.add_page(reader.pages[i])
        
        with open(output_path, "wb") as f:
            writer.write(f)

    @staticmethod
    def rotate_pdf(file_path: str, output_path: str, angle: int):
        reader = PdfReader(file_path)
        writer = PdfWriter()
        for page in reader.pages:
            page.rotate(angle)
            writer.add_page(page)
        with open(output_path, "wb") as f:
            writer.write(f)

    @staticmethod
    def crop_pdf(file_path: str, output_path: str):
        reader = PdfReader(file_path)
        writer = PdfWriter()
        for page in reader.pages:
            # Simple crop: reduce margins by 10%
            mb = page.mediabox
            page.mediabox.lower_left = (mb.left + 50, mb.bottom + 50)
            page.mediabox.upper_right = (mb.right - 50, mb.top - 50)
            writer.add_page(page)
        with open(output_path, "wb") as f:
            writer.write(f)

    @staticmethod
    def word_to_pdf(file_path: str, output_path: str):
        # Using a mock for conversion if docx2pdf is not available or fails
        # In a real environment, you'd use a cloud API or LibreOffice
        try:
            from docx2pdf import convert
            convert(file_path, output_path)
        except Exception as e:
            # Fallback/Error
            raise RuntimeError("Word to PDF requires Microsoft Word installed on the server. For cloud deployment, use a LibreOffice-based container.")

    @staticmethod
    def pdf_to_word(file_path: str, output_path: str):
        from pdf2docx import Converter
        cv = Converter(file_path)
        cv.convert(output_path)
        cv.close()

    @staticmethod
    def excel_to_pdf(file_path: str, output_path: str):
        try:
            import comtypes.client
            import pythoncom
            pythoncom.CoInitialize()
            try:
                excel = comtypes.client.CreateObject("Excel.Application")
                excel.Visible = False
                wb = excel.Workbooks.Open(os.path.abspath(file_path))
                wb.ExportAsFixedFormat(0, os.path.abspath(output_path))
                wb.Close()
            finally:
                pythoncom.CoUninitialize()
        except Exception:
            # Fallback to simple PDF generation
            import pandas as pd
            from reportlab.lib.pagesizes import letter
            from reportlab.pdfgen import canvas
            
            df = pd.read_excel(file_path)
            c = canvas.Canvas(output_path, pagesize=letter)
            width, height = letter
            y = height - 50
            
            # Simple header
            c.setFont("Helvetica-Bold", 10)
            header = " | ".join(str(col) for col in df.columns)
            c.drawString(50, y, header)
            y -= 20
            
            c.setFont("Helvetica", 8)
            for _, row in df.iterrows():
                row_str = " | ".join(str(val) for val in row.values)
                c.drawString(50, y, row_str[:120]) # Truncate long lines
                y -= 15
                if y < 50:
                    c.showPage()
                    y = height - 50
            c.save()

    @staticmethod
    def html_to_pdf(file_path: str, output_path: str):
        from xhtml2pdf import pisa
        with open(file_path, "r", encoding="utf-8") as f:
            source_html = f.read()
        with open(output_path, "wb") as f:
            pisa.CreatePDF(source_html, dest=f)

    @staticmethod
    def repair_pdf(file_path: str, output_path: str):
        import pikepdf
        with pikepdf.Pdf.open(file_path, allow_overwriting_input=True) as pdf:
            pdf.save(output_path)

    @staticmethod
    def edit_metadata(file_path: str, output_path: str, metadata: dict):
        import pikepdf
        with pikepdf.Pdf.open(file_path) as pdf:
            with pdf.open_metadata() as meta:
                if 'title' in metadata: meta['dc:title'] = metadata['title']
                if 'author' in metadata: meta['dc:creator'] = [metadata['author']]
                if 'subject' in metadata: meta['dc:description'] = {'x-default': metadata['subject']}
                if 'keywords' in metadata: meta['pdf:Keywords'] = metadata['keywords']
            pdf.save(output_path)

    @staticmethod
    def add_page_numbers(file_path: str, output_path: str, output_folder: str):
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        reader = PdfReader(file_path)
        writer = PdfWriter()
        total_pages = len(reader.pages)
        for i in range(total_pages):
            temp_page_file = os.path.join(output_folder, f"temp_page_{i}.pdf")
            c = canvas.Canvas(temp_page_file, pagesize=letter)
            c.setFont("Helvetica", 10)
            c.drawRightString(550, 30, f"Page {i+1} of {total_pages}")
            c.save()
            num_reader = PdfReader(temp_page_file)
            page = reader.pages[i]
            page.merge_page(num_reader.pages[0])
            writer.add_page(page)
            if os.path.exists(temp_page_file):
                os.remove(temp_page_file)
        with open(output_path, "wb") as f:
            writer.write(f)

    @staticmethod
    def preview_pdf(file_path: str) -> List[str]:
        import fitz  # PyMuPDF
        """
        Generate low-res previews of all pages in a PDF.
        Returns a list of base64 encoded strings.
        """
        try:
            doc = fitz.open(file_path)
            previews = []
            
            import base64
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                # Render at low resolution (matrix 0.3 for speed and small size)
                pix = page.get_pixmap(matrix=fitz.Matrix(0.3, 0.3)) 
                img_data = pix.tobytes("jpg")
                
                b64_str = base64.b64encode(img_data).decode('utf-8')
                previews.append(f"data:image/jpeg;base64,{b64_str}")
                
            doc.close()
            return previews
        except Exception as e:
            print(f"Error generating preview: {str(e)}")
            raise e

    @staticmethod
    def redact_pdf(file_path: str, output_path: str, search_text: str):
        import fitz
        doc = fitz.open(file_path)
        for page in doc:
            areas = page.search_for(search_text)
            for rect in areas:
                page.add_redact_annot(rect, fill=(0, 0, 0)) # Black fill
            page.apply_redactions()
        doc.save(output_path)
        doc.close()

    @staticmethod
    def compare_pdfs(file1: str, file2: str) -> dict:
        import fitz
        doc1 = fitz.open(file1)
        doc2 = fitz.open(file2)
        
        report = {
            "doc1_pages": len(doc1),
            "doc2_pages": len(doc2),
            "identical_page_count": 0,
            "metadata_diff": {}
        }
        
        # Simple structural comparison
        min_pages = min(len(doc1), len(doc2))
        for i in range(min_pages):
            p1 = doc1[i].get_text("words")
            p2 = doc2[i].get_text("words")
            if p1 == p2:
                report["identical_page_count"] += 1
        
        doc1.close()
        doc2.close()
        return report

    @staticmethod
    def sign_pdf(file_path: str, output_path: str, signature_text: str, output_folder: str):
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        # 1. Create signature overlay (placed at bottom right)
        sig_file = os.path.join(output_folder, "sig_temp.pdf")
        c = canvas.Canvas(sig_file, pagesize=letter)
        c.setFont("Courier-BoldOblique", 20)
        c.setFillColorRGB(0, 0, 0.5) # Dark blue
        c.drawString(400, 50, f"Signed: {signature_text}")
        c.save()

        # 2. Merge with last page
        reader = PdfReader(file_path)
        writer = PdfWriter()
        sig_reader = PdfReader(sig_file)
        sig_page = sig_reader.pages[0]

        for i in range(len(reader.pages)):
            page = reader.pages[i]
            if i == len(reader.pages) - 1:
                page.merge_page(sig_page)
            writer.add_page(page)
            
        with open(output_path, "wb") as f:
            writer.write(f)
        
        if os.path.exists(sig_file):
            os.remove(sig_file)

    @staticmethod
    def pdf_to_excel(file_path: str, output_path: str):
        import pdfplumber
        import pandas as pd
        
        all_tables = []
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    df = pd.DataFrame(table[1:], columns=table[0])
                    all_tables.append(df)
        
        if all_tables:
            with pd.ExcelWriter(output_path) as writer:
                for i, df in enumerate(all_tables):
                    df.to_excel(writer, sheet_name=f'Table_{i+1}', index=False)
        else:
            # Fallback if no tables found, just extract text to one cell
            text = PDFProcessors.extract_text(file_path)
            df = pd.DataFrame([[text]], columns=['Extracted Content'])
            df.to_excel(output_path, index=False)
