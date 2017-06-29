.DEFAULT_GOAL := help

############## Vars that shouldn't be edited ##############
NODE_MODULES     ?= "./node_modules"
NODE_MODULES_BIN ?= "${NODE_MODULES}/.bin"

FROM_VERSION     ?= $(shell yarn run -s version)

############## HELP ##############

#COLORS
RED    := $(shell tput -Txterm setaf 1)
GREEN  := $(shell tput -Txterm setaf 2)
WHITE  := $(shell tput -Txterm setaf 7)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

# Add the following 'help' target to your Makefile
# And add help text after each target name starting with '\#\#'
# A category can be added with @category
HELP_HELPER = \
    %help; \
    while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^([a-zA-Z\-\%]+)\s*:.*\#\#(?:@([a-zA-Z\-\%]+))?\s(.*)$$/ }; \
    print "usage: make [target]\n\n"; \
    for (sort keys %help) { \
    print "${WHITE}$$_:${RESET}\n"; \
    for (@{$$help{$$_}}) { \
    $$sep = " " x (32 - length $$_->[0]); \
    print "  ${YELLOW}$$_->[0]${RESET}$$sep${GREEN}$$_->[1]${RESET}\n"; \
    }; \
    print "\n"; }

help: ##prints help
	@perl -e '$(HELP_HELPER)' $(MAKEFILE_LIST)

############## RELEASE ##############
changelog: ##@release create changelog
	@echo "${YELLOW}generating changelog from v${FROM} to v${RELEASE_VERSION}${RESET}"
    ifeq ($(FROM), false)
		@yarn run changelog -- -t false
    else
		@yarn run changelog -- -t "v${FROM}"
    endif

update-package-version: ##@release updates version in package.json
	@echo "${YELLOW}updating package.json version to ${RELEASE_VERSION}${RESET}"
	@npm version --no-git-tag-version "${RELEASE_VERSION}"

release: ##@release generates a new release
	@echo "${YELLOW}building release ${RELEASE_VERSION} from ${FROM_VERSION}${RESET}"
	@-git stash
	@make update-package-version
	@make changelog FROM=${FROM_VERSION}
	@git add package.json CHANGELOG.md
	@git commit -m "chore(v${RELEASE_VERSION}): bump version to ${RELEASE_VERSION}"
	@git tag -a "v${RELEASE_VERSION}" -m "version ${RELEASE_VERSION}"
	@git push origin v${RELEASE_VERSION}
