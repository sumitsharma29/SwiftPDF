import os
import io
import pytest
from fastapi.testclient import TestClient
from reportlab.pdfgen import canvas
from ..main import app

client = TestClient(app)

@pytest.fixture
def dummy_pdf():
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer)
    c.drawString(100, 100, "Hello World")
    c.showPage()
    c.drawString(100, 100, "Page 2")
    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer.read()

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "PDF Converter API is running"}

def test_merge_pdfs(dummy_pdf):
    files = [
        ('files', ('test1.pdf', dummy_pdf, 'application/pdf')),
        ('files', ('test2.pdf', dummy_pdf, 'application/pdf'))
    ]
    response = client.post("/api/process/merge", files=files)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"

def test_split_pdf(dummy_pdf):
    files = {'file': ('test.pdf', dummy_pdf, 'application/pdf')}
    data = {'page_range': '1-1'}
    response = client.post("/api/process/split", files=files, data=data)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"

def test_organize_pdf(dummy_pdf):
    files = {'file': ('test.pdf', dummy_pdf, 'application/pdf')}
    data = {'page_order': '1,0', 'rotation': '{}'}
    response = client.post("/api/process/organize", files=files, data=data)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"  # organize returns pdf without explicit media_type in code but FileResponse often infers? 
    # Actually my organize code didn't set media_type, so it might default or be missing. Check implementation.
    # It sets filename=.pdf, so FastAPI might infer.

def test_lock_pdf(dummy_pdf):
    files = {'file': ('test.pdf', dummy_pdf, 'application/pdf')}
    data = {'password': 'secure'}
    response = client.post("/api/process/lock", files=files, data=data)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
