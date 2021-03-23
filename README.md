# Patch files

A simple action to patch JSON/XML files.

> Only JSON and XML files are supported at the moment. Support for other file types is planned in the later versions.

## Inputs

- `files`
   
   Glob expression. See example action YAML below. *Required.*

- `filesType`
  
  The type of files to be expected matching `files`.
  
  Currently the action expects all files to be of the same type (XML or JSON).
  
  If you want to mix and match, you'll need to run it twice; once for JSON and once for XML.

  Supported values:
  - `xml`
  - `json`

  Anything unknown will default to `json`.

- `patch-syntax` 
    
    Use the `operation syntax => value` syntax to patch the JSON file. *Required.* 

    Supported Operations:
    - `+` add. Example:  `+ /version => "1.0.0"`
    - `-` remove. Example: `- /version` **Note:** No value is passed.
    - `=` replace. Example: `= /version => "1.0.1"`

    For XML, the path is an XPath string.

    **Example**:
    
    Input JSON:
    ```json
    {
        "version": "1.0.0",
        "keywords": [],
        "bugs": {
            "url": "http://www.dummy.com"
        }
    }
    ```
    Patch Syntax:
    ```yaml
    patch-syntax: |
          = /version => "1.0.1"
          + /author => "John Smith"
          = /bugs/url => "https://www.mydomain.com"
    ```
    Output JSON:
    ```json
    {
        "version": "1.0.1",
        "keywords": [],
        "author": "John Smith",
        "bugs": {
            "url": "https://www.mydomain.com"
        }
    }
    ```
- `output-patched-file`

    If `true`, the patched content is printed in the logs. *Optional. Default is `true`*. 

- `fail-if-no-files-patched`

    If `true`, fails the build, if no files are patched. *Optional. Default is `false`*. 

- `fail-if-error`

    If `true`, failes the build when an error occurrs. *Optional. Default is `false`* 

## Sample action

```yaml

name: "test action"
on:
  pull_request:
  push:
    branches:
      - master
      - 'feature/*'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1

    - name: Patch files
      uses: beforan/patch-files-action@master
      env:
        name: beforan
      with:
        filesType: xml
        files: |
          testfiles/**/*.xml
        patch-syntax: |
          = /version => "1.0.1"
          + /author => "${{ env.name }}"
          = /bugs/url => "https://www.google.com"
          + /buildId => "${{ github.run_number }}"

```

## Acknowledgment

- Inspired from https://marketplace.visualstudio.com/items?itemName=geeklearningio.gl-vsts-tasks-file-patch task for Azure Pipelines
