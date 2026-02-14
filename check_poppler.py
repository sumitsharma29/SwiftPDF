from pdf2image import convert_from_path
import sys

try:
    print("Testing pdf2image...")
    # This will fail if poppler is not in PATH
    import pdf2image
    print(f"pdf2image version: {pdf2image.__version__}")
    
    # Try to find poppler
    from pdf2image.exceptions import PDFInfoNotInstalledError
    try:
        pdf2image.pdfinfo_from_path("dummy.pdf")
    except PDFInfoNotInstalledError:
        print("Poppler is NOT installed or not in PATH.")
    except Exception as e:
        print(f"Other error checking poppler: {e}")

except ImportError:
    print("pdf2image library not found.")
except Exception as e:
    print(f"Error: {e}")
