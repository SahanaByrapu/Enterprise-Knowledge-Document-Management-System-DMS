#### Enterprise Knowledge - Document Management System (DMS)


Full-Stack Architecture Diagram


                        ┌──────────────────────────────┐
                        │         Frontend Layer        │
                        │  React dashboards / RAG UI    │
                        └─────────────┬────────────────┘
                                      │
          ┌─────────────┬─────────────┴─────────────┬─────────────┐
          │             │                           │             │
|--------------------|-----------------------|----------------------|----------------|
|Document Upload UI |   Knowledge Search UI  |    Analytics Dashboard | Admin Console|
|-------------------|-------------------------|-------------------|----------------------|
|- Upload / Index   |  - Semantic search     |   - Access trends |      - Roles & permissions|
| - Indexing status |   - RAG chat       |        - Top queries   |      - Audit logs|

                                      │
                                      ▼
                             ┌───────────────┐
                             │ API Gateway    │
                             │ Auth / RBAC    │
                             │ Rate-limiting │
                             └──────┬────────┘
                                    │
                                    ▼
                          ┌──────────────────────┐
                          │ Backend Services     │
                          │ - Document Store     │
                          │ - RAG AI Backend     │
                          │ - Workflow Engine    │
                          └──────────┬───────────┘
                                     │
                   ┌─────────────────┴─────────────────┐
                   │                                   │
          ┌────────▼────────┐                 ┌────────▼────────┐
          │ ML Serving Layer │                 │ Data Layer      │
          │ - NLP Classification│               │ - Elasticsearch│
          │ - Summarization    │               │ - Vector DB    │
          │ - Semantic Search  │               │ - S3 Storage   │
          └────────┬─────────┘                 └────────┬────────┘
                   │                                   │
                   ▼                                   ▼
           ┌─────────────┐                     ┌─────────────┐
           │ ML Pipelines │                     │ Monitoring &│
           │ ETL → Train  │                     │ Observability│
           │ → Deploy     │                     │ Prometheus /│
           │ NLP & RAG    │                     │ Grafana /   │
           └─────────────┘                     │ Logging     │
                                               └─────────────┘
