include .env
export

# Variable con lista ordenada de migraciones
MIGRATIONS := $(shell find ./apps/backend/src/db/migrations -type f -name '*.sql' | sort)

## help: shows this message.
.PHONY: help
help: 
	@echo 'Usage'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /'


## confirm: asks the user for confirmation.
.PHONY: confirm
confirm: 
	@echo -n 'Are you sure? [y/N] ' && read ans && [ $${ans:-N} = y ]


## db/db_path: Asegura
db/confirm_db_path:
	@if [ -z "$(DB_DIR)" ]; then \
		echo "La variable DB_PATH no está definida en .env"; \
		exit 1; \
	fi


## db/create: Creates and initializes the database.
db/create: db/confirm_db_path
	@for file in $(MIGRATIONS); do \
		echo "Ejecutando migración: $$file"; \
		sqlite3 $(DB_DIR) < "$$file"; \
		if [ $$? -ne 0 ]; then \
			echo "Error al ejecutar $$file"; \
			exit 1; \
		fi \
	done
	@echo "✅ Migraciones completadas con éxito."


## dev/setup: Setup production environment.
dev/setup: db/confirm_db_path
	@echo Creating the database...
	@$(MAKE) db/create
	@./scripts/developmentSetupData.ts


## prod/deploy: Deploys the app to production. Requires server's ssh key.
prod/deploy: confirm
	@echo Deploying...
	@sudo apt -y update && echo System updated


## run/api: Runs the api
run/api:
	@echo Starting api...
	bun --watch apps/backend/src/index.ts


## run/api: Runs the api
run/frontend:
	@echo Starting api...
	@cd ./apps/frontend
	@bun run dev
	@cd -
