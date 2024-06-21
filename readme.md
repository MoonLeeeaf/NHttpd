## NHttpd

### What's it?

It's a simple HTTP server, and it can execute JavaScript code when access the non-binary file and give the result back to the response.

For example:

```html
<!-- ./page/demo.html -->
<script nhttpd>return `Hello, world! Path: ${req.path}`</script>
```

It prints "Hello, world! Path: /demo.html"

### Usage

1. git clone https://github.com/MoonLeeeaf/NHttpd

2. npm install

3. node nhttpd.js [port]

4. put your resources into ./pages folder

5. enjoy it :D

> [!WARNING]
> You need to restart NHttpd if some code's dependence has been changed. 
> For example, a.html required a file named b.js (through "require('./b.js')" in <script nhttpd>) , even you edit b.js,  a.html will still output the same result until you restart the server. 

### Credits

[express](https://github.com/expressjs/express)

[isBinaryFile](https://github.com/gjtorikian/isBinaryFile)

### License

```
MIT License

Copyright (c) 2024 满月叶

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
