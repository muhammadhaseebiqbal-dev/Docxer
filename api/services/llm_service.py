import google.generativeai as genai
from utils.config import settings
import asyncio
from typing import Optional

class LLMService:
    def __init__(self):
        genai.configure(api_key=settings.google_api_key)
        self.model = genai.GenerativeModel("gemini-2.0-flash-exp")
    
    async def generate_documentation(self, code_content: str, filename: str) -> str:
        """Generate documentation using Gemini AI"""
        
        # Create a comprehensive prompt for better formatting
        prompt = f"""
You are an expert technical writer creating professional documentation. Generate comprehensive documentation for this code file: {filename}

IMPORTANT FORMATTING RULES:
- Use ## for main section headings (not **)
- Use ### for subsections  
- Use - for bullet points (not *)
- For code blocks, use ```language at the start and ``` at the end
- Keep paragraphs concise and professional
- Use proper markdown formatting

Structure your response with these sections:

## Overview
Brief description of what this code does and its purpose.

## Key Features
- List the main features/capabilities
- Use bullet points for clarity

## Code Structure

### Functions
For each function, provide:
- **Function Name**: Brief description
- **Parameters**: List with types and descriptions
- **Returns**: What it returns
- **Example**: Simple usage example

### Classes  
For each class, provide:
- **Class Name**: Purpose and responsibility
- **Methods**: Key methods with descriptions
- **Usage**: How to instantiate and use

## Implementation Details
Explain the algorithms, design patterns, or notable implementation choices.

## Code Examples

```python
# Include practical usage examples here
# Show how to use the main functions/classes
```

## Dependencies
List any external libraries or requirements.

## Notes
Any important considerations, limitations, or performance notes.

Code to analyze:
```
{code_content}
```

Make the documentation professional, clear, and well-structured. Focus on practical usage and clear explanations.
"""

        try:
            # Run the LLM call in a thread to avoid blocking
            response = await asyncio.get_event_loop().run_in_executor(
                None, 
                lambda: self.model.generate_content(prompt)
            )
            
            if not response.text:
                raise Exception("Empty response from LLM")
                
            return response.text
            
        except Exception as e:
            raise Exception(f"LLM generation failed: {str(e)}")
    
    def _create_system_prompt(self) -> str:
        """Create system prompt for consistent documentation"""
        return """
        You are a technical documentation expert. Your task is to analyze code and create clear, 
        comprehensive documentation. Always structure your response with proper markdown formatting.
        """
