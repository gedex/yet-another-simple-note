.PHONY: server

all: frontend server

npm:
	cd public && npm install

grunt:
	cd public && grunt

frontend: npm grunt

server:
	cd server && go build -o ../bin/server

run: server
	./bin/server

clean:
	rm -rf ./bin/server
	rm -rf ./public/dist
