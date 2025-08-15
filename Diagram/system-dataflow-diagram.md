# Luồng Dữ liệu Hệ thống Onboarding Chatbot

## 1. Luồng Chatbot AI (Chat Flow)

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant CI as 🖥️ ChatbotInterface.jsx
    participant BE as 🔧 Backend API
    participant CB as 🤖 chatbot.py
    participant VDB as 🗂️ ChromaDB
    participant AI as 🧠 OpenAI API
    participant TTS as 🔊 TTS Service
    participant STT as 🎤 STT Service

    Note over U,STT: 1. Chat Message Flow
    U->>+CI: Type message / Click suggestion
    CI->>CI: Update messages state
    CI->>+BE: POST /api/chatbot {question}
    BE->>+CB: get_answer(query)
    
    alt Special Commands (help, roadmap, email, cv)
        CB->>CB: Check command keywords
        CB-->>BE: Return template response
    else Normal Question
        CB->>+VDB: Query embeddings (top_k=5)
        VDB-->>-CB: Similar documents + metadata
        CB->>+AI: Generate answer with context
        AI-->>-CB: GPT-4o response
    end
    
    CB-->>-BE: Final answer
    BE-->>-CI: JSON {response}
    CI->>CI: Add bot message to state
    CI->>U: Display response

    Note over U,STT: 2. Suggestion Flow
    CI->>+BE: POST /api/chatbot/suggestions {history}
    BE->>+CB: get_smart_suggestions(history)
    
    alt Empty History
        CB-->>BE: ["help"]
    else Has History
        CB->>+VDB: RAG search on history
        VDB-->>-CB: Relevant questions
        CB->>CB: Random sample (2 questions)
        CB-->>BE: Question suggestions
    end
    
    BE-->>-CI: JSON {suggestions}
    CI->>CI: Merge with frontend suggestions
    CI->>U: Display suggestion badges

    Note over U,STT: 3. Text-to-Speech Flow
    U->>CI: Click TTS button
    CI->>+BE: POST /api/tts {text}
    BE->>+TTS: generate_tts_audio(text)
    TTS-->>-BE: Audio buffer (WAV)
    BE-->>-CI: Audio blob response
    CI->>CI: Create Audio object & play
    CI->>U: Audio playback

    Note over U,STT: 4. Speech-to-Text Flow
    U->>CI: Click microphone button
    CI->>CI: Start MediaRecorder
    U->>CI: Stop recording
    CI->>CI: Create audio blob
    CI->>+BE: POST /api/stt (FormData)
    BE->>+STT: transcribe(audio_file)
    STT-->>-BE: Transcribed text
    BE-->>-CI: JSON {text}
    CI->>CI: Set inputValue
    CI->>U: Text appears in input
```

## 2. Luồng Roadmap Generator

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant RG as 🗺️ RoadmapGenerator.jsx
    participant BE as 🔧 Backend API
    participant RM as 📊 roadmap_manager.py
    participant RD as 📄 roadmap_data.json
    participant AI as 🧠 OpenAI API

    Note over U,AI: 1. Load Available Positions
    RG->>+BE: GET /api/roadmap/positions
    BE->>+RM: get_available_positions()
    RM->>+RD: Load positions from JSON
    RD-->>-RM: Available positions array
    RM-->>-BE: Positions list
    BE-->>-RG: JSON {positions}
    RG->>U: Display position dropdown

    Note over U,AI: 2. Generate Personalized Roadmap
    U->>RG: Select position + experience level
    RG->>+BE: POST /api/roadmap/generate {position, experience_level, interests}
    BE->>+RM: generate_personalized_roadmap(params)
    RM->>+RD: Load roadmap template for position
    RD-->>-RM: Base roadmap structure
    RM->>+AI: Customize roadmap with GPT-4o
    AI-->>-RM: Personalized roadmap content
    RM-->>-BE: Complete roadmap
    BE-->>-RG: JSON {roadmap, position, experience_level}
    RG->>RG: Display roadmap with phases
    RG->>U: Interactive roadmap view

    Note over U,AI: 3. Get Learning Suggestions
    U->>RG: Mark items as completed
    RG->>+BE: POST /api/roadmap/suggestions {position, completed_items}
    BE->>+RM: get_learning_suggestions(position, completed)
    RM->>RM: Analyze completion progress
    RM->>+AI: Generate next learning steps
    AI-->>-RM: Suggested next actions
    RM-->>-BE: Learning suggestions
    BE-->>-RG: JSON {suggestions}
    RG->>U: Display next steps
```

## 3. Luồng Content Generator

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant CG as 📝 ContentGenerator.jsx
    participant BE as 🔧 Backend API
    participant CT as ✉️ content_generator.py
    participant ET as 📧 email_templates.json
    participant AI as 🧠 OpenAI API

    Note over U,AI: 1. Welcome Email Generation
    U->>CG: Fill employee info form
    CG->>+BE: POST /api/content/welcome-email {employee_info}
    BE->>+CT: generate_welcome_email(employee_info)
    CT->>+ET: Load email template
    ET-->>-CT: Template structure
    CT->>+AI: Personalize with employee data
    AI-->>-CT: Personalized email content
    CT-->>-BE: Complete email
    BE-->>-CG: JSON {email, generated_at}
    CG->>U: Display email preview

    Note over U,AI: 2. Document Summarization
    U->>CG: Paste document text + select type
    CG->>+BE: POST /api/content/summarize {document_text, summary_type}
    BE->>+CT: summarize_document(text, type)
    CT->>+AI: Generate summary with specific style
    AI-->>-CT: Summary content
    CT-->>-BE: Summary result
    BE-->>-CG: JSON {summary, summary_type, original_length}
    CG->>U: Display summary

    Note over U,AI: 3. Training Questions Generation
    U->>CG: Input content + question settings
    CG->>+BE: POST /api/content/training-questions {content, question_type, num_questions}
    BE->>+CT: generate_training_questions(params)
    CT->>+AI: Create questions from content
    AI-->>-CT: Generated questions array
    CT-->>-BE: Questions with answers
    BE-->>-CG: JSON {questions, question_type, num_questions}
    CG->>U: Display interactive quiz

    Note over U,AI: 4. Onboarding Checklist
    U->>CG: Select position + department
    CG->>+BE: POST /api/content/onboarding-checklist {position, department}
    BE->>+CT: generate_onboarding_checklist(position, dept)
    CT->>+AI: Create checklist for role
    AI-->>-CT: Customized checklist
    CT-->>-BE: Checklist items
    BE-->>-CG: JSON {checklist, position, department}
    CG->>U: Display checklist with progress tracking
```

## 4. Luồng Document Extractor

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant DE as 📄 DocumentExtractor.jsx
    participant BE as 🔧 Backend API
    participant DX as 🔍 document_extractor.py
    participant FS as 💾 File System
    participant FT as 📋 form_templates.json
    participant AI as 🧠 OpenAI API

    Note over U,AI: 1. Document Upload & Processing
    U->>DE: Upload file (CV/ID/Diploma)
    DE->>+BE: POST /api/extract/upload (FormData + document_type)
    BE->>+FS: Save file to ./uploads/
    FS-->>-BE: File path
    BE->>+DX: process_document_file(file_path, type)
    
    alt PDF/DOCX File
        DX->>DX: Extract text with OCR/parser
    else Image File  
        DX->>DX: OCR processing
    end
    
    DX->>+AI: Extract structured data
    AI-->>-DX: JSON structured information
    DX-->>-BE: Extraction result
    BE->>+FS: Delete temporary file
    BE-->>-DE: JSON {result, processed_at}
    DE->>U: Display extracted information

    Note over U,AI: 2. Auto-fill Form Process
    U->>DE: Select form template
    DE->>+BE: POST /api/extract/auto-fill {extracted_data, form_template}
    BE->>+DX: auto_fill_form(data, template)
    DX->>+FT: Load form template structure
    FT-->>-DX: Template fields mapping
    DX->>DX: Map extracted data to form fields
    DX->>+AI: Fill missing fields intelligently
    AI-->>-DX: Complete form data
    DX-->>-BE: Filled form
    BE-->>-DE: JSON {filled_form, form_template}
    DE->>U: Display pre-filled form

    Note over U,AI: 3. Complete Process (Upload → Extract → Auto-fill)
    U->>DE: Upload file with form selection
    DE->>+BE: POST /api/extract/process-complete (FormData)
    BE->>+FS: Save uploaded file
    BE->>+DX: process_document_file()
    DX->>+AI: Extract data
    AI-->>-DX: Structured data
    DX->>+DX: auto_fill_form()
    DX->>+AI: Complete form
    AI-->>-DX: Final form
    DX-->>-BE: Complete result
    BE->>+FS: Cleanup temp files
    BE-->>-DE: JSON {document_processing, auto_filled_form}
    DE->>U: Display complete workflow result

    Note over U,AI: 4. Form Template Management
    DE->>+BE: GET /api/extract/form-templates
    BE->>+DX: get_form_templates()
    DX->>+FT: Load all templates
    FT-->>-DX: Templates list
    DX-->>-BE: Available templates
    BE-->>-DE: JSON {templates}
    DE->>U: Display template options
```

## 5. Các thành phần dữ liệu chính

```mermaid
graph TB
    subgraph "Frontend State Management"
        MS[Messages State]
        AS[Audio State] 
        RS[Recording State]
        SQ[Suggested Questions]
        LS[Loading States]
    end
    
    subgraph "Backend Data Processing"
        QE[Query Embeddings]
        CR[Context Retrieval]
        AG[Answer Generation]
        FP[File Processing]
        TD[Template Data]
    end
    
    subgraph "External API Calls"
        EC[Embedding Creation]
        CG[Content Generation]
        TG[Text Generation]
        AP[Audio Processing]
    end
    
    subgraph "Data Storage"
        VE[Vector Embeddings]
        JT[JSON Templates]
        UF[Uploaded Files]
        TC[Temporary Cache]
    end
    
    MS --> QE
    QE --> VE
    VE --> CR
    CR --> AG
    AG --> CG
    
    AS --> AP
    RS --> FP
    FP --> UF
    
    SQ --> EC
    TD --> JT
    
    style MS fill:#e3f2fd
    style VE fill:#f3e5f5
    style CG fill:#fff3e0
    style UF fill:#e8f5e8
```

## Đặc điểm luồng dữ liệu:

### 🔄 **Xử lý Realtime:**
- STT/TTS: Xử lý audio theo thời gian thực
- Suggestions: Cập nhật động theo lịch sử chat
- State Management: React hooks quản lý trạng thái UI

### 🧠 **AI Integration:**
- Vector Search: ChromaDB cho tìm kiếm ngữ nghĩa
- GPT-4o: Sinh nội dung thông minh
- RAG: Retrieval-Augmented Generation cho chatbot

### 📁 **File Processing:**
- Multipart Upload: Xử lý file đa định dạng
- Temporary Storage: Cleanup tự động sau xử lý
- OCR Integration: Trích xuất text từ images

### 🔐 **Error Handling:**
- Try-catch wrapping ở mọi API calls
- Fallback responses cho AI failures  
- User feedback cho các lỗi network