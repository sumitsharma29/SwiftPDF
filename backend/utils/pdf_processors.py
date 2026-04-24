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
        # page_range format: "1-5" (1-based)
        reader = PdfReader(file_path)
        writer = PdfWriter()
        
        try:
            if '-' in page_range:
                start, end = map(int, page_range.split('-'))
                # Convert to 0-based index
                start_idx = start - 1
                end_idx = end
                
                # Bounds check
                if start_idx < 0: start_idx = 0
                if end_idx > len(reader.pages): end_idx = len(reader.pages)

                for i in range(start_idx, end_idx):
                    writer.add_page(reader.pages[i])
            else:
                 # Handle single page input "5"
                 page_num = int(page_range) - 1
                 if 0 <= page_num < len(reader.pages):
                     writer.add_page(reader.pages[page_num])
            
            with open(output_path, "wb") as f:
                writer.write(f)
        except ValueError:
            raise ValueError("Invalid page range format. Use 'start-end' or 'page_num'.")

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
            text += page.get_text() + "\n--- Page Break ---\n"
        doc.close()
        return text

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
