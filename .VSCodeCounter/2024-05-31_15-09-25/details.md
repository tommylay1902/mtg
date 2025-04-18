# Details

Date : 2024-05-31 15:09:25

Directory /Users/tommylay/dev/mtg/backend/mtg

Total : 38 files,  2430 codes, 206 comments, 696 blanks, all 3332 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [backend/mtg/Makefile](/backend/mtg/Makefile) | Makefile | 42 | 8 | 10 | 60 |
| [backend/mtg/README.md](/backend/mtg/README.md) | Markdown | 40 | 0 | 23 | 63 |
| [backend/mtg/cmd/api/main.go](/backend/mtg/cmd/api/main.go) | Go | 17 | 0 | 6 | 23 |
| [backend/mtg/docker-compose.yml](/backend/mtg/docker-compose.yml) | YAML | 45 | 0 | 5 | 50 |
| [backend/mtg/go.mod](/backend/mtg/go.mod) | Go Module File | 41 | 0 | 6 | 47 |
| [backend/mtg/go.sum](/backend/mtg/go.sum) | Go Checksum File | 85 | 0 | 1 | 86 |
| [backend/mtg/internal/database/database.go](/backend/mtg/internal/database/database.go) | Go | 27 | 0 | 8 | 35 |
| [backend/mtg/internal/error/apperror/bad_request_error.go](/backend/mtg/internal/error/apperror/bad_request_error.go) | Go | 15 | 0 | 4 | 19 |
| [backend/mtg/internal/error/apperror/global_database_error.go](/backend/mtg/internal/error/apperror/global_database_error.go) | Go | 15 | 0 | 4 | 19 |
| [backend/mtg/internal/error/apperror/resource_conflict_error.go](/backend/mtg/internal/error/apperror/resource_conflict_error.go) | Go | 15 | 0 | 4 | 19 |
| [backend/mtg/internal/error/apperror/resource_not_found.go](/backend/mtg/internal/error/apperror/resource_not_found.go) | Go | 16 | 0 | 6 | 22 |
| [backend/mtg/internal/error/errorhandler/error_handler.go](/backend/mtg/internal/error/errorhandler/error_handler.go) | Go | 36 | 1 | 8 | 45 |
| [backend/mtg/internal/helper/build_search_query.go](/backend/mtg/internal/helper/build_search_query.go) | Go | 32 | 0 | 9 | 41 |
| [backend/mtg/internal/models/dto/prescription/prescription.go](/backend/mtg/internal/models/dto/prescription/prescription.go) | Go | 11 | 0 | 3 | 14 |
| [backend/mtg/internal/models/dto/prescription/prescription_mapper.go](/backend/mtg/internal/models/dto/prescription/prescription_mapper.go) | Go | 56 | 0 | 7 | 63 |
| [backend/mtg/internal/models/dto/prescriptionhistory/prescription_history.go](/backend/mtg/internal/models/dto/prescriptionhistory/prescription_history.go) | Go | 10 | 0 | 4 | 14 |
| [backend/mtg/internal/models/dto/prescriptionhistory/prescription_history_mapper.go](/backend/mtg/internal/models/dto/prescriptionhistory/prescription_history_mapper.go) | Go | 26 | 22 | 10 | 58 |
| [backend/mtg/internal/models/entity/prescription.go](/backend/mtg/internal/models/entity/prescription.go) | Go | 15 | 0 | 4 | 19 |
| [backend/mtg/internal/models/entity/prescription_history.go](/backend/mtg/internal/models/entity/prescription_history.go) | Go | 11 | 0 | 4 | 15 |
| [backend/mtg/internal/server/dao/prescription/dao_test.go](/backend/mtg/internal/server/dao/prescription/dao_test.go) | Go | 348 | 46 | 80 | 474 |
| [backend/mtg/internal/server/dao/prescription/gorm_prescription_dao.go](/backend/mtg/internal/server/dao/prescription/gorm_prescription_dao.go) | Go | 59 | 0 | 20 | 79 |
| [backend/mtg/internal/server/dao/prescription/prescription_dao.go](/backend/mtg/internal/server/dao/prescription/prescription_dao.go) | Go | 12 | 0 | 4 | 16 |
| [backend/mtg/internal/server/dao/prescription_history/dao_test.go](/backend/mtg/internal/server/dao/prescription_history/dao_test.go) | Go | 261 | 6 | 103 | 370 |
| [backend/mtg/internal/server/dao/prescription_history/gorm_prescription_history_dao.go](/backend/mtg/internal/server/dao/prescription_history/gorm_prescription_history_dao.go) | Go | 62 | 0 | 22 | 84 |
| [backend/mtg/internal/server/dao/prescription_history/prescription_history.go](/backend/mtg/internal/server/dao/prescription_history/prescription_history.go) | Go | 12 | 0 | 4 | 16 |
| [backend/mtg/internal/server/handler/handler_init.go](/backend/mtg/internal/server/handler/handler_init.go) | Go | 14 | 0 | 5 | 19 |
| [backend/mtg/internal/server/handler/prescription_handler.go](/backend/mtg/internal/server/handler/prescription_handler.go) | Go | 102 | 0 | 25 | 127 |
| [backend/mtg/internal/server/handler/prescription_history_handler.go](/backend/mtg/internal/server/handler/prescription_history_handler.go) | Go | 84 | 0 | 34 | 118 |
| [backend/mtg/internal/server/routes.go](/backend/mtg/internal/server/routes.go) | Go | 15 | 0 | 4 | 19 |
| [backend/mtg/internal/server/server.go](/backend/mtg/internal/server/server.go) | Go | 30 | 1 | 8 | 39 |
| [backend/mtg/internal/server/service/prescription/fiber_prescription_service.go](/backend/mtg/internal/server/service/prescription/fiber_prescription_service.go) | Go | 91 | 0 | 23 | 114 |
| [backend/mtg/internal/server/service/prescription/prescription_service.go](/backend/mtg/internal/server/service/prescription/prescription_service.go) | Go | 13 | 0 | 4 | 17 |
| [backend/mtg/internal/server/service/prescription/service_test.go](/backend/mtg/internal/server/service/prescription/service_test.go) | Go | 188 | 36 | 53 | 277 |
| [backend/mtg/internal/server/service/prescriptionhistory/fiber_prescription_history_service.go](/backend/mtg/internal/server/service/prescriptionhistory/fiber_prescription_history_service.go) | Go | 66 | 1 | 26 | 93 |
| [backend/mtg/internal/server/service/prescriptionhistory/prescription_history_service.go](/backend/mtg/internal/server/service/prescriptionhistory/prescription_history_service.go) | Go | 13 | 0 | 4 | 17 |
| [backend/mtg/internal/server/service/prescriptionhistory/service_test.go](/backend/mtg/internal/server/service/prescriptionhistory/service_test.go) | Go | 162 | 10 | 66 | 238 |
| [backend/mtg/tests/handler_test.go](/backend/mtg/tests/handler_test.go) | Go | 1 | 29 | 3 | 33 |
| [backend/mtg/tests/prescription/dao_test.go](/backend/mtg/tests/prescription/dao_test.go) | Go | 342 | 46 | 82 | 470 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)