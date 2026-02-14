import requests
import os
import fitz  # PyMuPDF
from PIL import Image

BASE_URL = "http://localhost:8000/api/process"

def create_dummy_pdf(filename="test.pdf", pages=3):
    doc = fitz.open()
    for i in range(pages):
        page = doc.new_page()
        page.insert_text((50, 50), f"Page {i+1}")
    doc.save(filename)
    doc.close()
    return filename

def create_dummy_image(filename="test.jpg"):
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save(filename)
    return filename

def test_merge():
    print("Testing Merge...", end=" ")
    f1 = create_dummy_pdf("t1.pdf")
    f2 = create_dummy_pdf("t2.pdf")
    files = [
        ('files', open(f1, 'rb')),
        ('files', open(f2, 'rb'))
    ]
    res = requests.post(f"{BASE_URL}/merge", files=files)
    if res.status_code == 200: print("OK")
    else: print(f"FAIL: {res.status_code} - {res.text}")
    files[0][1].close()
    files[1][1].close()

def test_split():
    print("Testing Split...", end=" ")
    f = create_dummy_pdf("split_src.pdf", 5)
    files = {'file': open(f, 'rb')}
    data = {'page_range': '1-2'}
    res = requests.post(f"{BASE_URL}/split", files=files, data=data)
    if res.status_code == 200: print("OK")
    else: print(f"FAIL: {res.status_code} - {res.text}")
    files['file'].close()

def test_organize():
    print("Testing Organize...", end=" ")
    f = create_dummy_pdf("org_src.pdf", 3)
    files = {'file': open(f, 'rb')}
    data = {'page_order': '2,0,1', 'rotation': '{"0": 90}'}
    res = requests.post(f"{BASE_URL}/organize", files=files, data=data)
    if res.status_code == 200: print("OK")
    else: print(f"FAIL: {res.status_code} - {res.text}")
    files['file'].close()

def test_compress():
    print("Testing Compress...", end=" ")
    f = create_dummy_pdf("comp_src.pdf", 1)
    files = {'file': open(f, 'rb')}
    data = {'level': 'medium'}
    res = requests.post(f"{BASE_URL}/compress", files=files, data=data)
    if res.status_code == 200: print("OK")
    else: print(f"FAIL: {res.status_code} - {res.text}")
    files['file'].close()

def test_pdf_to_jpg():
    print("Testing PDF to JPG...", end=" ")
    f = create_dummy_pdf("p2j_src.pdf", 2)
    files = {'file': open(f, 'rb')}
    res = requests.post(f"{BASE_URL}/pdf-to-jpg", files=files)
    if res.status_code == 200 and res.headers['content-type'] == 'application/zip': print("OK (ZIP)")
    else: print(f"FAIL: {res.status_code} - Type: {res.headers.get('content-type')}")
    files['file'].close()

    print("Testing PDF to JPG (Single)...", end=" ")
    f_single = create_dummy_pdf("p2j_single.pdf", 1)
    files = {'file': open(f_single, 'rb')}
    res = requests.post(f"{BASE_URL}/pdf-to-jpg", files=files)
    if res.status_code == 200 and res.headers['content-type'] == 'image/jpeg': print("OK (JPG)")
    else: print(f"FAIL: {res.status_code} - Type: {res.headers.get('content-type')}")
    files['file'].close()

def test_jpg_to_pdf():
    print("Testing JPG to PDF...", end=" ")
    f = create_dummy_image("j2p.jpg")
    files = [('files', open(f, 'rb'))]
    res = requests.post(f"{BASE_URL}/jpg-to-pdf", files=files)
    if res.status_code == 200: print("OK")
    else: print(f"FAIL: {res.status_code} - {res.text}")
    files[0][1].close()

def test_lock_unlock():
    print("Testing Lock...", end=" ")
    f = create_dummy_pdf("lock.pdf")
    files = {'file': open(f, 'rb')}
    data = {'password': '123'}
    res = requests.post(f"{BASE_URL}/lock", files=files, data=data)
    if res.status_code == 200: 
        print("OK")
        with open("locked_out.pdf", "wb") as f_out:
            f_out.write(res.content)
    else: 
        print(f"FAIL: {res.status_code}")
        return
    files['file'].close()

    print("Testing Unlock...", end=" ")
    files = {'file': open("locked_out.pdf", 'rb')}
    data = {'password': '123'}
    res = requests.post(f"{BASE_URL}/unlock", files=files, data=data)
    if res.status_code == 200: print("OK")
    else: print(f"FAIL: {res.status_code}")
    files['file'].close()

def test_watermark():
    print("Testing Watermark...", end=" ")
    f = create_dummy_pdf("water.pdf")
    files = {'file': open(f, 'rb')}
    data = {'text': 'CONFIDENTIAL'}
    res = requests.post(f"{BASE_URL}/watermark", files=files, data=data)
    if res.status_code == 200: print("OK")
    else: print(f"FAIL: {res.status_code}")
    files['file'].close()

def cleanup():
    for f in os.listdir('.'):
        if f.endswith('.pdf') or f.endswith('.jpg'):
            try: os.remove(f)
            except: pass

if __name__ == "__main__":
    try:
        test_merge()
        test_split()
        test_organize()
        test_compress()
        test_pdf_to_jpg()
        test_jpg_to_pdf()
        test_lock_unlock()
        test_watermark()
    except Exception as e:
        print(f"\nCRITICAL ERROR: {e}")
        print("Make sure backend is running on port 8000")
    finally:
        pass # cleanup()
