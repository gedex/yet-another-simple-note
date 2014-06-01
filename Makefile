ROOTPKG := github.com/gedex/simple-note
VERSION := 0.1

all: embed build

build:
	go build -o bin/server $(ROOTPKG)/server

embed: rice
	cd server && rice embed

deps:
	go get -u -t -v ./...

vendor: godep
	godep save ./...

godep:
	go get github.com/tools/godep

rice:
	go install github.com/GeertJohan/go.rice/rice
