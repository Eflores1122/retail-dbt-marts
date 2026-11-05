export DBT_PROFILES_DIR := $(CURDIR)

DBT := $(if $(wildcard .venv/bin/dbt),.venv/bin/dbt,dbt)
PY := $(if $(wildcard .venv/bin/python),.venv/bin/python,python3)
RUFF := $(if $(wildcard .venv/bin/ruff),.venv/bin/ruff,ruff)

.PHONY: install deps seed run test docs generate check-seeds lint clean kpis

install:
	python3 -m venv .venv
	.venv/bin/python -m pip install --upgrade pip
	.venv/bin/python -m pip install -r requirements-dev.txt

deps:
	$(DBT) deps

seed:
	$(DBT) seed --full-refresh

run:
	$(DBT) run

test: check-seeds
	$(DBT) deps
	$(DBT) build
	$(PY) scripts/check_readme.py

docs:
	$(DBT) docs generate

generate:
	$(PY) scripts/generate_seeds.py

check-seeds:
	$(PY) scripts/generate_seeds.py --check

kpis:
	$(PY) scripts/print_kpis.py

lint:
	$(RUFF) check scripts
	$(RUFF) format --check scripts

clean:
	$(DBT) clean
	rm -rf target logs
