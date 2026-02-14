import requests
import io

BASE_URL = "http://localhost:8000"

def test_root():
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Root endpoint: {response.status_code}")
        print(response.json())
    except Exception as e:
        print(f"Root endpoint failed: {e}")

def create_dummy_pdf():
    return b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources << >>\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<< /Length 21 >>\nstream\nBT\n/F1 24 Tf\n100 100 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000157 00000 n\n0000000302 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n373\n%%EOF"

def test_merge():
    try:
        pdf_content = create_dummy_pdf()
        files = [
            ('files', ('test1.pdf', pdf_content, 'application/pdf')),
            ('files', ('test2.pdf', pdf_content, 'application/pdf'))
        ]
        response = requests.post(f"{BASE_URL}/api/process/merge", files=files)
        print(f"Merge endpoint: {response.status_code}")
        if response.status_code != 200:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Merge endpoint failed: {e}")

if __name__ == "__main__":
    test_root()
    test_merge()
