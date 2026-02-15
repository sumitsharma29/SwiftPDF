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
        # TODO: Get actual page size from input PDF for better placement
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
        # Check if watermark PDF has pages
        if len(watermark_reader.pages) > 0:
            watermark_page = watermark_reader.pages[0]
            
            reader = PdfReader(file_path)
            writer = PdfWriter()

            for page in reader.pages:
                page.merge_page(watermark_page)
                writer.add_page(page)

            with open(output_path, "wb") as f:
                writer.write(f)
        
        # Cleanup
        if os.path.exists(watermark_file):
            os.remove(watermark_file)

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
