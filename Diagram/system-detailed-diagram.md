# Sơ đồ Chi tiết Hệ thống Onboarding Chatbot

```mermaid
graph TB
    %% Frontend Components
    subgraph "Frontend React Application"
        direction TB
        APP[App.jsx - Main Application]
        
        subgraph "Main Components"
            CI[ChatbotInterface.jsx]
            RG[RoadmapGenerator.jsx] 
            CG[ContentGenerator.jsx]
            DE[DocumentExtractor.jsx]
        end
        
        subgraph "UI Components"
            direction LR
            BUTTON[Button]
            CARD[Card]
            INPUT[Input]
            TABS[Tabs]
            SCROLL[ScrollArea]
            DIALOG[Dialog]
        end
        
        APP --> CI
        APP --> RG
        APP --> CG
        APP --> DE
        CI --> UI[UI Components]
        RG --> UI
        CG --> UI
        DE --> UI
    end
    
    %% API Layer
    subgraph "REST API Endpoints"
        direction TB
        
        subgraph "Chatbot APIs"
            API1[/api/chatbot - POST]
            API2[/api/chatbot/suggestions - POST]
            API3[/api/stt - POST]
            API4[/api/tts - POST]
        end
        
        subgraph "Roadmap APIs"
            API5[/api/roadmap/positions - GET]
            API6[/api/roadmap/generate - POST]
            API7[/api/roadmap/suggestions - POST]
            API8[/api/roadmap/position/:id - GET]
        end
        
        subgraph "Content APIs"
            API9[/api/content/welcome-email - POST]
            API10[/api/content/reminder-email - POST]
            API11[/api/content/summarize - POST]
            API12[/api/content/training-questions - POST]
            API13[/api/content/onboarding-checklist - POST]
        end
        
        subgraph "Document APIs"
            API14[/api/extract/upload - POST]
            API15[/api/extract/text - POST]
            API16[/api/extract/auto-fill - POST]
            API17[/api/extract/form-templates - GET/POST]
            API18[/api/extract/process-complete - POST]
        end
    end
    
    %% Backend Services Detail
    subgraph "Backend Python Services"
        direction TB
        
        SERVER[server.py - Flask Application]
        
        subgraph "Core Modules"
            CHATBOT[chatbot.py]
            ROADMAP[personalized_roadmap.py]
            CONTENT[content_generator.py]
            EXTRACT[document_extractor.py]
            TTS[tts.py]
            STT[stt.py]
            EMBED[embedding.py]
            CHUNK[chunking.py]
        end
        
        SERVER --> CHATBOT
        SERVER --> ROADMAP
        SERVER --> CONTENT
        SERVER --> EXTRACT
        SERVER --> TTS
        SERVER --> STT
    end
    
    %% External Services & Data Stores
    subgraph "External Services"
        direction LR
        OPENAI[OpenAI API<br/>- GPT-4o-mini<br/>- text-embedding-3-small]
    end
    
    subgraph "Data Storage"
        direction TB
        
        subgraph "ChromaDB Vector Database"
            CHROMA[chroma.sqlite3]
            COLLECTION[qa_collection]
            EMBEDDINGS[Document Embeddings]
        end
        
        subgraph "JSON Data Files"
            ROADMAP_DATA[roadmap_data.json]
            EMAIL_TEMPLATES[email_templates.json]
            FORM_TEMPLATES[form_templates.json]
        end
        
        subgraph "Document Storage"
            UPLOAD_FOLDER[./uploads/]
            DOC_FOLDER[./doc/]
            CHUNK_FOLDER[./chunk/]
        end
    end
    
    %% Data Flow Connections
    CI --> |HTTP Request| API1
    CI --> |HTTP Request| API2
    CI --> |HTTP Request| API3
    CI --> |HTTP Request| API4
    
    RG --> |HTTP Request| API5
    RG --> |HTTP Request| API6
    RG --> |HTTP Request| API7
    RG --> |HTTP Request| API8
    
    CG --> |HTTP Request| API9
    CG --> |HTTP Request| API10
    CG --> |HTTP Request| API11
    CG --> |HTTP Request| API12
    CG --> |HTTP Request| API13
    
    DE --> |HTTP Request| API14
    DE --> |HTTP Request| API15
    DE --> |HTTP Request| API16
    DE --> |HTTP Request| API17
    DE --> |HTTP Request| API18
    
    API1 --> CHATBOT
    API2 --> CHATBOT
    API3 --> STT
    API4 --> TTS
    
    API5 --> ROADMAP
    API6 --> ROADMAP
    API7 --> ROADMAP
    API8 --> ROADMAP
    
    API9 --> CONTENT
    API10 --> CONTENT
    API11 --> CONTENT
    API12 --> CONTENT
    API13 --> CONTENT
    
    API14 --> EXTRACT
    API15 --> EXTRACT
    API16 --> EXTRACT
    API17 --> EXTRACT
    API18 --> EXTRACT
    
    CHATBOT --> |API Calls| OPENAI
    ROADMAP --> |API Calls| OPENAI
    CONTENT --> |API Calls| OPENAI
    EXTRACT --> |API Calls| OPENAI
    
    CHATBOT --> |Vector Search| CHROMA
    EMBED --> |Store Embeddings| CHROMA
    CHUNK --> |Process Documents| CHUNK_FOLDER
    
    ROADMAP --> |Load Data| ROADMAP_DATA
    CONTENT --> |Load Templates| EMAIL_TEMPLATES
    EXTRACT --> |Load Templates| FORM_TEMPLATES
    
    EXTRACT --> |File Upload| UPLOAD_FOLDER
    EXTRACT --> |Process Documents| DOC_FOLDER
    
    %% Styling
    classDef frontendClass fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef apiClass fill:#f1f8e9,stroke:#388e3c,stroke-width:2px
    classDef backendClass fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef serviceClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef dataClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class APP,CI,RG,CG,DE,UI frontendClass
    class API1,API2,API3,API4,API5,API6,API7,API8,API9,API10,API11,API12,API13,API14,API15,API16,API17,API18 apiClass
    class SERVER,CHATBOT,ROADMAP,CONTENT,EXTRACT,TTS,STT,EMBED,CHUNK backendClass
    class OPENAI serviceClass
    class CHROMA,COLLECTION,EMBEDDINGS,ROADMAP_DATA,EMAIL_TEMPLATES,FORM_TEMPLATES,UPLOAD_FOLDER,DOC_FOLDER,CHUNK_FOLDER dataClass
```

## Chi tiết các thành phần:

### 🖥️ Frontend (React + Vite):
- **App.jsx**: Component chính, quản lý tabs và navigation
- **ChatbotInterface.jsx**: Giao diện chat với AI, STT/TTS
- **RoadmapGenerator.jsx**: Tạo và hiển thị lộ trình onboarding
- **ContentGenerator.jsx**: Tạo email, tóm tắt, câu hỏi
- **DocumentExtractor.jsx**: Upload và xử lý tài liệu
- **UI Components**: Radix UI components (Button, Card, Input, etc.)

### 🔧 Backend (Flask):
- **server.py**: Flask server chính với 18 REST endpoints
- **chatbot.py**: Logic chatbot, tích hợp OpenAI + ChromaDB
- **personalized_roadmap.py**: Quản lý lộ trình theo vị trí
- **content_generator.py**: Tạo nội dung tự động
- **document_extractor.py**: Xử lý CV, OCR, auto-fill form
- **tts.py/stt.py**: Text-to-Speech và Speech-to-Text
- **embedding.py/chunking.py**: Xử lý vector embeddings

### 🗂️ Data Layer:
- **ChromaDB**: Vector database lưu trữ embeddings
- **JSON Files**: Templates và cấu hình
- **File System**: Upload folder, documents, chunks

### 🔄 Data Flow:
1. **User Input** → Frontend Component
2. **HTTP Request** → REST API Endpoint  
3. **Process Logic** → Backend Module
4. **External Calls** → OpenAI API / Database
5. **Response** → Frontend → User Display