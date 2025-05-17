
import requests
import sys
import json
from datetime import datetime

class OmniaAITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.token = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except json.JSONDecodeError:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"Error details: {error_detail}")
                except:
                    print(f"Response text: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test the health check endpoint"""
        return self.run_test(
            "Health Check Endpoint",
            "GET",
            "api/health",
            200
        )

    def test_base_api(self):
        """Test the base API endpoint"""
        return self.run_test(
            "Base API Endpoint",
            "GET",
            "api",
            200
        )

    def test_text_generation(self, prompt="Hello, how are you?", max_length=100):
        """Test the text generation endpoint"""
        return self.run_test(
            "Text Generation Endpoint",
            "POST",
            "api/ai/generate",
            200,
            data={"prompt": prompt, "max_length": max_length}
        )

    def test_similarity_computation(self, text1="Hello world", text2="Hi there"):
        """Test the similarity computation endpoint"""
        return self.run_test(
            "Similarity Computation Endpoint",
            "POST",
            "api/ai/similarity",
            200,
            data={"text1": text1, "text2": text2}
        )

def main():
    # Get the backend URL from the environment variable
    backend_url = "https://b132d8d3-0684-4b93-a4ae-e53b212f986d.preview.emergentagent.com"
    
    print(f"Testing Omnia AI Platform API at: {backend_url}")
    
    # Setup tester
    tester = OmniaAITester(backend_url)
    
    # Run tests
    health_success, health_data = tester.test_health_check()
    base_success, base_data = tester.test_base_api()
    
    # Test AI endpoints
    gen_success, gen_data = tester.test_text_generation(
        prompt="Explain what artificial intelligence is in simple terms.",
        max_length=150
    )
    
    if gen_success:
        print(f"Generated text: {gen_data.get('text', 'No text generated')[:50]}...")
        print(f"Model ID: {gen_data.get('model_id', 'Unknown')}")
    
    sim_success, sim_data = tester.test_similarity_computation(
        text1="Artificial intelligence is transforming our world.",
        text2="AI is changing how we live and work."
    )
    
    if sim_success:
        print(f"Similarity score: {sim_data.get('similarity', 'No score calculated')}")
        print(f"Model ID: {sim_data.get('model_id', 'Unknown')}")
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    # Return success if all tests passed
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
