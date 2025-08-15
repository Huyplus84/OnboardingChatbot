# Sơ đồ Tổng quan Hệ thống Onboarding Chatbot

```mermaid
graph TB
    %% User Layer
    U[👤 Người dùng/Nhân viên mới] --> FE[🖥️ Frontend React App]
    
    %% Frontend Layer
    FE --> |HTTP/REST API| BE[🔧 Backend Flask Server]
    
    %% Backend Core Services
    BE --> |Chat Interface| CB[🤖 Chatbot AI]
    BE --> |Roadmap Generation| RM[🗺️ Roadmap Manager]
    BE --> |Content Creation| CG[📝 Content Generator]
    BE --> |Document Processing| DE[📄 Document Extractor]
    BE --> |Voice Services| VS[🔊 Voice Services]
    
    %% External Services & Data
    CB --> |API Calls| OAI[🧠 OpenAI API]
    CB --> |Vector Search| VDB[🗂️ ChromaDB Vector Database]
    
    RM --> |Templates| RD[📊 Roadmap Data]
    CG --> |Templates| ET[📧 Email Templates]
    DE --> |Templates| FT[📋 Form Templates]
    
    VS --> TTS[🔊 Text-to-Speech]
    VS --> STT[🎤 Speech-to-Text]
    
    %% Data Storage
    VDB --> |Embeddings| EMB[🔢 Document Embeddings]
    BE --> |File Storage| FS[💾 File System]
    
    %% Main Features
    subgraph "🎯 Tính năng chính"
        CB
        RM
        CG
        DE
        VS
    end
    
    %% Tech Stack
    subgraph "🛠️ Công nghệ sử dụng"
        direction LR
        React[React + Vite]
        Flask[Flask + Python]
        AI[OpenAI GPT-4]
        Vector[ChromaDB]
    end
    
    %% Styling
    classDef userClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef frontendClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef backendClass fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef serviceClass fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef dataClass fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    
    class U userClass
    class FE frontendClass
    class BE backendClass
    class CB,RM,CG,DE,VS serviceClass
    class VDB,RD,ET,FT,FS,EMB dataClass
```

## Mô tả tổng quan:

### 🏗️ Kiến trúc hệ thống:
- **Frontend**: React SPA với Vite, sử dụng Tailwind CSS và Radix UI
- **Backend**: Flask REST API với Python
- **Database**: ChromaDB để lưu trữ vector embeddings
- **AI Engine**: OpenAI GPT-4 cho xử lý ngôn ngữ tự nhiên

### 🎯 4 chức năng chính:
1. **Chatbot AI**: Trả lời câu hỏi về chính sách, quy trình công ty
2. **Roadmap Manager**: Tạo lộ trình onboarding cá nhân hóa theo vị trí
3. **Content Generator**: Tự động tạo email, tóm tắt, câu hỏi đào tạo
4. **Document Extractor**: Trích xuất thông tin từ CV, tự động điền form

### 🔄 Luồng hoạt động:
1. Người dùng tương tác qua giao diện React
2. Frontend gửi request đến Flask API
3. Backend xử lý qua các module chuyên biệt
4. Sử dụng AI và vector database để tìm kiếm/sinh nội dung
5. Trả kết quả về frontend để hiển thị