Simple Note
===========

Yet another Martini-powered RESTful API with Backbone-powered client consuming
the API.

## Requirements

* Go
* Node.JS
* Grunt

## Run Locally

1. Clone this repo
   ```
   git clone git@github.com:gedex/simple-note.git
   ```

2. Build everything
   ```
   make && make run
   ```

## REST API

All API access is prefixed with `/api/v1`. By default, server is using port `8000`.
The full url of a single resource would be `http://localhost:8000/api/v1/resource`,
for example notes resource is located at `http://localhost:8000/api/v1/notes`.

### Notes

#### List notes

```
GET /notes
```

#### Get a single note

```
GET /notes/:id
```

#### List notes tagged particular tag specified by tag id

```
GET /notes/tag/:id
```

#### Create a note

```
POST /notes
```

#### Edit a note

```
PUT /notes/:id
```

#### Delete a note

```
DELETE /notes:id
```

### Tags

#### List tags

```
GET /tags
```
