import fitz  # PyMuPDF
import sys

def test_pdf_to_image():
    try:
        print(f"PyMuPDF version: {fitz.__version__}")
        # Create dummy PDF in memory
        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((50, 50), "Hello World")
        
        # Render page to pixmap (image)
        pix = page.get_pixmap()
        print(f"Rendered image: {pix.width}x{pix.height}")
        
    except ImportError:
        print("PyMuPDF not installed.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_pdf_to_image()
